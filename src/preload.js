const { contextBridge } = require('electron');

// レンダラへ公開する API はここに最小限で追加する。
// 現時点で公開する API はない。
contextBridge.exposeInMainWorld('rulerWallpaper', {});
