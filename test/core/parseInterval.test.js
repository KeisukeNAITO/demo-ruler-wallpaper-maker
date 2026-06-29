const test = require('node:test');
const assert = require('node:assert');
const { parseInterval } = require('../../src/core/parseInterval');

test('整数の文字列を数値に変換する', () => {
  assert.strictEqual(parseInterval('50'), 50);
});

test('小数の文字列を数値に変換する', () => {
  assert.strictEqual(parseInterval('12.5'), 12.5);
});

test('前後の空白は許容する', () => {
  assert.strictEqual(parseInterval('  50  '), 50);
});

test('空文字・空白のみは例外を投げる', () => {
  assert.throws(() => parseInterval(''));
  assert.throws(() => parseInterval('   '));
});

test('数値でない文字列は例外を投げる', () => {
  assert.throws(() => parseInterval('abc'));
});

test('単位付き文字列は例外を投げる', () => {
  assert.throws(() => parseInterval('50px'));
});

test('全角数字は例外を投げる', () => {
  assert.throws(() => parseInterval('５０'));
});

test('0 以下は例外を投げる', () => {
  assert.throws(() => parseInterval('0'));
  assert.throws(() => parseInterval('-5'));
});

test('非有限な値は例外を投げる', () => {
  assert.throws(() => parseInterval('Infinity'));
});
