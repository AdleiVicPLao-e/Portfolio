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
    slashPlayer:
      "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash.gif",
    slashEnemy1:
      "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash1.gif",
    slashEnemy2:
      "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/slash2.gif",
    round1BG:
      "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/2wins.gif",
    round2BG:
      "https://media.githubusercontent.com/media/AdleiVicPLao-e/Portfolio/refs/heads/main/Resources/Assets/Projects/java/assets/5rounds.gif",
  },
  images: {
    congratsRound: "./assets/congrats-round.png",
    congratsWinner: "./assets/congrats-winner.png",
  },
};

let currentWord = "";
let selectedLetters = [];
let validWords = new Set();
let usedWords = new Set(); // Track used words

let round = 1;
let maxRounds = 2;
let timeLeft = 60;
let timerInterval;

let playerHP = 5;
let enemyHP = 0;
let enemyMaxHP = 0;

let gameActive = true; // Track if game is still active

fetch("./assets/words.txt")
  .then((res) => res.text())
  .then((text) => {
    const wordList = text.split(/\r?\n/).map((w) => w.trim().toLowerCase());
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
  if (!gameActive) return;

  clearInterval(timerInterval);
  selectedLetters = [];
  currentWord = "";
  submitBtn.disabled = true;
  usedWords.clear();

  letterPoolDiv.innerHTML = "";
  selectedWordDiv.innerHTML = "";

  playerHP = 5;
  enemyMaxHP = round === 1 ? 50 : 80;
  enemyHP = enemyMaxHP;
  renderPlayerHP();
  renderEnemyHP();
  roundCounterEl.textContent = `Round: ${round}`;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  // Force background change with aggressive cache busting
  const bgUrl = round === 1 ? assets.gifs.round1BG : assets.gifs.round2BG;
  const timestamp = new Date().getTime();
  const cacheBustedUrl = `${bgUrl}?t=${timestamp}&round=${round}`;

  console.log(`Changing to round ${round} background:`, cacheBustedUrl);

  // Completely reset and force reload
  roundBackground.style.display = "none";
  roundBackground.src = "";

  // Force DOM update
  setTimeout(() => {
    roundBackground.src = cacheBustedUrl;
    roundBackground.style.display = "block";

    // Force browser to recognize the change
    void roundBackground.offsetWidth;

    roundBackground.onload = function () {
      console.log(`✅ Round ${round} background loaded and displayed`);
      // Force repaint
      roundBackground.style.opacity = "0.99";
      setTimeout(() => {
        roundBackground.style.opacity = "1";
      }, 50);
    };

    roundBackground.onerror = function () {
      console.error(`❌ Round ${round} background failed to load`);
      // Fallback to CSS background colors
      document.body.style.backgroundColor = round === 1 ? "#2c3e50" : "#8b0000";
      document.body.style.backgroundImage = "none";
    };
  }, 100);

  generateLetters();
  startTimer();
}

function startTimer() {
  if (!gameActive) return; // Don't start timer if game is over

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(timerInterval);
      return;
    }

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
  congratsImage.src =
    type === "round"
      ? assets.images.congratsRound
      : assets.images.congratsWinner;
  congratsOverlay.classList.remove("hidden");

  if (type === "round") {
    setTimeout(() => {
      congratsOverlay.classList.add("hidden");
    }, 2000);
  }
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);

  // Disable all game interactions
  submitBtn.disabled = true;
  letterPoolDiv.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });

  // Show exit button or automatically close after delay
  setTimeout(() => {
    // If this is running in an iframe/modal, send close message
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: "closeModal" }, "*");
    } else {
      // If running standalone, show exit option
      const exitBtn = document.createElement("button");
      exitBtn.textContent = "Exit Game";
      exitBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        font-size: 16px;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
      `;
      exitBtn.onclick = () => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: "closeModal" }, "*");
        } else {
          window.close(); // Only works if window was opened by script
          document.body.innerHTML = "<h1>Game Over - Thanks for playing!</h1>";
        }
      };
      document.body.appendChild(exitBtn);
    }
  }, 3000);
}

function damageEnemy(amount) {
  if (!gameActive) return;

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
      setTimeout(() => {
        endGame();
      }, 3000);
    }
  }
}

function damagePlayer(amount) {
  if (!gameActive) return;

  playerHP -= amount;
  if (playerHP < 0) playerHP = 0;
  renderPlayerHP();
  playSlash(round === 1 ? "enemy1" : "enemy2");

  if (playerHP <= 0) {
    alert("Game Over! You lost all hearts.");
    endGame();
  }
}

function generateLetters() {
  if (!gameActive) return;

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
  for (let i = 0; i < vowelCount; i++)
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  for (let i = 0; i < consonantCount; i++)
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);

  letters
    .sort(() => Math.random() - 0.5)
    .forEach((letter, index) => {
      const btn = document.createElement("button");
      btn.classList.add("letter-btn");
      btn.textContent = letter;
      btn.dataset.index = index;

      btn.addEventListener("click", () => {
        if (!btn.disabled && gameActive) {
          btn.disabled = true;
          selectedLetters.push({ letter, index });
          updateSelectedWord();
        }
      });

      letterPoolDiv.appendChild(btn);
    });
}

function updateSelectedWord() {
  if (!gameActive) return;

  selectedWordDiv.innerHTML = "";
  currentWord = "";

  selectedLetters.forEach(({ letter, index }) => {
    const btn = document.createElement("button");
    btn.classList.add("letter-btn", "selected");
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      if (gameActive) {
        selectedLetters = selectedLetters.filter((l) => l.index !== index);
        const poolBtn = letterPoolDiv.querySelector(
          `button[data-index='${index}']`
        );
        if (poolBtn) poolBtn.disabled = false;
        updateSelectedWord();
      }
    });

    selectedWordDiv.appendChild(btn);
  });

  currentWord = selectedLetters.map((l) => l.letter).join("");
  validateWord(currentWord);
}

function validateWord(word) {
  if (!gameActive) return;

  const sanitized = word.toLowerCase();
  const isValidLength = sanitized.length >= 3;
  const isValidWord = validWords.has(sanitized);
  const isNotUsed = !usedWords.has(sanitized);

  console.log("Current Word:", `"${currentWord}"`);
  console.log("Sanitized Word:", `"${sanitized}"`);
  console.log("Word in Dictionary:", isValidWord);
  console.log("Word not used before:", isNotUsed);

  submitBtn.disabled = !(isValidLength && isValidWord && isNotUsed);

  // Update button text to show why it's disabled
  if (sanitized.length > 0) {
    if (!isValidLength) {
      submitBtn.title = "Word must be at least 3 letters long";
    } else if (!isValidWord) {
      submitBtn.title = "Word not found in dictionary";
    } else if (!isNotUsed) {
      submitBtn.title = "Word already used in this round";
    } else {
      submitBtn.title = "Submit word";
    }
  }
}

submitBtn.addEventListener("click", () => {
  if (!gameActive) return;

  const sanitizedWord = currentWord.toLowerCase();

  // Add word to used words set
  usedWords.add(sanitizedWord);
  console.log("Word submitted, added to used words:", sanitizedWord);
  console.log("Used words:", Array.from(usedWords));

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
  submitBtn.title = "Select letters to form a word";

  letterPoolDiv
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));
});

// Add reset functionality
resetBtn.addEventListener("click", () => {
  gameActive = true;
  round = 1;
  timeLeft = 60;
  usedWords.clear();
  startRound();
});
