const { assertPositive } = require('./assertPositive');

/**
 * 0 を起点に等間隔の目盛り位置(px)を返す。
 * length ちょうどに当たる位置は含み、length を超える位置は含まない。
 *
 * @param {{ length: number, interval: number }} params length・interval はいずれも正の px
 * @returns {number[]} 昇順の目盛り位置(px)
 */
function calcTickPositions({ length, interval }) {
  assertPositive('interval', interval);
  assertPositive('length', length);

  const positions = [];
  const tickCount = Math.floor(length / interval);
  for (let i = 0; i <= tickCount; i++) {
    positions.push(i * interval);
  }
  return positions;
}

module.exports = { calcTickPositions };
