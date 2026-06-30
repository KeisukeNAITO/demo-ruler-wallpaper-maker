const { assertPositive } = require('./assertPositive');
const { parseFiniteNumber } = require('./parseFiniteNumber');

/**
 * 入力文字列を目盛り間隔(px)の正の有限数へパース・検証する。
 * 前後の空白は許容する。空文字・数値でない文字列・全角数字・単位付き
 * (例 "50px")・0 以下・非有限な値は意味のあるメッセージ付きで例外を投げる。
 * 小数は許容し、整数への丸めはしない（将来の単位 mm/cm 換算を見据える）。
 *
 * @param {string} text 入力文字列
 * @returns {number} 正の有限数の間隔(px)
 */
function parseInterval(text) {
  const value = parseFiniteNumber('間隔', text);
  assertPositive('間隔', value);
  return value;
}

module.exports = { parseInterval };
