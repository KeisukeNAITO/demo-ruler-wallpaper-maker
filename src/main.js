const { app, BrowserWindow } = require('electron');
const path = require('node:path');

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
