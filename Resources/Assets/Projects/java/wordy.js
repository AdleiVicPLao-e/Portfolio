function scaleGameContainer() {
  const container = document.querySelector(".game-container");
  const w = window.innerWidth;
  const h = window.innerHeight;
  const containerWidth = container.scrollWidth;
  const containerHeight = container.scrollHeight;
  const scale = Math.min(w / containerWidth, h / containerHeight, 1);
  container.style.transform = `scale(${scale})`;
}

window.addEventListener("DOMContentLoaded", scaleGameContainer);
window.addEventListener("resize", scaleGameContainer);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

