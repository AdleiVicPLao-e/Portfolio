const letterPoolDiv = document.getElementById("letterPool");
const selectedWordDiv = document.getElementById("selectedWord");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const roundCounterEl = document.getElementById("roundCounter");
const timerEl = document.getElementById("timer");
const roundBackground = document.getElementById("roundBackground");
const congratsOverlay = document.getElementById("congratsOverlay");
const congratsImage = document.getElementById("congratsImage");

const playerHPDiv = document.getElementById("playerHP");
const enemyHPDiv = document.getElementById("enemyHP");
const slashEffect = document.getElementById("slashEffect");

// --- Image URLs ---
const assets = {
  gifs: {
    slashPlayer: "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash.gif",
    slashEnemy1: "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash1.gif",
    slashEnemy2: "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash2.gif",
    round1BG: "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/2wins.gif",
    round2BG: "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/5rounds.gif"
  },
  images: {
    congratsRound: "./assets/congrats-round.png",
    congratsWinner: "./assets/congrats-winner.png"
  }
};


let currentWord = "";
let selectedLetters = [];
let validWords = new Set();

let round = 1;
let maxRounds = 2;
let timeLeft = 60;
let timerInterval;

let playerHP = 5;
let enemyHP = 0;
let enemyMaxHP = 0;

fetch("./assets/words.txt")
  .then(res => res.text())
  .then(text => {
    const wordList = text.split(/\r?\n/).map(w => w.trim().toLowerCase());
    validWords = new Set(wordList);
    console.log("Dictionary loaded with", validWords.size, "words");
    startRound();
  });

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
  enemyHPDiv.innerHTML = "";
  const fill = document.createElement("div");
  fill.classList.add("enemy-health-fill");
  fill.style.width = `${(enemyHP / enemyMaxHP) * 100}%`;
  enemyHPDiv.appendChild(fill);
}

function playSlash(type) {
  if (type === "player") slashEffect.src = assets.gifs.slashPlayer;
  else if (type === "enemy1") slashEffect.src = assets.gifs.slashEnemy1;
  else if (type === "enemy2") slashEffect.src = assets.gifs.slashEnemy2;

  slashEffect.classList.remove("hidden");
  setTimeout(() => slashEffect.classList.add("hidden"), 600);
}

function startRound() {
  clearInterval(timerInterval);
  selectedLetters = [];
  currentWord = "";
  submitBtn.disabled = true;

  letterPoolDiv.innerHTML = "";
  selectedWordDiv.innerHTML = "";

  playerHP = 5;
  enemyMaxHP = round === 1 ? 50 : 80;
  enemyHP = enemyMaxHP;
  renderPlayerHP();
  renderEnemyHP();
  roundCounterEl.textContent = `Round: ${round}`;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  // Use stored background GIFs
  roundBackground.src = round === 1 ? assets.gifs.round1BG : assets.gifs.round2BG;

  generateLetters();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      damagePlayer(1);
      timeLeft = 60;
      timerEl.textContent = `Time Left: ${timeLeft}s`;
      generateLetters();
      startTimer();
    }
  }, 1000);
}

function showCongrats(type) {
  congratsImage.src = type === "round" ? assets.images.congratsRound : assets.images.congratsWinner;
  congratsOverlay.classList.remove("hidden");

  if (type === "round") {
    setTimeout(() => {
      congratsOverlay.classList.add("hidden");
    }, 2000);
  }
}

function damageEnemy(amount) {
  enemyHP -= amount;
  if (enemyHP < 0) enemyHP = 0;
  renderEnemyHP();
  playSlash("player");

  if (enemyHP <= 0) {
    if (round < maxRounds) {
      showCongrats("round");
      round++;
      setTimeout(() => startRound(), 2000);
    } else {
      showCongrats("winner");
    }
  }
}


function damagePlayer(amount) {
  playerHP -= amount;
  if (playerHP < 0) playerHP = 0;
  renderPlayerHP();
  playSlash(round === 1 ? "enemy1" : "enemy2");

  if (playerHP <= 0) alert("Game Over! You lost all hearts.");
}

function generateLetters() {
  const vowels = "AEIOU";
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";

  letterPoolDiv.innerHTML = "";
  selectedLetters = [];
  currentWord = "";
  submitBtn.disabled = true;
  selectedWordDiv.innerHTML = "";

  const vowelCount = Math.floor(Math.random() * 3) + 5;
  const consonantCount = 17 - vowelCount;

  const letters = [];
  for (let i = 0; i < vowelCount; i++) letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  for (let i = 0; i < consonantCount; i++) letters.push(consonants[Math.floor(Math.random() * consonants.length)]);

  letters.sort(() => Math.random() - 0.5).forEach((letter, index) => {
    const btn = document.createElement("button");
    btn.classList.add("letter-btn");
    btn.textContent = letter;
    btn.dataset.index = index;

    btn.addEventListener("click", () => {
      if (!btn.disabled) {
        btn.disabled = true;
        selectedLetters.push({ letter, index });
        updateSelectedWord();
      }
    });

    letterPoolDiv.appendChild(btn);
  });
}

function updateSelectedWord() {
  selectedWordDiv.innerHTML = "";
  currentWord = "";

  selectedLetters.forEach(({ letter, index }) => {
    const btn = document.createElement("button");
    btn.classList.add("letter-btn", "selected");
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      selectedLetters = selectedLetters.filter(l => l.index !== index);
      const poolBtn = letterPoolDiv.querySelector(`button[data-index='${index}']`);
      if (poolBtn) poolBtn.disabled = false;
      updateSelectedWord();
    });

    selectedWordDiv.appendChild(btn);
  });

  currentWord = selectedLetters.map(l => l.letter).join("");
  validateWord(currentWord);
}

function validateWord(word) {
  const sanitized = word.toLowerCase();
  console.log("Current Word:", `"${currentWord}"`);
  console.log("Sanitized Word:", `"${sanitized}"`);
  console.log("Word in Dictionary:", validWords.has(sanitized));
  submitBtn.disabled = !(sanitized.length >= 3 && validWords.has(sanitized));
}

submitBtn.addEventListener("click", () => {
  damageEnemy(currentWord.length);

  if (currentWord.length >= 5) {
    if (currentWord.length <= 6) timeLeft += 5;
    else if (currentWord.length <= 8) timeLeft += 10;
    else timeLeft += 15;

    if (timeLeft > 60) timeLeft = 60;

    timerEl.textContent = `Time Left: ${timeLeft}s`;
  }

  selectedLetters = [];
  selectedWordDiv.innerHTML = "";
  submitBtn.disabled = true;

  letterPoolDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
});
