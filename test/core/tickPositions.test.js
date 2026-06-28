const test = require('node:test');
const assert = require('node:assert');
const { calcTickPositions } = require('../../src/core/tickPositions');

test('幅100・間隔25では右端ちょうどまで含む', () => {
  assert.deepStrictEqual(
    calcTickPositions({ length: 100, interval: 25 }),
    [0, 25, 50, 75, 100],
  );
});

test('割り切れないときは幅を超える位置を含めない', () => {
  assert.deepStrictEqual(
    calcTickPositions({ length: 100, interval: 30 }),
    [0, 30, 60, 90],
  );
});

test('幅と間隔が等しいときは0と右端の2点になる', () => {
  assert.deepStrictEqual(
    calcTickPositions({ length: 50, interval: 50 }),
    [0, 50],
  );
});

test('interval が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcTickPositions({ length: 100, interval: 0 }));
  assert.throws(() => calcTickPositions({ length: 100, interval: -5 }));
});

test('length が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcTickPositions({ length: 0, interval: 25 }));
  assert.throws(() => calcTickPositions({ length: -100, interval: 25 }));
});
