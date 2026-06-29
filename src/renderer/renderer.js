// 画面の配線（プレビュー描画）。目盛りの計算は src/core のロジックを
// preload 経由（window.rulerWallpaper）で利用し、ここでは描画のみ行う。

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const interval = 50; // px。将来は UI から指定できるようにする（#9）。
const majorEvery = 5; // 何本ごとを主目盛りにするか。将来は指定可能にする。

// 指定軸の目盛りを描く。縦横で計算は同じ calcTicks を使い、
// vertical=true なら length=幅で縦線(上端にラベル)、false なら length=高さで横線(左端にラベル)。
function drawAxisTicks(vertical) {
  const length = vertical ? canvas.width : canvas.height;
  const ticks = window.rulerWallpaper.calcTicks({ length, interval, majorEvery });

  for (const { pos, major } of ticks) {
    // 主目盛りは太く濃く、副目盛りは細く薄く描く。
    ctx.strokeStyle = major ? '#333333' : '#bbbbbb';
    ctx.lineWidth = major ? 2 : 1;
    ctx.beginPath();
    if (vertical) {
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
    } else {
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
    }
    ctx.stroke();

    // 主目盛りには位置(px)を数値ラベルとして描く。
    if (major) {
      ctx.fillStyle = '#333333';
      if (vertical) {
        ctx.fillText(String(pos), pos + 2, 2);
      } else {
        ctx.fillText(String(pos), 2, pos + 2);
      }
    }
  }
}

ctx.font = '12px sans-serif';
ctx.textBaseline = 'top';
drawAxisTicks(true); // 縦方向の目盛り
drawAxisTicks(false); // 横方向の目盛り

// 「PNG で保存」: 表示中の canvas を PNG 化して main 側で保存する。
// 保存・ダイアログは preload 経由の savePng に委ね、ここでは結果表示のみ行う。
const saveButton = document.getElementById('save');
const status = document.getElementById('status');

saveButton.addEventListener('click', async () => {
  const dataUrl = canvas.toDataURL('image/png');
  const result = await window.rulerWallpaper.savePng(dataUrl);

  if (result.canceled) {
    status.textContent = '保存をキャンセルしました';
  } else if (result.ok) {
    status.textContent = `保存しました: ${result.filePath}`;
  } else {
    status.textContent = `保存に失敗しました: ${result.error}`;
  }
});
