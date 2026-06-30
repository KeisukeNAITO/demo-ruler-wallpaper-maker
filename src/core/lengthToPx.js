const { assertPositive } = require('./assertPositive');

/** 1 インチ = 25.4 ミリメートル。 */
const MM_PER_INCH = 25.4;

/**
 * 間隔(選択単位)を描画用の px 長へ換算する。px はそのまま、mm は ppi で換算、
 * cm は mm の 10 倍。value は正の数。mm / cm のときは ppi も正の数が必要
 * (px は ppi 不要)。未知の単位は例外を投げる。
 *
 * @param {{value: number, unit: 'px'|'mm'|'cm', ppi?: number}} params
 * @returns {number} px 長
 */
function lengthToPx({ value, unit, ppi }) {
  assertPositive('間隔', value);

  if (unit === 'px') {
    return value;
  }
  if (unit === 'mm') {
    assertPositive('PPI', ppi);
    return (value * ppi) / MM_PER_INCH;
  }
  if (unit === 'cm') {
    assertPositive('PPI', ppi);
    return (value * 10 * ppi) / MM_PER_INCH;
  }
  throw new Error(`未知の単位です: ${unit}`);
}

module.exports = { lengthToPx, MM_PER_INCH };
