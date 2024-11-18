// Gameboard Module
const Gameboard = (function() {
    // Initialize 3x3 gameboard array
    let gameboard = [];
    for (let row_i=0; row_i < 3; row_i++) {
        row = [];
        for (let col_i=0; col_i < 3; col_i++) {
            row.push(createCell());
        };
        gameboard.push(row);
    };
    const getGameboard = () => gameboard;

    // Cell factory function for Gameboard
    function createCell() {
        let val = 0;
        const getVal = () => val;
        const updateVal = (v) => val = v;
        return { getVal, updateVal };
    };

    // Play one turn, return True if valid move, return False is invalid move
    const playTurn = (turn, row, col) => {
        if (gameboard[row][col].getVal() === 0) {
            gameboard[row][col].updateVal(turn);
            return true;
        } else {
            return false;
        };
    };

    const checkWinner = () => {
        if ((gameboard[0][0].getVal() === gameboard[1][0].getVal() && gameboard[1][0].getVal() == gameboard[2][0].getVal()) && gameboard[2][0].getVal() !== 0 || 
        (gameboard[0][1].getVal() === gameboard[1][1].getVal() && gameboard[1][1].getVal() == gameboard[2][1].getVal()) && gameboard[2][1].getVal() !== 0 || 
        (gameboard[0][2].getVal() === gameboard[1][2].getVal() && gameboard[1][2].getVal() == gameboard[2][2].getVal()) && gameboard[2][2].getVal() !== 0 || 
        (gameboard[0][0].getVal() === gameboard[0][1].getVal() && gameboard[0][1].getVal() == gameboard[0][2].getVal()) && gameboard[0][2].getVal() !== 0 || 
        (gameboard[1][0].getVal() === gameboard[1][1].getVal() && gameboard[1][1].getVal() == gameboard[1][2].getVal()) && gameboard[1][2].getVal() !== 0 || 
        (gameboard[2][0].getVal() === gameboard[2][1].getVal() && gameboard[2][1].getVal() == gameboard[2][2].getVal()) && gameboard[2][2].getVal() !== 0 || 
        (gameboard[0][0].getVal() === gameboard[1][1].getVal() && gameboard[1][1].getVal() == gameboard[2][2].getVal()) && gameboard[2][2].getVal() !== 0 || 
        (gameboard[0][2].getVal() === gameboard[1][1].getVal() && gameboard[1][1].getVal() == gameboard[2][0].getVal()) && gameboard[2][0].getVal() !== 0 ) {
            return true
        } else {
            return false
        }
    }

    // Display gameboard in console
    const displayGameboard = () => {
        let consoleDisplay = ``;
        for (let row_i=0; row_i < 3; row_i++) {
            for (let col_i=0; col_i < 3; col_i++) {
                consoleDisplay += `${gameboard[row_i][col_i].getVal()}`;
            };
            consoleDisplay += `\n`;
        };
        return consoleDisplay;
    };

    return { getGameboard, playTurn, checkWinner, displayGameboard };
})();


// Player Object
function createPlayer(player) {
    let score = 0;
    const getScore = () => score;
    const updateScore = () => score++;
    return { player, getScore, updateScore };
};

Player1 = createPlayer(1);
Player2 = createPlayer(2);


// Game Module
const Game = (function() {

    // Alternate turns function
    const alternateTurn = (turn) => {
        if (turn === 1) {
            return 2;
        } else {
            return 1;
        };
    };

    const playGame = () => {
        let turn = 1;
        let moveCount = 0;
        while (moveCount < 9) {
            Gameboard.playTurn(turn, row, col);
            console.log(Gameboard.displayGameboard());
            if (Gameboard.checkWinner()) {
                console.log(turn)
                return turn
            };
            turn = alternateTurn(turn);
            moveCount++;
        }
    };

    return { playGame }
})();


// DOM Gameboard Render
const RenderGameboard = function() {
    const gameboardContainer = document.querySelector('#game-container');

    // Initialise gameboard
    for (let row_i=0; row_i < 3; row_i++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('rowDiv')
        for (let col_i=0; col_i < 3; col_i++) {
            const columnDiv = document.createElement("div");
            columnDiv.classList.add("columnDiv", `${row_i}-${col_i}`);
            rowDiv.appendChild(columnDiv);
        };
        gameboardContainer.appendChild(rowDiv);
    };
}();