const { assertPositive } = require('./assertPositive');

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
  if (typeof text !== 'string') {
    throw new Error(`間隔は文字列で指定してください: ${text}`);
  }

  const trimmed = text.trim();
  if (trimmed === '') {
    throw new Error('間隔を入力してください');
  }

  // 全角数字や単位付き("50px")を弾くため Number で厳密に変換する。
  // parseFloat は "50px" を 50 と解釈してしまうため使わない。
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    throw new Error(`間隔は数値で指定してください: ${text}`);
  }

  assertPositive('間隔', value);
  return value;
}

module.exports = { parseInterval };
