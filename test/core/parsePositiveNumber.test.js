const test = require('node:test');
const assert = require('node:assert');
const { parsePositiveNumber } = require('../../src/core/parsePositiveNumber');

test('正の数の文字列を数値に変換する', () => {
  assert.strictEqual(parsePositiveNumber('対角サイズ', '24'), 24);
});

test('小数の文字列を数値に変換する', () => {
  assert.strictEqual(parsePositiveNumber('対角サイズ', '23.8'), 23.8);
});

test('前後の空白は許容する', () => {
  assert.strictEqual(parsePositiveNumber('対角サイズ', '  24  '), 24);
});

test('空文字・空白のみは例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', ''));
  assert.throws(() => parsePositiveNumber('対角サイズ', '   '));
});

test('数値でない文字列は例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', 'abc'));
});

test('単位付き文字列は例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', '24inch'));
});

test('全角数字は例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', '２４'));
});

test('0 以下は例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', '0'));
  assert.throws(() => parsePositiveNumber('対角サイズ', '-5'));
});

test('非有限な値は例外を投げる', () => {
  assert.throws(() => parsePositiveNumber('対角サイズ', 'Infinity'));
});
