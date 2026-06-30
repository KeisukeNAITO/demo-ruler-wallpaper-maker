const { assertPositive } = require('./assertPositive');

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
  if (typeof text !== 'string') {
    throw new Error(`${name} は文字列で指定してください: ${text}`);
  }

  const trimmed = text.trim();
  if (trimmed === '') {
    throw new Error(`${name} を入力してください`);
  }

  // 全角数字や単位付き("1000px")を弾くため Number で厳密に変換する。
  // parseFloat は "1000px" を 1000 と解釈してしまうため使わない。
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} は数値で指定してください: ${text}`);
  }

  if (!Number.isInteger(value)) {
    throw new Error(`${name} は整数で指定してください: ${text}`);
  }

  assertPositive(name, value);
  return value;
}

module.exports = { parseDimension };
