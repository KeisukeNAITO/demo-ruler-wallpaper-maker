// 画面の配線（プレビュー描画）。目盛りの計算は src/core のロジックを
// preload 経由（window.rulerWallpaper）で利用し、ここでは描画のみ行う。

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const majorEvery = 5; // 何本ごとを主目盛りにするか。当面 5 固定（UI 化は #9 対象外）。

// 真の PPI を保持する。updatePpi 成功時に値を入れ、不正/未確定なら null。
// mm/cm の換算に使う（px 単位では不要）。
let currentPpi = null;

// 主目盛りのラベル文字列を作る。選択単位の物理位置に換算して表示する。
// px はそのままの数値、mm/cm は小数 1 桁＋単位を付ける。
function formatTickLabel(pos, unit) {
  const length = window.rulerWallpaper.pxToLength({ px: pos, unit, ppi: currentPpi });
  return unit === 'px' ? String(length) : `${length.toFixed(1)}${unit}`;
}

// 指定軸の目盛りを描く。縦横で計算は同じ calcTicks を使い、
// vertical=true なら length=幅で縦線(上端にラベル)、false なら length=高さで横線(左端にラベル)。
// interval は px 換算済みの間隔、unit はラベル表示用の単位。
function drawAxisTicks(vertical, interval, unit) {
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

    // 主目盛りには選択単位での位置を数値ラベルとして描く。
    if (major) {
      ctx.fillStyle = '#333333';
      const label = formatTickLabel(pos, unit);
      if (vertical) {
        ctx.fillText(label, pos + 2, 2);
      } else {
        ctx.fillText(label, 2, pos + 2);
      }
    }
  }
}

// 指定間隔(px)でプレビュー全体を描き直す。再描画なので必ず一旦クリアする。
// canvas の解像度を変更すると ctx の状態(フォント等)はリセットされるため、
// 文字描画の設定はここで毎回行う。unit はラベル表示用。
function renderPreview(interval, unit) {
  ctx.font = '12px sans-serif';
  ctx.textBaseline = 'top';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxisTicks(true, interval, unit); // 縦方向の目盛り
  drawAxisTicks(false, interval, unit); // 横方向の目盛り
}

// 間隔入力をパースし、選択単位から px へ換算して返す。正常ならエラー欄を消して
// px 値を返し、不正なら専用エラー欄にメッセージを出して null を返す（描画は
// 呼び出し側で抑止）。mm/cm を選んでいて PPI が未確定/不正(currentPpi が null)の
// ときは、対角サイズの入力を促すメッセージを出す（#9 案A=直前プレビュー保持）。
const intervalInput = document.getElementById('interval');
const intervalError = document.getElementById('interval-error');
const unitSelect = document.getElementById('unit');

function readIntervalPx() {
  const unit = unitSelect.value;
  let value;
  try {
    value = window.rulerWallpaper.parseInterval(intervalInput.value);
  } catch (error) {
    intervalError.textContent = error.message;
    return null;
  }
  if ((unit === 'mm' || unit === 'cm') && currentPpi === null) {
    intervalError.textContent =
      'mm/cm で指定するには先に画面の対角サイズ(インチ)を入力してください';
    return null;
  }
  intervalError.textContent = '';
  return window.rulerWallpaper.lengthToPx({ value, unit, ppi: currentPpi });
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

// 入力全体から依存順にプレビューを更新する。
// applyResolution(canvas 確定) → updatePpi(canvas 反映後に PPI) →
// readIntervalPx(間隔を px 換算) → renderPreview(px 間隔) の順に揃える。
// 解像度・間隔いずれかが不正なら、その側は専用エラー欄に表示し描画は直前の状態を
// 保つ（#9 案A を踏襲）。PPI は mm/cm 換算に使うため間隔換算より先に更新する。
function render() {
  const resolutionOk = applyResolution();
  updatePpi(); // currentPpi を確定（解像度反映後の canvas を使う）
  const intervalPx = readIntervalPx();
  if (resolutionOk && intervalPx !== null) {
    renderPreview(intervalPx, unitSelect.value);
  }
}

// 画面の対角サイズ(インチ)と現在の出力解像度から真の PPI を算出して表示する。
// 表示に加え currentPpi を更新し、mm/cm の間隔換算に使う。不正/未確定なら
// 表示は直前のまま保ちつつ currentPpi は null にする（mm/cm 換算を抑止）。
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
    currentPpi = null; // 不正値では mm/cm 換算を成立させない
    return; // PPI 表示自体は更新せず直前のまま保つ
  }
  ppiError.textContent = '';
  const ppi = window.rulerWallpaper.calcPpi({
    widthPx: canvas.width,
    heightPx: canvas.height,
    diagonalInch,
  });
  currentPpi = ppi;
  ppiOutput.textContent = `PPI: ${ppi.toFixed(1)}`;
}

// すべての入力変更で依存順にまとめて再描画する（render が PPI 更新も内包する）。
intervalInput.addEventListener('input', render);
unitSelect.addEventListener('change', render);
widthInput.addEventListener('input', render);
heightInput.addEventListener('input', render);
diagonalInchInput.addEventListener('input', render);

render(); // 初期値(1000x600 / 50px / 単位 px)で初回描画と PPI 表示

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
