const { contextBridge, ipcRenderer } = require('electron');
const { calcVerticalTickLines } = require('./core/verticalTickLines');
const { calcTicks } = require('./core/ticks');

// レンダラへは最小限の純粋ロジックと保存 API のみ公開する。
contextBridge.exposeInMainWorld('rulerWallpaper', {
  calcVerticalTickLines,
  calcTicks,
  // PNG の dataURL を main に渡して保存する。結果(保存先/キャンセル/失敗)を返す。
  savePng: (dataUrl) => ipcRenderer.invoke('save-png', dataUrl),
});
