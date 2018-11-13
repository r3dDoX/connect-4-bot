const rules = require('./rules');

module.exports = {
  getColumn(board, playerColor) {
    return rules
      .map(rule => rule(board, playerColor))
      .find(result => result !== undefined);
  }
}