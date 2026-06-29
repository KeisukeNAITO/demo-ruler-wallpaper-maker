// 画面の配線（プレビュー描画）。目盛りの計算は src/core のロジックを
// preload 経由（window.rulerWallpaper）で利用し、ここでは描画のみ行う。

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const majorEvery = 5; // 何本ごとを主目盛りにするか。当面 5 固定（UI 化は #9 対象外）。

// 指定軸の目盛りを描く。縦横で計算は同じ calcTicks を使い、
// vertical=true なら length=幅で縦線(上端にラベル)、false なら length=高さで横線(左端にラベル)。
function drawAxisTicks(vertical, interval) {
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

// 指定間隔でプレビュー全体を描き直す。再描画なので必ず一旦クリアする。
function renderPreview(interval) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxisTicks(true, interval); // 縦方向の目盛り
  drawAxisTicks(false, interval); // 横方向の目盛り
}

// 間隔入力: 変更のたびにパース/検証し、正常なら即時再描画する。
// 不正なら描画は変えず（直前の正常プレビューを保持）、専用欄にメッセージを出す。
const intervalInput = document.getElementById('interval');
const intervalError = document.getElementById('interval-error');

function updatePreviewFromInput() {
  let interval;
  try {
    interval = window.rulerWallpaper.parseInterval(intervalInput.value);
  } catch (error) {
    intervalError.textContent = error.message;
    return;
  }
  intervalError.textContent = '';
  renderPreview(interval);
}

intervalInput.addEventListener('input', updatePreviewFromInput);
updatePreviewFromInput(); // 初期値(50px)で初回描画

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
