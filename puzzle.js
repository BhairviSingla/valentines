const board = document.getElementById("puzzle-board");
const size = 4;
let pieces = [];

let timerInterval;
let time = 60; // seconds (change if needed)

/* ---------------- TIMER ---------------- */

function startTimer() {
  const timer = document.getElementById("timer");

  timerInterval = setInterval(() => {
    time--;

    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    timer.textContent = `${min}:${sec}`;

    if (time <= 0) {
      clearInterval(timerInterval);
      alert("💥 Time’s up!");
      location.reload();
    }
  }, 1000);
}

/* ---------------- CREATE PUZZLE ---------------- */

function createPuzzle() {
  pieces = [];
  board.innerHTML = "";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const piece = document.createElement("div");
      piece.className = "piece";

      // image slice
      piece.style.backgroundPosition = `-${x * 120}px -${y * 120}px`;

      // correct position index
      piece.dataset.correct = y * size + x;

      pieces.push(piece);
    }
  }

  // shuffle pieces
  pieces.sort(() => Math.random() - 0.5);

  // add to board
  pieces.forEach(piece => {
    piece.draggable = true;
    board.appendChild(piece);
  });

  enableDrag();
}

/* ---------------- DRAG & DROP ---------------- */

function enableDrag() {
  let dragged = null;

  document.querySelectorAll(".piece").forEach(piece => {

    piece.addEventListener("dragstart", () => {
      dragged = piece;
    });

    piece.addEventListener("dragover", e => e.preventDefault());

    piece.addEventListener("drop", e => {
      e.preventDefault();
      if (!dragged || dragged === piece) return;

      // swap correct indexes
      const tempCorrect = dragged.dataset.correct;
      dragged.dataset.correct = piece.dataset.correct;
      piece.dataset.correct = tempCorrect;

      // swap visuals
      const tempBg = dragged.style.backgroundPosition;
      dragged.style.backgroundPosition = piece.style.backgroundPosition;
      piece.style.backgroundPosition = tempBg;

      checkWin();
    });
  });
}

/* ---------------- CHECK WIN ---------------- */

function checkWin() {
  let solved = true;

  document.querySelectorAll(".piece").forEach((piece, index) => {
    if (parseInt(piece.dataset.correct) !== index) {
      solved = false;
    }
  });

  if (solved) {
    clearInterval(timerInterval);
    document.getElementById("nextBtn").style.display = "block";
  }
}

/* ---------------- NEXT PAGE ---------------- */

function goNext() {
  window.location.href = "code.html";
}

/* ---------------- START GAME ---------------- */

startTimer();
createPuzzle();
