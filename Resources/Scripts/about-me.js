function initAboutMeSection(container) {
    if (!container) return;

    const modal = container.querySelector("#skillModal");
    const modalBody = modal.querySelector(".modal-body");
    const closeBtn = modal.querySelector(".modal-close");

    const skillProjects = {
        Java: `<iframe src="./Resources/Assets/Projects/java/wordy.html"></iframe>`,

        JavaScript: `<iframe src="./Resources/Assets/Projects/tetris/tetris.html"></iframe>`,

        HTML: `<iframe src="./Resources/Assets/Projects/html/index.html"></iframe>`,

        CSS: `<iframe src="./Resources/Assets/Projects/RecipeFinder/index.html"></iframe>`,

        Python: `<iframe src="./Resources/Assets/Projects/python/python.html"></iframe>`,

        MySql: `<iframe src="./Resources/Assets/Projects/sql/sql.html"></iframe>`,

        R: `<iframe src="./Resources/Assets/Projects/r/r.html"></iframe>`,

        Spreadsheets: `<iframe src="./Resources/Assets/Projects/spreadsheets/ss.html"></iframe>`
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
                function resizeIframe() {
                    iframe.style.width = modalBody.clientWidth + "px";
                    iframe.style.height = modalBody.clientHeight + "px";
                }
                window.addEventListener("resize", resizeIframe);
                resizeIframe();

                iframe.focus();
                iframe.addEventListener("load", () => {
                    try {
                        iframe.contentWindow.addEventListener("keydown", (e) => {
                            if (e.key === "Escape") closeModal();
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
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    window.addEventListener("message", (event) => {
        if (event.data && event.data.action === "closeModal") closeModal();
    });
}