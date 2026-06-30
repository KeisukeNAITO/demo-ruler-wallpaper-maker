const { assertPositive } = require('./assertPositive');
const { pxPerUnit } = require('./pxPerUnit');

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
  return value * pxPerUnit(unit, ppi);
}

module.exports = { lengthToPx };
