const { calcTickPositions } = require('./tickPositions');
const { assertPositive } = require('./assertPositive');

/**
 * 等間隔の目盛りを、主目盛り(major)か副目盛りかの区別付きで返す。
 * majorEvery 本ごと(0本目=原点を含む)を主目盛りとする。
 * 位置の算出と length・interval の検証は calcTickPositions に委ねる。
 *
 * @param {{ length: number, interval: number, majorEvery: number }} params
 *   length・interval は正の px。majorEvery は 1 以上の整数。
 * @returns {{ pos: number, major: boolean }[]} 昇順の目盛り(位置と主/副)
 */
function calcTicks({ length, interval, majorEvery }) {
  assertPositive('majorEvery', majorEvery);
  if (!Number.isInteger(majorEvery)) {
    throw new Error(`majorEvery は整数である必要があります: ${majorEvery}`);
  }

  const positions = calcTickPositions({ length, interval });
  return positions.map((pos, index) => ({
    pos,
    major: index % majorEvery === 0,
  }));
}

module.exports = { calcTicks };
