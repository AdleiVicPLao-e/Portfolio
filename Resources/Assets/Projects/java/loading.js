function runLoadingScreen() {
  let progress = 1; // start at 1%
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  document.getElementById("startupScreen").classList.add("hidden");
  document.getElementById("loadingScreen").classList.remove("hidden");

  let interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
      }, 500);

    } else {
      progress++;
      bar.style.width = progress + "%";
      text.textContent = progress + "%";
    }
  }, 50);
}