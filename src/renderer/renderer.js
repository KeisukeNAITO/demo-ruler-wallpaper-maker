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

// 指定間隔でプレビュー全体を描き直す。再描画なので必ず一旦クリアする。
// canvas の解像度を変更すると ctx の状態(フォント等)はリセットされるため、
// 文字描画の設定はここで毎回行う。
function renderPreview(interval) {
  ctx.font = '12px sans-serif';
  ctx.textBaseline = 'top';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxisTicks(true, interval); // 縦方向の目盛り
  drawAxisTicks(false, interval); // 横方向の目盛り
}

// 間隔入力をパースする。正常ならエラー欄を消して値を返し、不正なら
// 専用エラー欄にメッセージを出して null を返す（描画は呼び出し側で抑止）。
const intervalInput = document.getElementById('interval');
const intervalError = document.getElementById('interval-error');

function readInterval() {
  try {
    const interval = window.rulerWallpaper.parseInterval(intervalInput.value);
    intervalError.textContent = '';
    return interval;
  } catch (error) {
    intervalError.textContent = error.message;
    return null;
  }
}

// 幅・高さ入力をパースして canvas の内部解像度に反映する。正常なら true、
// 不正なら専用エラー欄にメッセージを出し、解像度は直前のまま false を返す。
// 値が変わらないときは代入を避ける（canvas への width/height 代入は内容を
// クリアしてしまうため、間隔だけ変えた際に直前プレビューを保つ）。
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resolutionError = document.getElementById('resolution-error');

function applyResolution() {
  let width;
  let height;
  try {
    width = window.rulerWallpaper.parseDimension('幅', widthInput.value);
    height = window.rulerWallpaper.parseDimension('高さ', heightInput.value);
  } catch (error) {
    resolutionError.textContent = error.message;
    return false;
  }
  resolutionError.textContent = '';
  if (canvas.width !== width) {
    canvas.width = width;
  }
  if (canvas.height !== height) {
    canvas.height = height;
  }
  return true;
}

// 解像度と間隔の双方が正常なときだけプレビューを再描画する。
// 不正な側は各専用エラー欄に表示し、描画は直前の状態を保つ（#9 案A を踏襲）。
function updatePreview() {
  const resolutionOk = applyResolution();
  const interval = readInterval();
  if (resolutionOk && interval !== null) {
    renderPreview(interval);
  }
}

// 画面の対角サイズ(インチ)と現在の出力解像度から真の PPI を算出して表示する。
// PPI はこの PBI では表示のみ（目盛り間隔の単位 mm/cm への利用は次 PBI）。
const diagonalInchInput = document.getElementById('diagonal-inch');
const ppiOutput = document.getElementById('ppi');
const ppiError = document.getElementById('ppi-error');

function updatePpi() {
  let diagonalInch;
  try {
    diagonalInch = window.rulerWallpaper.parsePositiveNumber(
      '対角サイズ',
      diagonalInchInput.value,
    );
  } catch (error) {
    ppiError.textContent = error.message;
    return; // 不正値では PPI 表示を更新せず直前のまま保つ
  }
  ppiError.textContent = '';
  const ppi = window.rulerWallpaper.calcPpi({
    widthPx: canvas.width,
    heightPx: canvas.height,
    diagonalInch,
  });
  ppiOutput.textContent = `PPI: ${ppi.toFixed(1)}`;
}

intervalInput.addEventListener('input', updatePreview);
widthInput.addEventListener('input', () => {
  updatePreview();
  updatePpi(); // 解像度が変わると PPI も追従する
});
heightInput.addEventListener('input', () => {
  updatePreview();
  updatePpi();
});
diagonalInchInput.addEventListener('input', updatePpi);

updatePreview(); // 初期値(1000x600 / 50px)で初回描画
updatePpi(); // 初期値(対角サイズ)で PPI を初回表示

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
