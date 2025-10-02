const sections = {
    home: {
        html: "home.html",
        css: "./Resources/Styles/home.css",
        js: "./Resources/Scripts/home.js"
    },
    aboutMe: {
        html: "about-me.html",
        css: "./Resources/Styles/about-me.css",
        js: "./Resources/Scripts/about-me.js"
    },
    gallery: {
        html: "gallery.html",
        css: "./Resources/Styles/gallery.css",
        js: "./Resources/Scripts/gallery.js"
    },
    projects: {
        html: "projects.html",
        css: "./Resources/Styles/projects.css",
        js: "./Resources/Scripts/projects.js"
    },
    contacts: {
        html: "contacts.html",
        css: "./Resources/Styles/contacts.css",
        js: "./Resources/Scripts/contacts.js"
    }
};

function loadCSS(file) {
    if (!document.querySelector(`link[href="${file}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = file;
        document.head.appendChild(link);
    }
}

function loadJS(file, callback) {
    if (!document.querySelector(`script[src="${file}"]`)) {
        const script = document.createElement("script");
        script.src = file;
        script.onload = () => {
            console.log(`${file} loaded`);
            if (typeof callback === "function") callback();
        };
        document.body.appendChild(script);
    } else if (typeof callback === "function") {
        callback();
    }
}

function loadSection(id) {
    const {
        html,
        css,
        js
    } = sections[id];

    fetch(html)
        .then(res => res.text())
        .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const template = doc.querySelector("template");
            if (!template) return;

            const section = document.getElementById(id);
            section.innerHTML = "";
            section.appendChild(template.content.cloneNode(true));

            loadCSS(css);
            loadJS(js, () => {
                const initFn = window[`init${id.charAt(0).toUpperCase() + id.slice(1)}Section`];
                if (typeof initFn === "function") {
                    initFn(section);
                    console.log(`${id} section init executed`);
                }
            });
        })
        .catch(err => console.error(`Error loading ${id}:`, err));
}


document.addEventListener("DOMContentLoaded", () => {
    Object.keys(sections).forEach(id => loadSection(id));
});

const floatingBtn = document.getElementById("options-floating-btn");
const themePanel = document.getElementById("theme-options-panel");

floatingBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Rotate button
    floatingBtn.classList.add("rotate");
    setTimeout(() => floatingBtn.classList.remove("rotate"), 500);

    // Toggle theme panel
    if (!themePanel.classList.contains("show")) {
        themePanel.style.display = "flex"; // ensure visible before animation
        themePanel.classList.remove("hide");
        themePanel.classList.add("show");
    } else {
        themePanel.classList.remove("show");
        themePanel.classList.add("hide");
        setTimeout(() => {
            themePanel.style.display = "none";
            themePanel.classList.remove("hide");
        }, 400); // match animation duration
    }
});

// Close panel when clicking outside
document.addEventListener("click", (e) => {
    if (!themePanel.contains(e.target) && !floatingBtn.contains(e.target) && themePanel.classList.contains("show")) {
        themePanel.classList.remove("show");
        themePanel.classList.add("hide");
        setTimeout(() => {
            themePanel.style.display = "none";
            themePanel.classList.remove("hide");
        }, 400); // match hide animation duration
    }
});

// Theme selection
const themeButtons = document.querySelectorAll(".theme-btn");
themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");

        document.documentElement.classList.remove(
            "theme-light", "theme-dark", "theme-creme", "theme-retro",
            "theme-vintage", "theme-greyscale", "theme-eyesore", "theme-halloween"
        );

        document.documentElement.classList.add(`theme-${theme}`);
        console.log(`Theme switched to: ${theme}`);
    });
});

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navCollapseEl = document.getElementById('navbarNav');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);

        if (bsCollapse) {
            bsCollapse.hide();
        }
    });
});