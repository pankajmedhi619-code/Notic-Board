const game = document.getElementById("game");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const popup = document.getElementById("popup");
const result = document.getElementById("result");
const bestDisplay = document.getElementById("best");

const p1Display = document.getElementById("p1");
const p2Display = document.getElementById("p2");
const turnDisplay = document.getElementById("turn");

let emojis = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍","🥥","🥕","🌽","🍔","🍟","🍕","🍩","🍪","🍫","🍿"];
let cards = [...emojis, ...emojis];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let time = 0;
let timer;
let timerStarted = false;

let player = 1;
let score1 = 0;
let score2 = 0;

/* BEST SCORE */
bestDisplay.innerText = localStorage.getItem("bestScore") || "-";

/* THEME */
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}

/* TIMER */
function startTimer() {
    if (timerStarted) return;
    timerStarted = true;

    timer = setInterval(() => {
        time++;
        timeDisplay.innerText = time;
    }, 1000);
}

/* CREATE BOARD */
function createBoard() {
    game.innerHTML = "";
    cards.sort(() => 0.5 - Math.random());

    cards.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = item;

        card.onclick = flipCard;
        game.appendChild(card);
    });
}

/* FLIP */
function flipCard() {
    if (lockBoard || this.classList.contains("matched") || this === firstCard) return;

    startTimer();

    this.innerText = this.dataset.value;
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.innerText = moves;

    if (firstCard.dataset.value === secondCard.dataset.value) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        if (player === 1) score1++, p1Display.innerText = score1;
        else score2++, p2Display.innerText = score2;

        reset();

        checkWin();

    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.innerText = "";
            secondCard.innerText = "";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            player = player === 1 ? 2 : 1;
            turnDisplay.innerText = "Turn: Player " + player;

            reset();
        }, 700);
    }
}

function reset() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/* WIN */
function checkWin() {
    if (document.querySelectorAll(".matched").length === cards.length) {
        clearInterval(timer);

        let winner = score1 > score2 ? "Player 1 Wins!" :
                     score2 > score1 ? "Player 2 Wins!" : "Draw!";

        result.innerText = `${winner}\nTime: ${time}s | Moves: ${moves}`;
        popup.style.display = "block";

        if (!localStorage.getItem("bestScore") || moves < localStorage.getItem("bestScore")) {
            localStorage.setItem("bestScore", moves);
            bestDisplay.innerText = moves;
        }
    }
}

/* RESTART */
function restartGame() {
    clearInterval(timer);
    timerStarted = false;

    time = 0;
    moves = 0;
    score1 = 0;
    score2 = 0;
    player = 1;

    timeDisplay.innerText = 0;
    movesDisplay.innerText = 0;
    p1Display.innerText = 0;
    p2Display.innerText = 0;
    turnDisplay.innerText = "Turn: Player 1";
    popup.style.display = "none";

    createBoard();
}

/* MODE */
function toggleMode() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

/* START */
createBoard();