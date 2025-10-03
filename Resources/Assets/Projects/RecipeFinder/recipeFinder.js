document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  let data = JSON.parse(localStorage.getItem("jsonData")) || null;
  let selectedIngredients = [];

  const menuIcon = document.getElementById("menu-icon");
  const navList = document.getElementById("nav-list");

  menuIcon.addEventListener("click", function () {
    navList.classList.toggle("show");
  });

  // ===== Shared Helpers =====
  function toggleIngredientSelection(button) {
    const ingredient = button.textContent;

    if (selectedIngredients.includes(ingredient)) {
      selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
      button.classList.remove("selected");
      button.style.backgroundColor = "";
      button.style.color = "black";
    } else {
      selectedIngredients.push(ingredient);
      button.classList.add("selected");
      button.style.backgroundColor = "#BFE199";
      button.style.color = "white";
    }
    displaySelectedIngredients();
  }

  function clearAllSelections() {
    const buttons = document.querySelectorAll(".ingredient");
    buttons.forEach((button) => {
      button.classList.remove("selected", "highlight");
      button.style.backgroundColor = "";
      button.style.color = "black";
    });
    selectedIngredients = [];
    displaySelectedIngredients();
  }

  function findRecipes() {
    const exactMatches = [];
    const similarMatches = [];

    data.recipeList.forEach((recipe) => {
      const recipeIngredients = recipe.items;
      const exactMatch = selectedIngredients.every((i) =>
        recipeIngredients.includes(i)
      );

      if (exactMatch) {
        exactMatches.push(recipe);
      } else {
        const commonIngredients = selectedIngredients.filter((i) =>
          recipeIngredients.includes(i)
        );
        if (commonIngredients.length > 0) {
          similarMatches.push({ recipe, commonIngredients });
        }
      }
    });

    localStorage.setItem("exactMatches", JSON.stringify(exactMatches));
    localStorage.setItem("similarMatches", JSON.stringify(similarMatches));
  }

  function displaySelectedIngredients() {
    const chosenContainer = document.querySelector(".chosen");
    if (!chosenContainer) return;

    chosenContainer.innerHTML = "";
    const ingredients =
      currentPath.includes("recipe-finder-a.html")
        ? JSON.parse(localStorage.getItem("selectedIngredients")) || []
        : selectedIngredients;

    ingredients.forEach((ingredient) => {
      const el = document.createElement("h1");
      el.classList.add("chosen-ingr");
      el.textContent = ingredient;
      chosenContainer.appendChild(el);
    });
  }

  function createRecipeContainer(recipe) {
    const container = document.createElement("div");
    container.classList.add("recipe");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("recipe-image");

    const link = document.createElement("a");
    link.href = recipe.websiteLink;
    link.target = "_blank";

    const img = document.createElement("img");
    img.src = `Images/Recipes/${recipe.recipeName}.jpg`;
    img.alt = recipe.recipeName;
    img.id = "recipe-pic";

    link.appendChild(img);
    imgDiv.appendChild(link);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("recipe-info");

    const name = document.createElement("h1");
    name.textContent = recipe.recipeName;
    infoDiv.appendChild(name);

    const ingHeader = document.createElement("h2");
    ingHeader.textContent = "Ingredients:";
    infoDiv.appendChild(ingHeader);

    const ingOl = document.createElement("ol");
    recipe.ingredients.forEach((i) => {
      const li = document.createElement("li");
      li.textContent = i;
      ingOl.appendChild(li);
    });
    infoDiv.appendChild(ingOl);

    const stepsHeader = document.createElement("h2");
    stepsHeader.textContent = "Steps:";
    infoDiv.appendChild(stepsHeader);

    const stepsOl = document.createElement("ol");
    recipe.steps.forEach((s, idx) => {
      const li = document.createElement("li");
      li.textContent = s["step" + (idx + 1)];
      stepsOl.appendChild(li);
    });
    infoDiv.appendChild(stepsOl);

    container.appendChild(imgDiv);
    container.appendChild(infoDiv);

    return container;
  }

  // ===== Page Inits =====
  function initIndex() {
    const btn = document.getElementById("find-recipes-button");
    if (!btn) return;

    btn.addEventListener("click", () => {
      fetch("food-recipe.json")
        .then((r) => r.json())
        .then((jsonData) => {
          localStorage.setItem("jsonData", JSON.stringify(jsonData));
          window.location.href = "recipe-finder.html";
        })
        .catch(() => alert("Failed to load recipes."));
    });
  }

  function initFinder() {
    if (!data) return;
    const contentBlock = document.querySelector(".content-block");
    if (!contentBlock) return;

    // Categories + ingredient buttons
    data.foodCategories.forEach((cat) => {
      const div = document.createElement("div");
      div.classList.add("category-container");

      const h2 = document.createElement("h2");
      h2.textContent = cat.categoryName;
      div.appendChild(h2);
      div.appendChild(document.createElement("hr"));

      cat.items.forEach((item) => {
        const btn = document.createElement("button");
        btn.classList.add("ingredient");
        btn.textContent = item;
        btn.addEventListener("click", () => toggleIngredientSelection(btn));
        div.appendChild(btn);
      });

      contentBlock.appendChild(div);
    });

    // Controls
    const clearBtn = document.querySelector(".clear-all");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        clearAllSelections();
        const searchBox = document.getElementById("search-b");
        if (searchBox) searchBox.value = "";
      });
    }

    const findBtn = document.getElementById("find");
    if (findBtn) {
      findBtn.addEventListener("click", (e) => {
        if (selectedIngredients.length < 3) {
          e.preventDefault();
          alert("Please select at least 3 ingredients.");
        } else {
          localStorage.setItem(
            "selectedIngredients",
            JSON.stringify(selectedIngredients)
          );
          findRecipes();
        }
      });
    }
  }

  function initResults() {
    const exact = JSON.parse(localStorage.getItem("exactMatches")) || [];
    const similar = JSON.parse(localStorage.getItem("similarMatches")) || [];

    displaySelectedIngredients();

    const block = document.querySelector(".recipe-block");
    if (!block) return;

    exact.forEach((r) => block.appendChild(createRecipeContainer(r)));

    if (similar.length) {
      const reco = document.createElement("div");
      reco.classList.add("reco");
      reco.textContent = "Other Recipe Recommendations";
      block.appendChild(reco);

      similar.forEach((m) =>
        block.appendChild(createRecipeContainer(m.recipe))
      );
    }
  }

  function initCategory() {
    if (!data) return;
    const categoryBlock = document.querySelector(".category-block");
    if (!categoryBlock) return;

    data.foodCategories.forEach((cat) => {
      const wrap = document.createElement("div");
      wrap.classList.add("categ");

      wrap.innerHTML = `
        <div class="category-desc">
          <div class="category-img" style="
            background:url('Images/Categories/${cat.categoryName}.jpg') center/cover no-repeat"></div>
          <div class="category-info">
            <h1>${cat.categoryName}</h1>
            <p>${cat.description}</p>
          </div>
        </div>
      `;
      categoryBlock.appendChild(wrap);
    });

    const searchBox = document.getElementById("search-box");
    if (searchBox) {
      searchBox.addEventListener("input", () => {
        const val = searchBox.value.toLowerCase();
        document.querySelectorAll(".categ").forEach((el) => {
          const name = el.querySelector("h1").textContent.toLowerCase();
          el.style.display = name.includes(val) ? "block" : "none";
        });
      });
    }
  }

  // ===== Init Router =====
  if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
    initIndex();
  } else if (currentPath.includes("recipe-finder.html") && !currentPath.includes("recipe-finder-a.html")) {
    initFinder();
  } else if (currentPath.includes("recipe-finder-a.html")) {
    initResults();
  } else if (currentPath.includes("category.html")) {
    initCategory();
  }
});
