class SudokuGenerator {
    constructor() {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    isValid(row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] == num || 
                this.board[i][col] == num ||
                this.board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] == num) {
                return false;
            }
        }
        return true;
    }

    fillBoard(row = 0, col = 0) {
        if (row == 9) return true;
        if (col == 9) return this.fillBoard(row + 1, 0);

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        nums = nums.sort(() => Math.random() - 0.5);

        for (let num of nums) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;
                if (this.fillBoard(row, col + 1)) {
                    return true; 
                }
                this.board[row][col] = 0; 
            }
        }
        return false;
    }

    getBoardID() {
        return this.board.flat().join('');
    }

    printBoardWithCount(count) {
        console.log("\nBoard #" + count);
        console.log("ID: " + this.getBoardID());
        for (let i = 0; i < 9; i++) {
            console.log(this.board[i].join(' '));
        }
        console.log("\n---------------------\n");
    }
}

let uniqueBoards = new Set();
let boardsArray = [];
let count = 0;

function generateUniqueBoard(delay = 2000) {
    let generator = new SudokuGenerator();
    generator.fillBoard();
    const boardID = generator.getBoardID();

    if (!uniqueBoards.has(boardID)) {
        uniqueBoards.add(boardID);
        boardsArray.push(generator.board);
        count++;
        generator.printBoardWithCount(count);
    }

    setTimeout(() => {
        generateUniqueBoard(delay);
    }, delay);
}

generateUniqueBoard();
