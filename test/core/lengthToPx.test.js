const test = require('node:test');
const assert = require('node:assert');
const { lengthToPx } = require('../../src/core/lengthToPx');

// 25.4 が絡む換算は浮動小数になるため近似で比較する。
function assertApprox(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `expected ${actual} to be approximately ${expected}`
  );
}

test('px はそのままの値を返す(ppi 不要)', () => {
  assert.strictEqual(lengthToPx({ value: 50, unit: 'px' }), 50);
});

test('mm は ppi で px へ換算する(ppi=25.4 なら 1mm=1px)', () => {
  assertApprox(lengthToPx({ value: 1, unit: 'mm', ppi: 25.4 }), 1);
  assertApprox(lengthToPx({ value: 10, unit: 'mm', ppi: 25.4 }), 10);
});

test('cm は mm の 10 倍(ppi=25.4 なら 1cm=10px)', () => {
  assertApprox(lengthToPx({ value: 1, unit: 'cm', ppi: 25.4 }), 10);
});

test('mm は ppi に比例する', () => {
  // ppi=96, 25.4mm(=1inch) は 96px。
  assertApprox(lengthToPx({ value: 25.4, unit: 'mm', ppi: 96 }), 96);
});

test('value が正でなければ例外を投げる', () => {
  assert.throws(() => lengthToPx({ value: 0, unit: 'px' }));
  assert.throws(() => lengthToPx({ value: -1, unit: 'mm', ppi: 25.4 }));
});

test('mm / cm で ppi が正でなければ例外を投げる', () => {
  assert.throws(() => lengthToPx({ value: 1, unit: 'mm', ppi: 0 }));
  assert.throws(() => lengthToPx({ value: 1, unit: 'cm' }));
});

test('未知の単位は例外を投げる', () => {
  assert.throws(() => lengthToPx({ value: 1, unit: 'inch', ppi: 96 }));
});
