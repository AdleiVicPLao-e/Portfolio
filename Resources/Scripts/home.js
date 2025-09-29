function initHomeSection(container) {
  if (!container) return;

  // --- Resume download ---
  const resumeBtn = container.querySelector("#download-resume");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", async () => {
      try {
        const url = "./Resources/Assets/Resume/Adlei Vic P. Lao-e_resume.pdf";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch file");

        const blob = await response.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Adlei Vic P. Lao-e_Resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Resume download triggered");
      } catch (err) {
        console.error("Download failed:", err);
      }
    });
  } else {
    console.error("Resume button not found inside container");
  }

const coin = document.querySelector(".coin");

coin.addEventListener("click", () => {
  const isTails = Math.random() < 0.5;
  const spins = 6; // number of full rotations
  const endDeg = spins * 360 + (isTails ? 180 : 0);

  coin.style.transition = "transform 2s cubic-bezier(0.3, 0.8, 0.2, 1)";
  coin.style.transform = `rotateY(${endDeg}deg)`;

  // Reset to final rotation after animation
  setTimeout(() => {
    coin.style.transition = "none";
    coin.style.transform = isTails ? "rotateY(180deg)" : "rotateY(0deg)";
  }, 2000);
});



}
