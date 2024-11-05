// script.js

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const messageDisplay = document.getElementById('message');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));

    // Only allow player 'X' to make a move
    if (currentPlayer !== 'X' || board[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messageDisplay.textContent = `${currentPlayer} wins!`;
        isGameActive = false;
        return;
    }

    if (!board.includes('')) {
        messageDisplay.textContent = "It's a draw!";
        isGameActive = false;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
    if (currentPlayer === 'O' && isGameActive) {
        aiMove()
    }
}

function aiMove() {
    const bestMove = getBestMove(board);
    board[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;
    checkResult();
}

// Minimax with Alpha-Beta Pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === 'O') return 1; // AI wins
    if (winner === 'X') return -1; // Player X wins
    if (board.every(cell => cell !== '')) return 0; // Draw

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // AI's move
                const eval = minimax(board, depth + 1, alpha, beta, false);
                board[i] = ''; // Undo move
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break; // Beta cut-off
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Player's move
                const eval = minimax(board, depth + 1, alpha, beta, true);
                board[i] = ''; // Undo move
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break; // Alpha cut-off
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
        if (board[i] === '') {
            board[i] = 'O'; // AI's move
            const moveValue = minimax(board, 0, -Infinity, Infinity, false);
            board[i] = ''; // Undo move
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Check for a winner
function checkWinner(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null; // No winner
}

resetButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    messageDisplay.textContent = ''; // Clear the message
});

// Add event listeners to cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});