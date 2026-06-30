const test = require('node:test');
const assert = require('node:assert');
const { calcPpi } = require('../../src/core/calcPpi');

test('対角ピクセル数(√(幅²+高²))を対角インチで割って PPI を返す', () => {
  // 3-4-5 の直角三角形: 対角px=5。5px / 5inch = 1 PPI。
  assert.strictEqual(calcPpi({ widthPx: 3, heightPx: 4, diagonalInch: 5 }), 1);
});

test('解像度に比例して PPI が大きくなる', () => {
  // 対角px=50。50px / 5inch = 10 PPI。
  assert.strictEqual(calcPpi({ widthPx: 30, heightPx: 40, diagonalInch: 5 }), 10);
});

test('幅が正でなければ例外を投げる', () => {
  assert.throws(() => calcPpi({ widthPx: 0, heightPx: 40, diagonalInch: 5 }));
});

test('高さが正でなければ例外を投げる', () => {
  assert.throws(() => calcPpi({ widthPx: 30, heightPx: -1, diagonalInch: 5 }));
});

test('対角インチが正でなければ例外を投げる', () => {
  assert.throws(() => calcPpi({ widthPx: 30, heightPx: 40, diagonalInch: 0 }));
});
