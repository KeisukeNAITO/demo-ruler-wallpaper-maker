/**
 * ファイル名(またはパス)が .png で終わることを保証する。
 * 保存ダイアログで拡張子を省略しても確実に PNG として保存するために使う。
 * 既に .png(大文字小文字は無視)で終わる場合はそのまま返す。
 *
 * @param {string} name ファイル名またはパス
 * @returns {string} .png で終わるファイル名またはパス
 */
function ensurePngExtension(name) {
  if (name.toLowerCase().endsWith('.png')) {
    return name;
  }
  return `${name}.png`;
}

module.exports = { ensurePngExtension };
