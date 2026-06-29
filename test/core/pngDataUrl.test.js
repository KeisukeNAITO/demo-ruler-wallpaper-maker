const test = require('node:test');
const assert = require('node:assert');
const { dataUrlToPngBuffer } = require('../../src/core/pngDataUrl');

test('PNG の dataURL を base64 デコードした Buffer を返す', () => {
  // base64 "AAEC" はバイト列 [0, 1, 2] にデコードされる
  assert.deepStrictEqual(
    dataUrlToPngBuffer('data:image/png;base64,AAEC'),
    Buffer.from([0, 1, 2]),
  );
});

test('元のバイト列と往復できる（Buffer→dataURL→Buffer）', () => {
  const original = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG シグネチャ
  const dataUrl = `data:image/png;base64,${original.toString('base64')}`;
  assert.deepStrictEqual(dataUrlToPngBuffer(dataUrl), original);
});

test('PNG 以外の MIME なら例外を投げる', () => {
  assert.throws(() => dataUrlToPngBuffer('data:image/jpeg;base64,AAEC'));
});

test('base64 エンコードでない dataURL なら例外を投げる', () => {
  assert.throws(() => dataUrlToPngBuffer('data:image/png,AAEC'));
});

test('dataURL 形式でない文字列なら例外を投げる', () => {
  assert.throws(() => dataUrlToPngBuffer('AAEC'));
});
