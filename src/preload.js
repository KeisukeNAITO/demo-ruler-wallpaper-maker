const { contextBridge, ipcRenderer } = require('electron');
const { calcTicks } = require('./core/ticks');
const { parseInterval } = require('./core/parseInterval');

// レンダラへは最小限の純粋ロジックと保存 API のみ公開する。
contextBridge.exposeInMainWorld('rulerWallpaper', {
  calcTicks,
  // 入力文字列を間隔(px)の正の有限数へパース/検証する。不正なら例外。
  parseInterval,
  // PNG の dataURL を main に渡して保存する。結果(保存先/キャンセル/失敗)を返す。
  savePng: (dataUrl) => ipcRenderer.invoke('save-png', dataUrl),
});
