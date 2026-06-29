const test = require('node:test');
const assert = require('node:assert');
const { calcTicks } = require('../../src/core/ticks');

test('majorEvery 本ごとに主目盛り(major:true)になる', () => {
  assert.deepStrictEqual(
    calcTicks({ length: 100, interval: 25, majorEvery: 2 }),
    [
      { pos: 0, major: true },
      { pos: 25, major: false },
      { pos: 50, major: true },
      { pos: 75, major: false },
      { pos: 100, major: true },
    ],
  );
});

test('majorEvery が 1 ならすべて主目盛り', () => {
  assert.deepStrictEqual(
    calcTicks({ length: 60, interval: 20, majorEvery: 1 }),
    [
      { pos: 0, major: true },
      { pos: 20, major: true },
      { pos: 40, major: true },
      { pos: 60, major: true },
    ],
  );
});

test('interval が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcTicks({ length: 100, interval: 0, majorEvery: 2 }));
  assert.throws(() => calcTicks({ length: 100, interval: -5, majorEvery: 2 }));
});

test('length が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcTicks({ length: 0, interval: 25, majorEvery: 2 }));
  assert.throws(() => calcTicks({ length: -100, interval: 25, majorEvery: 2 }));
});

test('majorEvery が 1 以上の整数でなければ例外を投げる', () => {
  assert.throws(() => calcTicks({ length: 100, interval: 25, majorEvery: 0 }));
  assert.throws(() => calcTicks({ length: 100, interval: 25, majorEvery: -1 }));
  assert.throws(() => calcTicks({ length: 100, interval: 25, majorEvery: 2.5 }));
});
