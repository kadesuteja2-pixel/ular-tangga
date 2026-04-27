
/**
 * Maps a grid number (1-100) to [row, col] coordinates.
 * 0,0 is bottom-left.
 */
export const getGridCoords = (num: number) => {
  const adjustedNum = num - 1;
  const row = Math.floor(adjustedNum / 7);
  let col = adjustedNum % 7;
  
  // Zig-zag pattern: odd rows (1, 3, 5...) are right-to-left
  // Starting row 0: 1 2 3 4 5 6 7
  if (row % 2 !== 0) {
    col = 6 - col;
  }
  
  return { row, col };
};
