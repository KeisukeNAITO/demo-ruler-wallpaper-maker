// 画面の配線（プレビュー描画）。目盛りの計算は src/core のロジックを
// preload 経由（window.rulerWallpaper）で利用し、ここでは描画のみ行う。

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const interval = 50; // px。将来は UI から指定できるようにする（#2 では固定）。

const lines = window.rulerWallpaper.calcVerticalTickLines({
  width: canvas.width,
  height: canvas.height,
  interval,
});

ctx.strokeStyle = '#333333';
ctx.lineWidth = 1;
for (const { x, y1, y2 } of lines) {
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
}
