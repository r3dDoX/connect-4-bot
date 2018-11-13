module.exports = function (board, playerColor) {

    let result = board[0].map((row, columnIndex) => board
        .map(rows => rows[columnIndex]))
        .map((cells, index) => ({index, cells}))
        .filter(({cells}) => cells[0] === "EMPTY")
        .find(indexCellObject => {
            let chips = indexCellObject.cells.filter(cell => cell !== "EMPTY");
            if (chips.length === 0) {
                return false;
            }
            let color = chips[0];
            let other = false;
            return chips.filter(chip => {
                    if (chip === color && other === false) {
                        return true;
                    }
                    other = true;
                    return false
                }
            ).length === 4;
        });

    if (result) {
        return result.index
    }
}