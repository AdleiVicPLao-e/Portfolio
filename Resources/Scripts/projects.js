function initProjectsSection(container) {
    if (!container) return;

    const projectItems = container.querySelectorAll(".project-item");
    const modals = container.querySelectorAll(".modal");

    projectItems.forEach(item => {
        item.addEventListener("click", () => {
            const projectId = item.dataset.project;
            const modal = container.querySelector(`#modal-${projectId}`);
            if (modal) modal.classList.add("active");
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });
}