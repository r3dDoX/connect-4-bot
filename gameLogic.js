const rules = require('./rules');

const minColumn = 0;
const maxColumn = 6;


module.exports = {
  getColumn(board, playerColor) {
    return rules
      .map(rule => rule(board, playerColor))
      .find(result => result !== undefined);
  }
}