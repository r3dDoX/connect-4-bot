module.exports = function (board, playerColor) {
  return board[0].findIndex(col => col === 'EMPTY');
}