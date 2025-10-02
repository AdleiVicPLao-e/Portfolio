const letterPoolDiv = document.getElementById("letterPool");
const selectedWordDiv = document.getElementById("selectedWord");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const roundCounterEl = document.getElementById("roundCounter");
const timerEl = document.getElementById("timer");
const roundBackground = document.getElementById("roundBackground");

const playerHPDiv = document.getElementById("playerHP");
const enemyHPDiv = document.getElementById("enemyHP");
const slashEffect = document.getElementById("slashEffect");

let currentWord = "";
let selectedLetters = [];
let validWords = new Set();

let round = 1;
let maxRounds = 2;
let timeLeft = 30;
let timerInterval;

let playerHP = 5;
let enemyHP = 0;
let enemyMaxHP = 0;

// Load dictionary
fetch("./assets/words.txt")
  .then(response => response.text())
  .then(text => {
    const wordList = text.split(/\r?\n/).map(w => w.trim().toUpperCase());
    validWords = new Set(wordList);
  });

// ==== Initialize UI ====
function renderPlayerHP() {
  playerHPDiv.innerHTML = "";
  for (let i = 0; i < playerHP; i++) {
    const heart = document.createElement("span");
    heart.textContent = "❤️";
    heart.style.fontSize = "24px";
    playerHPDiv.appendChild(heart);
  }
}

function renderEnemyHP() {
  enemyHPDiv.innerHTML = ""; // enemyHPDiv = document.getElementById("enemyHP")
  const fill = document.createElement("div");
  fill.classList.add("enemy-health-fill");
  fill.style.width = `${(enemyHP / enemyMaxHP) * 100}%`;
  enemyHPDiv.appendChild(fill);
}


// ==== Slash Animation ====
function playSlash(type) {
  if (type === "player") {
    slashEffect.src = "./assets/slash.gif";
  } else if (type === "enemy1") {
    slashEffect.src = "./assets/slash1.gif";
  } else if (type === "enemy2") {
    slashEffect.src = "./assets/slash2.gif";
  }

  slashEffect.classList.remove("hidden");
  setTimeout(() => {
    slashEffect.classList.add("hidden");
  }, 600);
}

// ==== Round Start ====
function startRound() {
  clearInterval(timerInterval);

  letterPoolDiv.innerHTML = "";
  selectedWordDiv.innerHTML = "";
  currentWord = "";
  selectedLetters = [];
  submitBtn.disabled = true;

  roundCounterEl.textContent = `Round: ${round}`;
  timeLeft = 30;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  // Reset HP
  playerHP = 5;
  enemyMaxHP = (round === 1) ? 50 : 80;
  enemyHP = enemyMaxHP;

  renderPlayerHP();
  renderEnemyHP();

  // Update background per round
  roundBackground.src = (round === 1) ? "./assets/2wins.gif" : "./assets/5rounds.gif";

  generateLetters();

  // Start countdown
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      damagePlayer(1);
      timeLeft = 30;
      timerEl.textContent = `Time Left: ${timeLeft}s`;
      generateLetters();
      startTimer();
    }
  }, 1000);
}

// ==== Damage Functions ====
function damageEnemy(amount) {
  enemyHP -= amount;
  if (enemyHP < 0) enemyHP = 0;
  renderEnemyHP();
  playSlash("player");

  if (enemyHP <= 0) {
    if (round < maxRounds) {
      alert(`Enemy defeated! Proceeding to Round ${round + 1}`);
      round++;
      startRound();
    } else {
      alert("You Win the Game!");
    }
  }
}

function damagePlayer(amount) {
  playerHP -= amount;
  if (playerHP < 0) playerHP = 0;
  renderPlayerHP();

  playSlash(round === 1 ? "enemy1" : "enemy2");

  if (playerHP <= 0) {
    alert("Game Over! You lost all hearts.");
  }
}

// ==== Letters ====
function generateLetters() {
  const vowels = "AEIOU";
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
  
  letterPoolDiv.innerHTML = "";

  const vowelCount = Math.floor(Math.random() * 3) + 5; 
  const consonantCount = 17 - vowelCount;

  let letters = [];
  for (let i = 0; i < vowelCount; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }
  for (let i = 0; i < consonantCount; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }

  letters = letters.sort(() => Math.random() - 0.5);
  letters.forEach(letter => createLetterButton(letter, letterPoolDiv, true));
}

function createLetterButton(letter, parent, fromPool) {
  const btn = document.createElement("button");
  btn.classList.add("letter-btn");
  if (!fromPool) btn.classList.add("selected");
  btn.textContent = letter;

  if (fromPool) {
    btn.addEventListener("click", () => {
      btn.remove();
      selectedLetters.push(letter);
      createLetterButton(letter, selectedWordDiv, false);
      updateWord();
    });
  } else {
    btn.addEventListener("click", () => {
      btn.remove();
      selectedLetters.splice(selectedLetters.indexOf(letter), 1);
      createLetterButton(letter, letterPoolDiv, true);
      updateWord();
    });
  }

  parent.appendChild(btn);
}


// ==== Word Validation ====
function updateWord() {
  currentWord = selectedLetters.join("");
  console.log("Current Word:", currentWord);
  validateWord(currentWord);
}

function validateWord(word) {
  if (word.length >= 3 && validWords.has(word.toLowerCase())) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// ==== Buttons ====
submitBtn.addEventListener("click", () => {
  const damage = currentWord.length;
  damageEnemy(damage);
  selectedLetters = [];
  selectedWordDiv.innerHTML = "";
  submitBtn.disabled = true;
  generateLetters();
});

resetBtn.addEventListener("click", () => startRound());

// Start first round
startRound();
