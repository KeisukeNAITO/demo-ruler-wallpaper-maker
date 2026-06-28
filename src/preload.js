const { contextBridge } = require('electron');
const { calcVerticalTickLines } = require('./core/verticalTickLines');

// レンダラへは最小限の純粋ロジックのみ公開する。
contextBridge.exposeInMainWorld('rulerWallpaper', {
  calcVerticalTickLines,
});
