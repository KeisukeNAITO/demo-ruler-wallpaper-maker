const test = require('node:test');
const assert = require('node:assert');
const { parseDimension } = require('../../src/core/parseDimension');

test('正の整数の文字列を数値に変換する', () => {
  assert.strictEqual(parseDimension('幅', '1000'), 1000);
});

test('前後の空白は許容する', () => {
  assert.strictEqual(parseDimension('高さ', '  600  '), 600);
});

test('空文字・空白のみは例外を投げる', () => {
  assert.throws(() => parseDimension('幅', ''));
  assert.throws(() => parseDimension('幅', '   '));
});

test('数値でない文字列は例外を投げる', () => {
  assert.throws(() => parseDimension('幅', 'abc'));
});

test('単位付き文字列は例外を投げる', () => {
  assert.throws(() => parseDimension('幅', '1000px'));
});

test('全角数字は例外を投げる', () => {
  assert.throws(() => parseDimension('幅', '１０００'));
});

test('小数は例外を投げる（解像度は整数 px）', () => {
  assert.throws(() => parseDimension('幅', '12.5'));
});

test('0 以下は例外を投げる', () => {
  assert.throws(() => parseDimension('幅', '0'));
  assert.throws(() => parseDimension('幅', '-5'));
});

test('非有限な値は例外を投げる', () => {
  assert.throws(() => parseDimension('幅', 'Infinity'));
});
