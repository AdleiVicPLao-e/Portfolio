const consoleImg = document.getElementById("consoleImg");
const cartridgeImg = document.getElementById("cartridgeImg");

let cartridgeInserted = false;

cartridgeImg.addEventListener("mouseenter", () => {
  if (!cartridgeInserted) cartridgeImg.src = "assets/Cartridge2.png";
});

cartridgeImg.addEventListener("mouseleave", () => {
  if (!cartridgeInserted) cartridgeImg.src = "assets/Cartridge1.png";
});

cartridgeImg.addEventListener("click", () => {
  if (!cartridgeInserted) {
    cartridgeImg.classList.add("inserted");
    consoleImg.src = "assets/Console2.png";
    cartridgeInserted = true;

    setTimeout(() => {
      showScreen("loadingScreen");
      runLoadingScreen();
    }, 2300);

  } else {
    cartridgeImg.classList.remove("inserted");
    consoleImg.src = "assets/Console1.png";
    cartridgeImg.src = "assets/Cartridge1.png";
    cartridgeInserted = false;

    showScreen("startupScreen");
  }
});

