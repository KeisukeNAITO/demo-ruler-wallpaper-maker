const { assertPositive } = require('./assertPositive');
const { parseFiniteNumber } = require('./parseFiniteNumber');

/**
 * 入力文字列を出力解像度の幅・高さ(px)の正の整数へパース・検証する。
 * 前後の空白は許容する。空文字・数値でない文字列・全角数字・単位付き
 * (例 "1000px")・小数・0 以下・非有限な値は意味のあるメッセージ付きで
 * 例外を投げる。解像度は整数 px 前提のため小数は許容しない
 * （間隔 parseInterval が小数を許容するのと異なる点）。
 *
 * @param {string} name 値の名称(エラーメッセージ用。例 "幅" / "高さ")
 * @param {string} text 入力文字列
 * @returns {number} 正の整数の寸法(px)
 */
function parseDimension(name, text) {
  const value = parseFiniteNumber(name, text);

  if (!Number.isInteger(value)) {
    throw new Error(`${name} は整数で指定してください: ${text}`);
  }

  assertPositive(name, value);
  return value;
}

module.exports = { parseDimension };
