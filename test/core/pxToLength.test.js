const test = require('node:test');
const assert = require('node:assert');
const { pxToLength } = require('../../src/core/pxToLength');

// 25.4 が絡む換算は浮動小数になるため近似で比較する。
function assertApprox(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `expected ${actual} to be approximately ${expected}`
  );
}

test('px はそのままの値を返す(ppi 不要)', () => {
  assert.strictEqual(pxToLength({ px: 100, unit: 'px' }), 100);
});

test('位置 0 は 0 を返す(0 を許容)', () => {
  assert.strictEqual(pxToLength({ px: 0, unit: 'px' }), 0);
  assertApprox(pxToLength({ px: 0, unit: 'mm', ppi: 25.4 }), 0);
});

test('mm は px から物理長へ逆換算する(ppi=25.4 なら 1px=1mm)', () => {
  assertApprox(pxToLength({ px: 1, unit: 'mm', ppi: 25.4 }), 1);
  assertApprox(pxToLength({ px: 10, unit: 'mm', ppi: 25.4 }), 10);
});

test('cm は px から物理長へ逆換算する(ppi=25.4 なら 10px=1cm)', () => {
  assertApprox(pxToLength({ px: 10, unit: 'cm', ppi: 25.4 }), 1);
});

test('lengthToPx の逆になっている', () => {
  // ppi=96 で 50mm を px にして戻すと 50mm。
  assertApprox(pxToLength({ px: (50 * 96) / 25.4, unit: 'mm', ppi: 96 }), 50);
});

test('px が負なら例外を投げる', () => {
  assert.throws(() => pxToLength({ px: -1, unit: 'px' }));
});

test('mm / cm で ppi が正でなければ例外を投げる', () => {
  assert.throws(() => pxToLength({ px: 10, unit: 'mm', ppi: 0 }));
  assert.throws(() => pxToLength({ px: 10, unit: 'cm' }));
});

test('未知の単位は例外を投げる', () => {
  assert.throws(() => pxToLength({ px: 10, unit: 'inch', ppi: 96 }));
});
