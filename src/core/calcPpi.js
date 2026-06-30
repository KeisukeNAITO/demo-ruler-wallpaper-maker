const { assertPositive } = require('./assertPositive');

/**
 * 画面のピクセル解像度と物理サイズ(対角インチ)から真の PPI(pixels per inch)を求める。
 * 対角ピクセル数 √(幅²+高²) を対角インチで割る。幅・高さ・対角インチは正の数。
 *
 * 真の PPI は実寸(mm/cm)で目盛りを描くための基準になる。OS から取得できる
 * scaleFactor(論理 96dpi 基準の拡大率)とは異なり、物理サイズ(インチ)が要るため
 * 対角インチは手入力で受け取る。
 *
 * @param {{widthPx: number, heightPx: number, diagonalInch: number}} params
 * @returns {number} PPI(pixels per inch)
 */
function calcPpi({ widthPx, heightPx, diagonalInch }) {
  assertPositive('幅', widthPx);
  assertPositive('高さ', heightPx);
  assertPositive('対角サイズ', diagonalInch);

  const diagonalPx = Math.hypot(widthPx, heightPx);
  return diagonalPx / diagonalInch;
}

module.exports = { calcPpi };
