const boxes = document.querySelectorAll(".box");
const rstbtn = document.querySelector("#resetBtn");
const winmsg = document.querySelector("#winmsg");
const para = document.querySelector("#para");
const newgame = document.querySelector("#newgame");

let turnO = false;
let turnX = true;
let gameOver = false;
let winner = "";
let ind;

// Winning patterns
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

// Choose proper index for our computer move

// Board as array 
function getBoard() {
  const board = [];
  boxes.forEach(box => board.push(box.innerText));
  return board;
}

// Check for winner 
function checkForWin(board, symbol) {
  for (const pattern of winPatterns) {
    if (board[pattern[0]] === symbol &&
        board[pattern[1]] === symbol &&
        board[pattern[2]] === symbol) {
      return true;
    }
  }
  return false;
}

// Function for getting best move
function getBestMove() {
  let board = getBoard();

  // Best winning move for computer
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "X"; 
      if (checkForWin(board, "X")) {
        return i;
      }
      board[i] = "";
    }
  }

  // If user can win in next move then block it 
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkForWin(board, "O")) {
        return i;
      }
      board[i] = "";
    }
  }

  // Center if available
  if (board[4] === "") {
    return 4;
  }

  // Corners if available
  const corners = [0, 2, 6, 8];
  let availableCorners = corners.filter(index => board[index] === ""); // Makes an array for available corners by filter
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Any available 
  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      availableMoves.push(i);
    }
  } // Makes an array of available moves
  if (availableMoves.length > 0) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
}

// Reset game
function resetGame() {
  gameOver = false;
  turnX = true; 
  turnO = false;
  winner = "";
  winmsg.style.display = "none";
  for (const box of boxes) {
    box.innerText = "";
    box.disabled = false;
  }
  xturn();
}

// Reset game using either the "New Game" or "Reset" buttons
newgame.addEventListener("click", resetGame);
rstbtn.addEventListener("click", resetGame);

// Display winner msg
const winnerShow = () => {
  para.innerText = `Winner is ${winner}`;
  winmsg.style.display = "block";
};

// Returns a random available index
function giverandom() {
  let index = Math.floor(Math.random() * boxes.length);
  if (!boxes[index].disabled) {
    return index;
  } else {
    return giverandom();
  }
}

// Computer's turn
function xturn() {
  if (turnX && !gameOver) {
    let index = getBestMove();
    if (index !== null) {
      printX(index);
    }
  }
}

// Print X 
function printX(index) {
  if (boxes[index].innerText === "") {
    boxes[index].disabled = true;
    setTimeout(() => {
      boxes[index].innerText = "X";

      if (boxes[index].innerText === "X") {
        boxes[index].style.color = "#00B4D8";  // Color for X
      }

      checkWinner(); 
      turnX = false;
      turnO = true;
    }, 1000);
  }
}

// If turn O and box is clicked 
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO && !gameOver && box.innerText === "") {
      box.innerText = "O";
      if (box.innerText === "O") {
        box.style.color = "#0077B6";  // Color for O
      }
      box.disabled = true;
      turnO = false;
      turnX = true;
      checkWinner();
      if (!gameOver) {
        xturn();
      }
    }
  });
});

// Check for a Winner
const checkWinner = () => {
  for (const pattern of winPatterns) {
    const pos1 = boxes[pattern[0]].innerText;
    const pos2 = boxes[pattern[1]].innerText;
    const pos3 = boxes[pattern[2]].innerText;

    // Only check if all three positions are filled
    if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
      winner = pos1;
      gameOver = true;
      disableBox();
      winnerShow();
      return; // Stop when winner found
    }
  }

    //draw
  const isDraw = [...boxes].every(box => box.innerText !== "");
  if (isDraw) {
    gameOver = true;
    para.innerText = "It's a draw!";
    winmsg.style.display = "block";
  }
}

// Disable all boxes to stop further moves
const disableBox = () => {
  for (const box of boxes) {
    box.disabled = true;
  }
};

// Enable all boxes
const enableBox = () => {
  for (const box of boxes) {
    box.disabled = false;
  }
};

// Start game
xturn();