const { contextBridge, ipcRenderer } = require('electron');
const { calcTicks } = require('./core/ticks');
const { parseInterval } = require('./core/parseInterval');
const { parseDimension } = require('./core/parseDimension');

// レンダラへは最小限の純粋ロジックと保存 API のみ公開する。
contextBridge.exposeInMainWorld('rulerWallpaper', {
  calcTicks,
  // 入力文字列を間隔(px)の正の有限数へパース/検証する。不正なら例外。
  parseInterval,
  // 入力文字列を解像度(幅/高さ px)の正の整数へパース/検証する。不正なら例外。
  parseDimension,
  // PNG の dataURL を main に渡して保存する。結果(保存先/キャンセル/失敗)を返す。
  savePng: (dataUrl) => ipcRenderer.invoke('save-png', dataUrl),
});
