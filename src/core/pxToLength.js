const { pxPerUnit } = require('./pxPerUnit');

/**
 * px 位置を選択単位の物理長へ逆換算する(目盛りラベル用)。lengthToPx の逆。
 * px はそのまま、mm / cm は ppi で逆換算する。px は位置のため 0 以上を許容する
 * (assertPositive は使わない)。mm / cm のときは ppi が正の数必要。
 * 未知の単位は例外を投げる。
 *
 * @param {{px: number, unit: 'px'|'mm'|'cm', ppi?: number}} params
 * @returns {number} 選択単位での物理長
 */
function pxToLength({ px, unit, ppi }) {
  if (!(px >= 0)) {
    throw new Error(`px は 0 以上である必要があります: ${px}`);
  }
  return px / pxPerUnit(unit, ppi);
}

module.exports = { pxToLength };
