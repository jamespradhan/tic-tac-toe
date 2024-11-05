const PLAYER = "O";
const AI = "X";

function updateBoard(board) {
    const cells = document.querySelectorAll("td");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cells[i * 3 + j].innerText = board[i][j];
        }
    }
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
        if (data.winner) {
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
    document.querySelectorAll("td").forEach(cell => cell.innerText = "");
    document.getElementById("message").innerText = "";
}
