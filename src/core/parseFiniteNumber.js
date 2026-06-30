/**
 * 入力文字列を有限数へパースする。前後の空白は許容する。文字列でない・空文字・
 * 数値でない(全角数字や単位付きを含む)・非有限な値は意味のあるメッセージ付きで
 * 例外を投げる。正負・整数/小数の判定は呼び出し側が行う。
 *
 * @param {string} name 値の名称(エラーメッセージ用)
 * @param {string} text 入力文字列
 * @returns {number} 有限数
 */
function parseFiniteNumber(name, text) {
  if (typeof text !== 'string') {
    throw new Error(`${name} は文字列で指定してください: ${text}`);
  }

  const trimmed = text.trim();
  if (trimmed === '') {
    throw new Error(`${name} を入力してください`);
  }

  // 全角数字や単位付き("50px")を弾くため Number で厳密に変換する。
  // parseFloat は "50px" を 50 と解釈してしまうため使わない。
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} は数値で指定してください: ${text}`);
  }

  return value;
}

module.exports = { parseFiniteNumber };
