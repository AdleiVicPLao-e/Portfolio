function initGallerySection(container) {
  if (!container) return;
    //TO REPLACE
  const images = [
    "Resources/Assets/Images/Gallery/pch1.jpg",
    "Resources/Assets/Images/Gallery/pch2.jpg",
    "Resources/Assets/Images/Gallery/pch3.jpg",
    "Resources/Assets/Images/Gallery/pch4.jpg",
    "Resources/Assets/Images/Gallery/pch5.jpg",
    "Resources/Assets/Images/Gallery/pch6.jpg"
  ];

  const mainCarousel = container.querySelector(".main-carousel");
  const albumScroller = container.querySelector(".album-scroller .thumbs");
  if (!mainCarousel || !albumScroller || !images.length) return;

  let currentIndex = 0;
  let interval;

  const imgs = images.map((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("main-image");
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100%";
    img.style.opacity = i === 0 ? "1" : "0"; 
    img.style.transform = "translateX(0)";
    img.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    mainCarousel.appendChild(img);
    return img;
  });

  images.forEach(src => {
    const thumb = document.createElement("img");
    thumb.classList.add("thumb");
    thumb.src = src;
    albumScroller.appendChild(thumb);
  });

  const thumbs = Array.from(albumScroller.querySelectorAll(".thumb"));
  const radius = 100;
  const angleStep = 360 / thumbs.length;

  const updateThumbs = (activeIndex) => {
  const spacing = 90;

  thumbs.forEach((thumb, i) => {
    const offset = i - activeIndex;
    const yOffset = offset * spacing;
    const scale = i === activeIndex ? 1.1 : 0.8;
    const opacity = i === activeIndex ? 1 : 0.5;

    const centerY = albumScroller.offsetHeight / 2 - thumbs[activeIndex].offsetHeight / 2;
    const translateY = yOffset + centerY - thumbs[activeIndex].offsetTop;

    thumb.style.transform = `translateY(${translateY}px) scale(${scale})`;
    thumb.style.opacity = opacity;
    thumb.classList.toggle("active", i === activeIndex);
    thumb.style.zIndex = images.length - Math.abs(offset);
  });
};

  updateThumbs(currentIndex);

  const setActive = (index, direction = 1) => {
    if (index === currentIndex) return;

    const oldImg = imgs[currentIndex];
    const newIndex = ((index % imgs.length) + imgs.length) % imgs.length;
    const newImg = imgs[newIndex];

    newImg.style.transition = "none";
    newImg.style.transform = `translateX(${direction * 100}%)`;
    newImg.style.opacity = "1";

    requestAnimationFrame(() => {
      oldImg.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      oldImg.style.transform = `translateX(${-direction * 100}%)`;
      oldImg.style.opacity = "0";

      newImg.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      newImg.style.transform = "translateX(0)";
    });

    updateThumbs(newIndex);

    currentIndex = newIndex;
  };

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => setActive(i, i > currentIndex ? 1 : -1));
    thumb.addEventListener("mouseenter", () => thumb.style.transform += " scale(1.05)");
    thumb.addEventListener("mouseleave", () => updateThumbs(currentIndex));
  });

  const prevBtn = container.querySelector(".carousel-btn.prev");
  const nextBtn = container.querySelector(".carousel-btn.next");
  prevBtn?.addEventListener("click", () => setActive(currentIndex - 1, -1));
  nextBtn?.addEventListener("click", () => setActive(currentIndex + 1, 1));

  const startAutoSlide = () => {
    stopAutoSlide();
    interval = setInterval(() => setActive(currentIndex + 1, 1), 4000);
  };
  const stopAutoSlide = () => interval && clearInterval(interval);

  [mainCarousel, albumScroller].forEach(el => {
    el.addEventListener("mouseenter", stopAutoSlide);
    el.addEventListener("mouseleave", startAutoSlide);
  });

  startAutoSlide();
}
