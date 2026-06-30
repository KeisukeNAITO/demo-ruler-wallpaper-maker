const { assertPositive } = require('./assertPositive');
const { parseFiniteNumber } = require('./parseFiniteNumber');

/**
 * 入力文字列を正の有限数へパース・検証する。前後の空白は許容する。空文字・
 * 数値でない文字列・全角数字・単位付き・0 以下・非有限な値は意味のある
 * メッセージ付きで例外を投げる。小数は許容する
 * （整数のみ必要な場合は parseDimension を使う）。
 *
 * @param {string} name 値の名称(エラーメッセージ用。例 "間隔" / "対角サイズ")
 * @param {string} text 入力文字列
 * @returns {number} 正の有限数
 */
function parsePositiveNumber(name, text) {
  const value = parseFiniteNumber(name, text);
  assertPositive(name, value);
  return value;
}

module.exports = { parsePositiveNumber };
