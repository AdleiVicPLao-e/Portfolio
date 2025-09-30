function initGallerySection(container) {
    if (!container) return;

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

    const isMobile = window.innerWidth <= 767; // mobile check

    const updateThumbs = (activeIndex) => {
    if (isMobile) {
        const container = document.querySelector('.album-scroller');
        const thumbsArray = Array.from(document.querySelectorAll('.album-scroller .thumb'));
        const spacing = 90;     // horizontal spacing
        const depthStep = 40;   // translateZ for depth
        const rotateStep = 30;  // rotateY for 3D effect

        const centerX = container.offsetWidth / 2; // fixed center for active thumb

        thumbsArray.forEach((thumb, i) => {
            const offset = i - activeIndex;
            const x = offset * spacing;
            const z = -Math.abs(offset) * depthStep;
            const rotateY = offset * rotateStep;
            const scale = i === activeIndex ? 1.1 : 0.8;
            const opacity = i === activeIndex ? 1 : 0.5;

            // Absolute positioning relative to album-scroller
            thumb.style.position = 'absolute';
            thumb.style.left = `${centerX}px`; // active thumb stays centered
            thumb.style.transform = `
                translateX(${x}px)
                translateZ(${z}px)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
            thumb.style.opacity = opacity;
            thumb.style.zIndex = thumbsArray.length - Math.abs(offset);
            thumb.classList.toggle('active', i === activeIndex);
        });
    } else {
        // Desktop vertical logic
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
            thumb.style.zIndex = thumbs.length - Math.abs(offset);
        });
    }
};




    updateThumbs(currentIndex);

    const setActive = (index, direction = 1) => {
        const newIndex = ((index % imgs.length) + imgs.length) % imgs.length;
        if (newIndex === currentIndex) return;

        const oldImg = imgs[currentIndex];
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

        currentIndex = newIndex;
        updateThumbs(currentIndex);
    };

    thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => setActive(i, i > currentIndex ? 1 : -1));
        thumb.addEventListener("mouseenter", () => {
            const scale = i === currentIndex ? 1.1 : 0.8;
            thumb.style.transform = `translateY(0) scale(${scale * 1.05})`;
        });
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

    window.addEventListener('resize', () => location.reload());
}
