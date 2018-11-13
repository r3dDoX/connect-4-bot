module.exports = function (board, playerColor) {
  const secondCol = board[board.length - 1][1];
  const secondLastCol = board[board.length - 1][5];

  if (secondCol === 'EMPTY') {
    return 1;
  } else if (secondLastCol === 'EMPTY') {
    return 5;
  }
}