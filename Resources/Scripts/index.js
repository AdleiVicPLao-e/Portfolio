const sections = {
  home: { html: "home.html", css: "./Resources/Styles/home.css", js: "./Resources/Scripts/home.js" },
  aboutMe: { html: "about-me.html", css: "./Resources/Styles/about-me.css", js: "./Resources/Scripts/about-me.js" },
  gallery: { html: "gallery.html", css: "./Resources/Styles/gallery.css", js: "./Resources/Scripts/gallery.js" },
  projects: { html: "projects.html", css: "./Resources/Styles/projects.css", js: "./Resources/Scripts/projects.js" },
  contacts: { html: "contacts.html", css: "./Resources/Styles/contacts.css", js: "./Resources/Scripts/contacts.js" }
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
  const { html, css, js } = sections[id];

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
          initFn(section);  // pass the container
          console.log(`${id} section init executed`);
        }
      });
    })
    .catch(err => console.error(`Error loading ${id}:`, err));
}


document.addEventListener("DOMContentLoaded", () => {
  Object.keys(sections).forEach(id => loadSection(id));
});
