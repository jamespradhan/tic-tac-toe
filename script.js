// Constants for the game
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const EMPTY = ' ';

let board = Array(9).fill(EMPTY);
let currentPlayer = PLAYER_X;  // Player X starts
let gameOver = false;

// DOM elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const gameBoard = document.getElementById('game-board');
const messageDiv = document.getElementById('message'); // New message div

// Function to display messages
function displayMessage(message) {
    messageDiv.textContent = message; // Set the message text
}

// Add event listener to the cells
cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

// Handle player moves
function handleCellClick(cell) {
    const cellIndex = cell.getAttribute('data-cell');
    
    if (board[cellIndex] !== EMPTY || gameOver) {
        return;  // Skip if the cell is already taken or the game is over
    }

    // Player move
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner(currentPlayer)) {
        gameOver = true;
        displayMessage(`${currentPlayer} wins!`); // Use displayMessage instead of alert
    } else if (board.every(cell => cell !== EMPTY)) {
        gameOver = true;
        displayMessage("It's a draw!"); // Use displayMessage instead of alert
    } else {
        // Switch to the other player
        currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        if (currentPlayer === PLAYER_O && !gameOver) {
            aiMove(); // AI makes its move
        }
    }
}

// AI move using Alpha-Beta Pruning
function aiMove() {
    const bestMove = getBestMove(board);
    board[bestMove] = PLAYER_O;
    cells[bestMove].textContent = PLAYER_O;
    
    if (checkWinner(PLAYER_O)) {
        gameOver = true;
        displayMessage("AI wins!"); // Use displayMessage instead of alert
    } else if (board.every(cell => cell !== EMPTY)) {
        gameOver = true;
        displayMessage("It's a draw!"); // Use displayMessage instead of alert
    } else {
        currentPlayer = PLAYER_X;  // Switch back to player
    }
}

// Check for winner
function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

// Minimax with Alpha-Beta Pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
    const winner = checkWinner(PLAYER_O) ? PLAYER_O : checkWinner(PLAYER_X) ? PLAYER_X : null;
    if (winner) {
        return winner === PLAYER_O ? 1 : -1;
    }

    if (board.every(cell => cell !== EMPTY)) {
        return 0;  // Draw
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                board[i] = PLAYER_O;
                const eval = minimax(board, depth + 1, alpha, beta, false);
                board[i] = EMPTY;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;  // Prune
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                board[i] = PLAYER_X;
                const eval = minimax(board, depth + 1, alpha, beta, true);
                board[i] = EMPTY;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;  // Prune
            }
        }
        return minEval;
    }
}

// Get the best move for the AI
function getBestMove(board) {
    let bestMove = -1;
    let bestValue = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === EMPTY) {
            board[i] = PLAYER_O;
            const moveValue = minimax(board, 0, -Infinity, Infinity, false);
            board[i] = EMPTY;

            if (moveValue > bestValue) {
                bestMove = i;
                bestValue = moveValue;
            }
        }
    }
    return bestMove;
}

// Reset the game
resetButton.addEventListener('click', () => {
    board = Array(9).fill(EMPTY);
    gameOver = false;
    currentPlayer = PLAYER_X;
    cells.forEach(cell => cell.textContent = '');
    displayMessage(''); // Clear the message
});