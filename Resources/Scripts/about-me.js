function initAboutMeSection(container) {
  if (!container) return;

  const modal = container.querySelector("#skillModal");
  const modalBody = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  const skillProjects = {
    Java: `<h2>Java</h2><p>Sample Library Management System coded in Java.</p>`,

    JavaScript: `<iframe src="./Resources/Assets/Projects/tetris/tetris.html" 
        width="600" height="400" 
        style="border:none;" 
        sandbox="allow-scripts allow-same-origin">
</iframe>`,

    HTML: `<h2>HTML</h2><p>Portfolio landing page built with HTML5.</p>`,

    CSS: `<h2>CSS</h2><p>Custom responsive design using Flexbox and Grid.</p>`,

    Python: `<h2>Python</h2><p>Data analysis project using Pandas & Matplotlib.</p>`,

    MySql: `<h2>MySQL</h2><p>Normalized e-commerce database schema design.</p>`,

    R: `<h2>R</h2><p>Statistical visualization with ggplot2.</p>`,

    Spreadsheets: `<h2>Spreadsheets</h2><p>Automated budget tracker with formulas & charts.</p>`
    
  };

  container.querySelectorAll(".skill-item").forEach(skill => {
    skill.addEventListener("click", () => {
      const skillName = skill.querySelector("span").textContent.trim();
      modalBody.innerHTML =
        skillProjects[skillName] ||
        `<p>No project available yet for ${skillName}.</p>`;

      modal.classList.add("active");
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";

      const iframe = modalBody.querySelector("iframe");
      if (iframe) {
        iframe.focus();
        iframe.addEventListener("load", () => {
          try {
            iframe.contentWindow.addEventListener("keydown", (e) => {
              if (e.key === "Escape") {
                closeModal();
              }
            });
          } catch (err) {
            console.warn("Could not attach Esc listener to iframe:", err);
          }
        });
      }
    });
  });

  function closeModal() {
    modal.classList.remove("active");
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    modalBody.innerHTML = "";
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.data && event.data.action === "closeModal") {
      closeModal();
    }
  });
}
