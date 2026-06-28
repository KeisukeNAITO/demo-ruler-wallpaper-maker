/**
 * 値が正の数でなければ意味のあるメッセージ付きで例外を投げる。
 *
 * @param {string} name 値の名称(エラーメッセージ用)
 * @param {number} value 検証対象の値
 */
function assertPositive(name, value) {
  if (!(value > 0)) {
    throw new Error(`${name} は正の数である必要があります: ${value}`);
  }
}

module.exports = { assertPositive };
