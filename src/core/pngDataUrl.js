const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

/**
 * PNG の dataURL を、ファイル書き込みに使える Buffer に変換する。
 * renderer の canvas.toDataURL('image/png') が返す
 * "data:image/png;base64,...." 形式のみ受け付ける。
 *
 * @param {string} dataUrl PNG の base64 dataURL
 * @returns {Buffer} デコード済みの PNG バイト列
 */
function dataUrlToPngBuffer(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith(PNG_DATA_URL_PREFIX)) {
    throw new Error(
      `PNG の base64 dataURL ではありません: ${String(dataUrl).slice(0, 32)}`,
    );
  }

  const base64 = dataUrl.slice(PNG_DATA_URL_PREFIX.length);
  return Buffer.from(base64, 'base64');
}

module.exports = { dataUrlToPngBuffer };
