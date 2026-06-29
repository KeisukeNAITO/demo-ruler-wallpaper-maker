const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { dataUrlToPngBuffer } = require('./core/pngDataUrl');
const { ensurePngExtension } = require('./core/pngFileName');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // preload で src/core の純粋ロジックを require するため sandbox を無効化する。
      // contextIsolation:true / nodeIntegration:false は維持し、公開 API は最小限に絞る。
      sandbox: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

// レンダラから受け取った PNG dataURL を、保存ダイアログで選んだ場所に書き出す。
// 純粋ロジック(dataUrl→Buffer 変換・拡張子保証)は src/core に委ね、ここは配線のみ。
ipcMain.handle('save-png', async (event, dataUrl) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: 'ruler-wallpaper.png',
    filters: [{ name: 'PNG 画像', extensions: ['png'] }],
  });

  if (canceled || !filePath) {
    return { canceled: true };
  }

  try {
    const target = ensurePngExtension(filePath);
    const buffer = dataUrlToPngBuffer(dataUrl);
    await fs.writeFile(target, buffer);
    return { ok: true, filePath: target };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  // macOS: ウィンドウが無い状態でアクティブ化されたら開き直す
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS 以外は全ウィンドウを閉じたら終了する
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
