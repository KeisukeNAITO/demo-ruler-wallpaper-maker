const test = require('node:test');
const assert = require('node:assert');
const { ensurePngExtension } = require('../../src/core/pngFileName');

test('拡張子が無ければ .png を付与する', () => {
  assert.strictEqual(ensurePngExtension('mywall'), 'mywall.png');
});

test('既に .png なら変更しない', () => {
  assert.strictEqual(ensurePngExtension('mywall.png'), 'mywall.png');
});

test('.png の大文字小文字は無視してそのまま返す', () => {
  assert.strictEqual(ensurePngExtension('photo.PNG'), 'photo.PNG');
});

test('別拡張子なら .png を付け足す', () => {
  assert.strictEqual(ensurePngExtension('a.jpg'), 'a.jpg.png');
});

test('パスを含んでいても末尾に .png を付与する', () => {
  assert.strictEqual(
    ensurePngExtension('C:\\images\\ruler-wallpaper'),
    'C:\\images\\ruler-wallpaper.png',
  );
});
