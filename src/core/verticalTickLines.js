const { calcTickPositions } = require('./tickPositions');
const { assertPositive } = require('./assertPositive');

/**
 * 縦目盛りを描くための線分を返す。
 * 各目盛り位置 x に対し、高さいっぱい(y=0 → height)の縦線を表す。
 * x 位置の算出と width・interval の検証は calcTickPositions に委ねる。
 *
 * @param {{ width: number, height: number, interval: number }} params すべて正の px
 * @returns {{ x: number, y1: number, y2: number }[]} 左から順の縦線
 */
function calcVerticalTickLines({ width, height, interval }) {
  assertPositive('height', height);

  const xs = calcTickPositions({ length: width, interval });
  return xs.map((x) => ({ x, y1: 0, y2: height }));
}

module.exports = { calcVerticalTickLines };
