function calcTickPositions({ length, interval }) {
  if (!(interval > 0)) {
    throw new Error(`interval は正の数である必要があります: ${interval}`);
  }
  if (!(length > 0)) {
    throw new Error(`length は正の数である必要があります: ${length}`);
  }

  const positions = [];
  const count = Math.floor(length / interval);
  for (let i = 0; i <= count; i++) {
    positions.push(i * interval);
  }
  return positions;
}

module.exports = { calcTickPositions };
