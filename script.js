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
    const playTurn = (player, row, col) => {
        if (gameboard[row][col].getVal() === 0) {
            gameboard[row][col].updateVal(player);
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

    const resetBoard = () => {
        for (let row_i=0; row_i < 3; row_i++) {
            for (let col_i=0; col_i < 3; col_i++) {
                gameboard[row_i][col_i].updateVal(0);
            };
        };
    }

    return { getGameboard, playTurn, checkWinner, resetBoard };
})();


// Player Object
function Player(name) {
    let score = 0;
    const getScore = () => score;
    const incrementScore = () => score++;
    return { name, getScore, incrementScore };
};


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

    // Event Listeners (For Gameplay)
    const playGame = () => {
        // To stop event listener after game is won / tied
        const abortController = new AbortController();
        const resetBtn = document.querySelector('#reset');

        const boardDivs = document.querySelector('#game-container');
        let moveCounter = 0;
        let turn = 1;
        let winnerCrowned = false;
        RenderGameboard.updateTurn(player1.name);
        boardDivs.addEventListener('click', (e) => {
            let currPlayer, nextPlayer;
            turn === 1 ? currPlayer = player1 : currPlayer = player2;
            turn === 1 ? nextPlayer = player2 : nextPlayer = player1;
            let row_col = e.target.id.split('-');
            row = row_col[0];
            col = row_col[1];
    
            if (Gameboard.playTurn(turn, row, col) && moveCounter < 9 && !winnerCrowned) {
                RenderGameboard.updateCellRender(row, col, turn);
                if (Gameboard.checkWinner()) {
                    winnerCrowned = true;
                    RenderGameboard.crownWinner(currPlayer.name);
                    resetBtn.style.display = 'inline';
                    abortController.abort();
                }
                turn = Game.alternateTurn(turn);
                RenderGameboard.updateTurn(nextPlayer.name);
                moveCounter++;
            }
            if (moveCounter === 9 && !winnerCrowned) {
                RenderGameboard.displayTie();
                resetBtn.style.display = 'inline';
                abortController.abort();
            };
        }, {signal: abortController.signal})
    }

    return { alternateTurn, playGame }
})();


// DOM Gameboard Render
const RenderGameboard = function() {
    const gameboardContainer = document.querySelector('#game-container');

    // Initialise gameboard
    const initialiseBoard = () => {
        for (let row_i=0; row_i < 3; row_i++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('rowDiv')
            for (let col_i=0; col_i < 3; col_i++) {
                const columnDiv = document.createElement("div");
                columnDiv.classList.add("columnDiv");
                columnDiv.id = `${row_i}-${col_i}`;
                rowDiv.appendChild(columnDiv);
            };
            gameboardContainer.appendChild(rowDiv);
        };
    }

    const clearBoard = () => {
        for (let row_i=0; row_i < 3; row_i++) {
            for (let col_i=0; col_i < 3; col_i++) {
                currDiv = document.getElementById(`${row_i}-${col_i}`);
                currDiv.textContent = ''
            };
        };
        clearTurn();
        clearWinner();
    }

    const updateCellRender = (row, col, turn) => {
        const selected_cell = document.getElementById(`${row}-${col}`);
        // Edit this line below if you want to add the SVG for X and Os
        turn === 1 ? selected_cell.textContent = 'X' : selected_cell.textContent = 'O';
    };

    const updateTurn = (player) => {
        turnSelector = document.querySelector('#turn-label');
        turnSelector.textContent = `${player}'s Turn`
    }

    const clearTurn = () => {
        turnSelector = document.querySelector('#turn-label');
        turnSelector.textContent = '';
    }

    const crownWinner = (player) => {
        winnerSelector = document.querySelector('#winner-label');
        winnerSelector.textContent = `${player} is the winner!`;
    }

    const displayTie = () => {
        winnerSelector = document.querySelector('#winner-label');
        winnerSelector.textContent = `Tie!`;
    };

    const clearWinner = () => {
        winnerSelector = document.querySelector('#winner-label');
        winnerSelector.textContent = '';
    };

    return { initialiseBoard, clearBoard, updateCellRender, updateTurn, crownWinner, displayTie };
}();



// Event Listeners to Set Names, Start / Reset Game
let player1;
let player2;

const player1Btn = document.querySelector('#player1btn');
player1Btn.addEventListener('click', () => {
    player1 = Player(document.querySelector('#player1name').value);
})
const player2Btn = document.querySelector('#player2btn');
player2Btn.addEventListener('click', () => {
    player2 = Player(document.querySelector('#player2name').value);
    startBtn.style.display = 'block';
    document.querySelector('#player-container').remove();
})

const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', () => {
    RenderGameboard.initialiseBoard();
    Game.playGame();
    startBtn.remove();
});

const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', () => {
    resetBtn.style.display = 'none';
    Gameboard.resetBoard();
    RenderGameboard.clearBoard();
    Game.playGame();
});