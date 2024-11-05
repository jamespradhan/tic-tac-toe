from flask import Flask, jsonify, request, render_template
import math

app = Flask(__name__)

PLAYER = "O"  # Human
AI = "X"  # AI

# Initialize empty board
def create_board():
    return [["" for _ in range(3)] for _ in range(3)]

# Check for winner
def check_winner(board):
    for row in board:
        if row[0] == row[1] == row[2] != "":
            return row[0]
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != "":
            return board[0][col]
    if board[0][0] == board[1][1] == board[2][2] != "":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != "":
        return board[0][2]
    return None

# Check if the board is full
def is_full(board):
    for row in board:
        if "" in row:
            return False
    return True

# Alpha-beta pruning algorithm
def minimax(board, depth, is_maximizing, alpha, beta):
    winner = check_winner(board)
    if winner == AI:
        return 1
    elif winner == PLAYER:
        return -1
    elif is_full(board):
        return 0

    if is_maximizing:
        best_score = -math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == "":
                    board[i][j] = AI
                    score = minimax(board, depth + 1, False, alpha, beta)
                    board[i][j] = ""
                    best_score = max(score, best_score)
                    alpha = max(alpha, score)
                    if beta <= alpha:
                        break
        return best_score
    else:
        best_score = math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == "":
                    board[i][j] = PLAYER
                    score = minimax(board, depth + 1, True, alpha, beta)
                    board[i][j] = ""
                    best_score = min(score, best_score)
                    beta = min(beta, score)
                    if beta <= alpha:
                        break
        return best_score

# Find the best move
def best_move(board):
    best_score = -math.inf
    move = None
    for i in range(3):
        for j in range(3):
            if board[i][j] == "":
                board[i][j] = AI
                score = minimax(board, 0, False, -math.inf, math.inf)
                board[i][j] = ""
                if score > best_score:
                    best_score = score
                    move = (i, j)
    return move

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=["POST"])
def move():
    data = request.get_json()
    board = data["board"]
    ai_move = best_move(board)
    if ai_move:
        board[ai_move[0]][ai_move[1]] = AI
    return jsonify({"board": board, "winner": check_winner(board)})

if __name__ == "__main__":
    app.run(debug=True)
