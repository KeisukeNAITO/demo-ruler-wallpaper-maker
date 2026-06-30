const { assertPositive } = require('./assertPositive');

/** 1 インチ = 25.4 ミリメートル。 */
const MM_PER_INCH = 25.4;

/**
 * 単位 1 つあたりの px 数(換算係数)を返す。px は 1、mm は ppi/25.4、
 * cm は ppi*10/25.4。mm / cm のときは ppi が正の数必要(px は ppi 不要)。
 * 未知の単位は例外を投げる。lengthToPx / pxToLength の共通基盤。
 *
 * @param {'px'|'mm'|'cm'} unit 単位
 * @param {number} [ppi] PPI(mm / cm のとき必須)
 * @returns {number} 1 単位あたりの px 数
 */
function pxPerUnit(unit, ppi) {
  if (unit === 'px') {
    return 1;
  }
  if (unit === 'mm') {
    assertPositive('PPI', ppi);
    return ppi / MM_PER_INCH;
  }
  if (unit === 'cm') {
    assertPositive('PPI', ppi);
    return (ppi * 10) / MM_PER_INCH;
  }
  throw new Error(`未知の単位です: ${unit}`);
}

module.exports = { pxPerUnit, MM_PER_INCH };
