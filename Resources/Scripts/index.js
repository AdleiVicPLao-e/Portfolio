// Map sections to their files
const sections = {
  home: { html: "home.html", css: "./Resources/Styles/home.css", js: "./Resources/Scripts/home.js" },
  gallery: { html: "gallery.html", css: "./Resources/Styles/gallery.css", js: "./Resources/Scripts/gallery.js" },
  projects: { html: "projects.html", css: "./Resources/Styles/projects.css", js: "./Resources/Scripts/projects.js" },
  contacts: { html: "contacts.html", css: "./Resources/Styles/contacts.css", js: "./Resources/Scripts/contacts.js" }
};

// Utility: Load CSS file dynamically
function loadCSS(file) {
  if (!document.querySelector(`link[href="${file}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    document.head.appendChild(link);
  }
}

// Utility: Load JS file dynamically
function loadJS(file) {
  if (!document.querySelector(`script[src="${file}"]`)) {
    const script = document.createElement("script");
    script.src = file;
    document.body.appendChild(script);
  }
}

// Load section content
function loadSection(id) {
  const { html, css, js } = sections[id];

  fetch(html)
    .then(res => res.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const template = doc.querySelector("template");
      if (template) {
        const section = document.getElementById(id);
        section.innerHTML = ""; // clear old content
        section.appendChild(template.content.cloneNode(true));

        loadCSS(css);
        loadJS(js);
      }
    })
    .catch(err => console.error(`Error loading ${id}:`, err));
}

// Load all sections on page load
Object.keys(sections).forEach(id => loadSection(id));
