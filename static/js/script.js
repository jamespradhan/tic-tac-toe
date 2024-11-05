const PLAYER = "O";
const AI = "X";

function updateBoard(board) {
    const cells = document.querySelectorAll("td");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = cells[i * 3 + j];
            cell.classList.remove("winning-cell"); // Remove any previous winning cell styling
            if (cell.innerText !== board[i][j]) {
                cell.innerText = board[i][j];
                cell.classList.add("fade-in");
                setTimeout(() => cell.classList.remove("fade-in"), 200); // Remove the animation class after
            }
        }
    }
}

function findWinningCells(board) {
    const lines = [
        // Rows
        [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}],
        [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}],
        [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}],
        // Columns
        [{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}],
        [{row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}],
        [{row: 0, col: 2}, {row: 1, col: 2}, {row: 2, col: 2}],
        // Diagonals
        [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}],
        [{row: 0, col: 2}, {row: 1, col: 1}, {row: 2, col: 0}]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a.row][a.col] && 
            board[a.row][a.col] === board[b.row][b.col] &&
            board[a.row][a.col] === board[c.row][c.col]) {
            return line;
        }
    }
    return null;
}

function checkWinner(board) {
    fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: board })
    })
    .then(response => response.json())
    .then(data => {
        updateBoard(data.board);
        const winningCells = findWinningCells(data.board);
        if (winningCells) {
            // Apply different colors based on the winner
            const winningClass = data.winner === AI ? "winning-cell-ai" : "winning-cell-player";
            winningCells.forEach(pos => {
                document.querySelector(`tr:nth-child(${pos.row + 1}) td:nth-child(${pos.col + 1})`).classList.add(winningClass);
            });
            document.getElementById("message").innerText = `${data.winner} wins!`;
        } else if (data.board.flat().every(cell => cell !== "")) {
            document.getElementById("message").innerText = "It's a draw!";
        }
    });
}


function cellClicked(cell) {
    const row = cell.parentNode.rowIndex;
    const col = cell.cellIndex;
    if (cell.innerText === "" && !document.getElementById("message").innerText.includes("wins")) {
        cell.innerText = PLAYER;
        const board = Array.from(document.querySelectorAll("tr")).map(row =>
            Array.from(row.cells).map(cell => cell.innerText)
        );
        checkWinner(board);
    }
}

document.querySelectorAll("td").forEach(cell => {
    cell.addEventListener("click", () => cellClicked(cell));
});

function resetGame() {
    document.querySelectorAll("td").forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("winning-cell-ai", "winning-cell-player"); // Remove winning cell styles
    });
    document.getElementById("message").innerText = "";
}
