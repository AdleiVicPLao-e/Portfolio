document.addEventListener("DOMContentLoaded", function () {
  const currentPathname = window.location.pathname;
  const url = `https://api.thedogapi.com/v1/breeds`;
  const dog_url = `https://api.thedogapi.com/v1/`;
  const cat_url = `https://api.thecatapi.com/v1/`;
  const caturl = `https://api.thecatapi.com/v1/breeds`;
  const cat_key =
    "live_sVJPPprA0l8licwaH0RCWl8AByCyaxwXl8LO5Gyf1Du16pSpMtw9RnJR7LWrB3ah";
  const dog_key =
    "live_LCFf5A2ACfYL1qKtAJ2fzPYg1PktttqEtvcgGwhOzo87HJeNLAYgYiKZc7AAB5iy";
  var api_key = null;
  var voteu = null;
  var player;
  function applyFont() {
    const elementsToStyle = document.querySelectorAll("*");
    elementsToStyle.forEach((element) => {
      element.style.fontFamily = "Noto Sans, sans-serif";
    });
  }

  applyFont();

  let showMoreButtonCats;

  if (currentPathname.endsWith("dogs.html")) {
    fetch(url, {
      headers: {
        "x-api-key": dog_key,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = data.filter((img) => img.image?.url != null);
        for (let i = 0; i < data.length; i++) {
          const breed = data[i];
          if (!breed.image) continue;
          let option = document.createElement("option");
          option.value = i;
          option.innerHTML = `${breed.name}`;
          document.getElementById("breed_selector").appendChild(option);
        }

        const breedSelector = document.getElementById("breed_selector");
        breedSelector.addEventListener("change", function () {
          const selectedIndex = breedSelector.value;
          showDogBreedImage(selectedIndex);

          player = null;

          showBreedVideoForSelection(this, true);
        });

        showDogBreedImage(0);
        showBreedVideo(data[0].name, true);

        const showMoreButton = document.getElementById("show-more");
        showMoreButton.addEventListener("click", fetchDogBreedImages);

        fetchDogBreedImages();

        function showBreedVideoForSelection(selectElement, isDog) {
          const selectedIndex = selectElement.value;
          const breedName = data[selectedIndex].name;
          showBreedVideo(breedName, isDog);
        }

        function showDogBreedImage(index) {
          document.getElementById("breed_image").src = data[index].image.url;
          document.getElementById("breed_name").textContent = data[index].name;
          document.getElementById("breed_temperament").textContent =
            data[index].temperament;
          document.getElementById("breed_weight_imperial").textContent =
            data[index].weight.imperial;
          document.getElementById("breed_weight_metric").textContent =
            data[index].weight.metric;
          document.getElementById("breed_height_imperial").textContent =
            data[index].height.imperial;
          document.getElementById("breed_height_metric").textContent =
            data[index].weight.metric;
          document.getElementById("breed_bred_for").textContent =
            data[index].bred_for;
          document.getElementById("breed_breed_group").textContent =
            data[index].breed_group;
          document.getElementById("breed_life_span").textContent =
            data[index].life_span;
          document.getElementById("breed_origin").textContent =
            data[index].origin;
        }

        function fetchDogBreedImages() {
          const imageContainer = document.getElementById("image-container");

          const breedsToDisplay = data.slice(
            imageContainer.children.length,
            imageContainer.children.length + 4
          );

          breedsToDisplay.forEach((breed) => {
            if (breed.image && breed.image.url) {
              const img = document.createElement("img");
              img.src = breed.image.url;
              img.alt = "Dog Breed Image";
              img.style.maxHeight = "3in";
              img.style.marginRight = "10px";
              img.style.marginBottom = "10px";
              img.style.objectFit = "cover";

              img.addEventListener("mouseenter", () => {
                img.style.filter = "grayscale(100%)";
                img.style.border = "3px solid #000";
              });

              img.addEventListener("mouseleave", () => {
                img.style.filter = "none";
                img.style.border = "none";
              });

              img.addEventListener("click", (event) => {
                const messageBubble = createMessageBubble();
                const x = event.clientX;
                const y = event.clientY;
                showMessageBubble(messageBubble, breed.name, x, y);
              });

              imageContainer.appendChild(img);
            }
          });
        }

        const voteUpButton = document.getElementById("vote-up");
        voteUpButton.addEventListener("click", () => vote(1));

        const voteDownButton = document.getElementById("vote-down");
        voteDownButton.addEventListener("click", () => vote(-1));

        const historyButton = document.getElementById("history");
        historyButton.addEventListener("click", showHistoricVotes);

        const showVoteButtons = document.getElementById("show-votes");
        showVoteButtons.addEventListener("click", showVoteOptions);

        fetchDogBreedImages();

        window.addEventListener("load", () => {
          setTimeout(() => {
            showMoreButton.click();
            voteUpButton.click();
            voteDownButton.click();
            showVoteButtons.click();
            historyButton.click();
          }, 1000);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (currentPathname.endsWith("cats.html")) {
    fetch(caturl, {
      headers: {
        "x-api-key": cat_key,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = data.filter((img) => img.image?.url != null);

        for (let i = 0; i < data.length; i++) {
          const breed = data[i];
          if (!breed.image) continue;
          let option = document.createElement("option");
          option.value = i;
          option.innerHTML = `${breed.name}`;
          document.getElementById("breed_selector").appendChild(option);
        }

        showCatBreedImage(0);

        const breedSelector = document.getElementById("breed_selector");
        breedSelector.addEventListener("change", function () {
          const selectedIndex = breedSelector.value;
          showCatBreedImage(selectedIndex);
            player = null;
          
          showBreedVideoForSelection(this, false);
        });

        showCatBreedImage(0);
        showBreedVideo(data[0].name, false);

        showMoreButtonCats = document.getElementById("show-more-cats");
        showMoreButtonCats.addEventListener("click", fetchCatImages);

        fetchCatImages();

        window.addEventListener("load", () => {
          setTimeout(() => {
            showMoreButtonCats.click();
          }, 1000);
        });
        function showBreedVideoForSelection(selectElement, isDog) {
          const selectedIndex = selectElement.value;
          const breedName = data[selectedIndex].name;

          showBreedVideo(breedName, isDog);
        }

        function showCatBreedImage(index) {
          document.getElementById("breed_image").src = data[index].image.url;
          document.getElementById("breed_name").textContent = data[index].name;
          document.getElementById("alt_names").textContent =
            data[index].alt_names;
          document.getElementById("breed_weight_imperial").textContent =
            data[index].weight.imperial;
          document.getElementById("breed_weight_metric").textContent =
            data[index].weight.metric;
          document.getElementById("breed_life_span").textContent =
            data[index].life_span;
          document.getElementById("breed_origin").textContent =
            data[index].origin;
          document.getElementById("breed_temperament").textContent =
            data[index].temperament;
          document.getElementById("indoor").textContent = data[index].indoor;
          document.getElementById("lap").textContent = data[index].lap;
          document.getElementById("adapt").textContent =
            data[index].adaptability;
          document.getElementById("affection_level").textContent =
            data[index].affection_level;
          document.getElementById("child_friendly").textContent =
            data[index].child_friendly;
          document.getElementById("dog_friendly").textContent =
            data[index].dog_friendly;
          document.getElementById("energy_level").textContent =
            data[index].energy_level;
          document.getElementById("grooming").textContent =
            data[index].grooming;
          document.getElementById("health_issues").textContent =
            data[index].health_issues;
          document.getElementById("intelligence").textContent =
            data[index].intelligence;
          document.getElementById("shedding_level").textContent =
            data[index].shedding_level;
          document.getElementById("social_needs").textContent =
            data[index].social_needs;
          document.getElementById("stranger_friendly").textContent =
            data[index].stranger_friendly;
          document.getElementById("hairless").textContent =
            data[index].hairless;
          document.getElementById("natural").textContent = data[index].natural;
          document.getElementById("rare").textContent = data[index].rare;
          document.getElementById("rex").textContent = data[index].rex;
          document.getElementById("suppressed_tail").textContent =
            data[index].suppressed_tail;
          document.getElementById("short_legs").textContent =
            data[index].short_legs;
          document.getElementById("hypoallergenic").textContent =
            data[index].hypoallergenic;
          document.getElementById("description").textContent =
            data[index].description;
        }

        function fetchCatImages() {
          const catImagesContainer = document.getElementById(
            "image-container-cats"
          );
          const breedsUrl = "https://api.thecatapi.com/v1/breeds";

          fetch(breedsUrl)
            .then((response) => response.json())
            .then((breedsData) => {
              const breedIds = breedsData.map((breed) => breed.id);
              const shuffledBreedIds = shuffleArray(breedIds).slice(0, 4);

              const promises = shuffledBreedIds.map(async (breedId) => {
                const breedImageUrl = `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}`;
                const response = await fetch(breedImageUrl);
                const data = await response.json();
                const imageUrl = data[0].url;
                const breedName = breedsData.find(
                  (breed) => breed.id === breedId
                ).name;
                const catImage = document.createElement("img");
                catImage.src = imageUrl;
                catImage.className = "cat-image";
                catImage.alt = breedName;
                catImage.addEventListener("mouseenter", () => {
                  catImage.style.filter = "grayscale(100%)";
                  catImage.style.border = "3px solid #000";
                });
                catImage.addEventListener("mouseleave", () => {
                  catImage.style.filter = "none";
                  catImage.style.border = "none";
                });
                catImage.addEventListener("click", (event) => {
                  const messageBubble = createMessageBubbleCats();
                  const x = event.clientX;
                  const y = event.clientY;
                  showMessageBubbleCats(messageBubble, breedName, x, y);
                });
                catImagesContainer.appendChild(catImage);
              });

              Promise.all(promises).catch((error) => {
                console.error("Error fetching cat images:", error);
              });
            })
            .catch((error) => {
              console.error("Error fetching cat breeds:", error);
            });
        }

        fetchCatImages();

        const voteUpButton = document.getElementById("vote-up");
        voteUpButton.addEventListener("click", () => vote(1));

        const voteDownButton = document.getElementById("vote-down");
        voteDownButton.addEventListener("click", () => vote(-1));

        const historyButton = document.getElementById("history");
        historyButton.addEventListener("click", showHistoricVotes);

        const showVoteButtons = document.getElementById("show-votes");
        showVoteButtons.addEventListener("click", showVoteOptions);
      })

      .catch(function (error) {
        console.log(error);
      });
  }

  function createMessageBubble() {
    let messageBubble = document.querySelector(".message-bubble");
    if (!messageBubble) {
      messageBubble = document.createElement("div");
      messageBubble.className = "message-bubble";
      document.body.appendChild(messageBubble);
    }
    return messageBubble;
  }

  function showMessageBubble(messageBubble, content, x, y) {
    messageBubble.innerText = content;
    messageBubble.style.left = x + "px";
    messageBubble.style.top = y + "px";
    messageBubble.classList.add("active");

    setTimeout(() => {
      hideMessageBubble(messageBubble);
    }, 2000);
  }

  function hideMessageBubble(messageBubble) {
    messageBubble.classList.remove("active");
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createMessageBubbleCats() {
    let messageBubbleCats = document.querySelector(".message-bubble");
    if (!messageBubbleCats) {
      messageBubbleCats = document.createElement("div");
      messageBubbleCats.className = "message-bubble";
      document.body.appendChild(messageBubbleCats);
    }
    return messageBubbleCats;
  }

  function showMessageBubbleCats(messageBubbleCats, content, x, y) {
    messageBubbleCats.innerText = content;
    messageBubbleCats.style.left = x + "px";
    messageBubbleCats.style.top = y + "px";
    messageBubbleCats.classList.add("active");

    setTimeout(() => {
      hideMessageBubbleCats(messageBubbleCats);
    }, 2000);
  }

  function hideMessageBubbleCats(messageBubbleCats) {
    messageBubbleCats.classList.remove("active");
  }

  function showBreedVideo(breedName, isDog) {
    const videoUrl = isDog ? "dogbreedvids.json" : "catbreedvids.json";

    fetch(videoUrl)
      .then((res) => res.json())
      .then((data) => {
        const embedId = data.find((item) => item["Breed"] === breedName)?.[
          "Embed ID"
        ];

        const existingPlayer = document.getElementById("videoplayer");

        if (existingPlayer) {
          existingPlayer.parentNode.removeChild(existingPlayer);
        }

        const newPlayer = document.createElement("div");
        newPlayer.id = "videoplayer";
        document.getElementById("player").appendChild(newPlayer);

        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        player = new YT.Player("videoplayer", {
          height: "390",
          width: "640",
          videoId: embedId,
          playerVars: {
            controls: 0,
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /*VOTE*/

  let currentImageToVoteOn;

  function showHistoricVotes() {
    const voteOptions = document.getElementById("vote-options");
    const voteResults = document.getElementById("vote-results");
  
    voteOptions.style.display = "none";
    voteResults.style.display = "block";
  
    let voteu, api_key;
    if (currentPathname.endsWith("dogs.html")) {
      voteu = dog_url;
      api_key = dog_key;
    } else if (currentPathname.endsWith("cats.html")) {
      voteu = cat_url;
      api_key = cat_key;
    }
  
    const voteurl = `${voteu}votes?limit=10&order=DESC`;
    fetch(voteurl, {
      headers: {
        "x-api-key": api_key,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((voteData) => {
          const imageData = voteData.image;
          const image = document.createElement("img");
          image.src = imageData.url;
  
          const gridCell = createGridCell(voteData);
          document.getElementById("grid").appendChild(gridCell);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function createGridCell(voteData) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("col-lg");
  
    if (voteData.value < 0) {
      gridCell.classList.add("red");
    } else {
      gridCell.classList.add("green");
    }
  
    const image = document.createElement("img");
    image.src = voteData.image.url;
  
    gridCell.appendChild(image);
    return gridCell;
  }  

  function showVoteOptions() {
    document.getElementById("grid").innerHTML = "";

    document.getElementById("vote-options").style.display = "block";
    document.getElementById("vote-results").style.display = "none";

    showImageToVoteOn();
  }

  function showImageToVoteOn() {
    if (currentPathname.endsWith("dogs.html")) {
      voteu = dog_url;
      api_key = dog_key;
    }
    if (currentPathname.endsWith("cats.html")) {
      voteu = cat_url;
      api_key = cat_key;
    }
    const voteurl = `${voteu}images/search`;

    fetch(voteurl, {
      headers: {
        "x-api-key": api_key,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        currentImageToVoteOn = data[0];
        document.getElementById("image-to-vote-on").src =
          currentImageToVoteOn.url;
      });
  }

  function vote(value) {
    if (currentPathname.endsWith("dogs.html")) {
      voteu = dog_url;
      api_key = dog_key;
    }
    if (currentPathname.endsWith("cats.html")) {
      voteu = cat_url;
      api_key = cat_key;
    }
    const voteurl = `${voteu}votes/`;
    const body = {
      image_id: currentImageToVoteOn.id,
      value,
    };
    fetch(voteurl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        "x-api-key": api_key,
      },
    }).then((response) => {
      showVoteOptions();
    });
  }

  showVoteOptions();
});

/*SEARCH*/

/*DOGS*/

document.addEventListener("DOMContentLoaded", function() {
  const breedSelector = document.getElementById('breed_selector');
  breedSelector.addEventListener('change', function () {
    const selectedIndex = breedSelector.value;
    showDogBreedImage(selectedIndex);
    player = null;
    showBreedVideoForSelection(this, true);
  });

  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', performBreedSearch);

  function performBreedSearch() {
    const searchInput = document.getElementById('search-breed').value.toLowerCase();
    const breedSelector = document.getElementById('breed_selector');

    for (let i = 0; i < breedSelector.options.length; i++) {
      if (breedSelector.options[i].text.toLowerCase() === searchInput) {
        breedSelector.value = i;
        const event = new Event('change');
        breedSelector.dispatchEvent(event);
        return;
      }
    }

    alert('Breed not found');
  }
});

/*CATS*/
document.addEventListener("DOMContentLoaded", function() {
  const breedSelector = document.getElementById('breed_selector');
  breedSelector.addEventListener('change', function () {
    const selectedIndex = breedSelector.value;
    showCatBreedImage(selectedIndex);
    if (player) {
      player = null;
    }
    showBreedVideoForSelection(this, false);
  });

  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', performBreedSearch);

  function performBreedSearch() {
    const searchInput = document.getElementById('search-breed').value.toLowerCase();
    const breedSelector = document.getElementById('breed_selector');

    for (let i = 0; i < breedSelector.options.length; i++) {
      if (breedSelector.options[i].text.toLowerCase() === searchInput) {
        breedSelector.value = i; 
        const event = new Event('change');
        breedSelector.dispatchEvent(event);
        return;
      }
    }

    alert('Breed not found');
  }
});