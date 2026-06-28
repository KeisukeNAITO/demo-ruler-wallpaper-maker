const test = require('node:test');
const assert = require('node:assert');
const { calcVerticalTickLines } = require('../../src/core/verticalTickLines');

test('幅100・高さ200・間隔25では各目盛り位置に高さいっぱいの縦線を返す', () => {
  assert.deepStrictEqual(
    calcVerticalTickLines({ width: 100, height: 200, interval: 25 }),
    [
      { x: 0, y1: 0, y2: 200 },
      { x: 25, y1: 0, y2: 200 },
      { x: 50, y1: 0, y2: 200 },
      { x: 75, y1: 0, y2: 200 },
      { x: 100, y1: 0, y2: 200 },
    ],
  );
});

test('割り切れないときは幅を超える縦線を含めない', () => {
  assert.deepStrictEqual(
    calcVerticalTickLines({ width: 100, height: 50, interval: 30 }),
    [
      { x: 0, y1: 0, y2: 50 },
      { x: 30, y1: 0, y2: 50 },
      { x: 60, y1: 0, y2: 50 },
      { x: 90, y1: 0, y2: 50 },
    ],
  );
});

test('interval が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcVerticalTickLines({ width: 100, height: 200, interval: 0 }));
  assert.throws(() => calcVerticalTickLines({ width: 100, height: 200, interval: -5 }));
});

test('width が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcVerticalTickLines({ width: 0, height: 200, interval: 25 }));
  assert.throws(() => calcVerticalTickLines({ width: -100, height: 200, interval: 25 }));
});

test('height が 0 以下なら例外を投げる', () => {
  assert.throws(() => calcVerticalTickLines({ width: 100, height: 0, interval: 25 }));
  assert.throws(() => calcVerticalTickLines({ width: 100, height: -10, interval: 25 }));
});
