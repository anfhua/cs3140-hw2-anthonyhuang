/**********************************************
 * File: app.js
 * Description: A simple Tic-Tac-Toe game
 * Author: Anthony Huang
 **********************************************/

// Select the status display element from the DOM.
// We'll use this to display messages to the user.
const statusDisplay = document.querySelector(".game--status");

let scoreX = 0;
let scoreO = 0;

const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");

const soundX = document.getElementById("soundX");
const soundO = document.getElementById("soundO");
const winSound = document.getElementById("winSound");

// Set initial game state values
let gameActive = true; // This keeps track of whether the game is active or has ended
let currentPlayer = "X"; // This tracks whose turn it currently is
let gameState = ["", "", "", "", "", "", "", "", ""]; // Represents the 9 cells in the game board

// A function to return the current player's turn message
const currentPlayerTurn = () =>
  currentPlayer === "X"
    ? "🚔 Police (X)'s turn"
    : "🥷 Robber (O)'s turn";

const winningMessage = () =>
  currentPlayer === "X"
    ? "🚔 Police caught the Robber!"
    : "🥷 Robber escaped!";

const drawMessage = () => `Game ended in a draw!`;

// Display the initial status message in the DOM
statusDisplay.innerHTML = currentPlayerTurn();

// Define the possible winning conditions for Tic-Tac-Toe
// Each array within this array represents a set of indices in 'gameState'
// that forms a winning line
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

/**
 * handleCellPlayed
 * ----------------
 * Updates the gameState array and the clicked cell with the current player's symbol.
 * @param {HTMLElement} clickedCell - The cell that was clicked in the UI.
 * @param {number} clickedCellIndex - The index of the clicked cell in the gameState.
 */
function handleCellPlayed(clickedCell, clickedCellIndex) {
  // Update the game state to reflect the move
  gameState[clickedCellIndex] = currentPlayer;

  // Display the current player's symbol in the clicked cell
  clickedCell.innerHTML = currentPlayer;

  // =========================
  // NEW: Animation + Sound
  // =========================
  clickedCell.classList.add("pop");

  if (currentPlayer === "X") {
    soundX.play();
  } else {
    soundO.play();
  }
}

/**
 * handlePlayerChange
 * ------------------
 * Switches the active player from X to O or O to X.
 * Also updates the UI text to notify whose turn it is.
 */
function handlePlayerChange() {
  // Toggle the current player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Update the status text to reflect the new player's turn
  statusDisplay.innerHTML = currentPlayerTurn();
}

/**
 * handleResultValidation
 * ----------------------
 * Checks if the current move caused a win or a draw.
 * If a win, display a win message and end the game.
 * If a draw, display a draw message and end the game.
 * Otherwise, switch players.
 */
function handleResultValidation() {
  let roundWon = false;
  let winningCombo = null;

  // Iterate through each winning condition
  for (let i = 0; i <= 7; i++) {
    const [posA, posB, posC] = winningConditions[i];

    if (
      gameState[posA] === "" ||
      gameState[posB] === "" ||
      gameState[posC] === ""
    ) {
      continue;
    }

    if (
      gameState[posA] === gameState[posB] &&
      gameState[posB] === gameState[posC]
    ) {
      roundWon = true;
      winningCombo = [posA, posB, posC];
      break;
    }
  }

  // If the round is won, display the winner and end the game
  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;

    // =========================
    // NEW: Highlight winning cells
    // =========================
    winningCombo.forEach(index => {
      const cell = document.querySelector(
      `[data-cell-index="${index}"]`
    );

    if (currentPlayer === "X") {
      cell.classList.add("win-police");
    } else {
      cell.classList.add("win-robber");
    }
});

    // =========================
    // NEW: Update Score
    // =========================
    if (currentPlayer === "X") {
      scoreX++;
      scoreXDisplay.innerText = scoreX;
    } else {
      scoreO++;
      scoreODisplay.innerText = scoreO;
    }

    winSound.play();
    return;
  }

  // If there are no empty cells in 'gameState', it's a draw
  if (!gameState.includes("")) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

/**
 * handleCellClick
 * ---------------
 * This function is triggered whenever a cell in the board is clicked.
 */
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

/**
 * handleRestartGame
 * -----------------
 * Resets the game to its initial state.
 */
function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();

  document.querySelectorAll(".cell").forEach(cell => {
  cell.innerHTML = "";
  cell.classList.remove(
    "win-highlight",
    "win-police",
    "win-robber",
    "pop"
  );
  });
}

// Add event listeners
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);