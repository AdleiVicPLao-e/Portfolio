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

    // build main images
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

    // build thumbs
    images.forEach(src => {
        const thumb = document.createElement("img");
        thumb.classList.add("thumb");
        thumb.src = src;
        albumScroller.appendChild(thumb);
    });

    const thumbs = Array.from(albumScroller.querySelectorAll(".thumb"));

    const updateThumbs = (activeIndex) => {
        const container = document.querySelector('.album-scroller');
        const thumbsArray = Array.from(container.querySelectorAll('.thumb'));
        const thumbsCount = thumbsArray.length;
        const isMobile = window.innerWidth <= 767;

        const spacing = 90;   // spacing between thumbs
        const depthStep = 40; // depth for 3D
        const rotateStep = 30; // rotation angle

        const containerSize = isMobile ? container.offsetWidth : container.offsetHeight;
        const centerOffset = isMobile ? 50 : 0;
        const center = containerSize / 2 - centerOffset;

        thumbsArray.forEach((thumb, i) => {
            let offset = i - activeIndex;

            // wrap-around loop
            if (offset < -Math.floor(thumbsCount / 2)) offset += thumbsCount;
            if (offset > Math.floor(thumbsCount / 2)) offset -= thumbsCount;

            const scale = i === activeIndex ? 1.1 : 0.8;
            const opacity = i === activeIndex ? 1 : 0.5;
            const zIndex = thumbsCount - Math.abs(offset);

            let transform;
            if (isMobile) {
                const x = offset * spacing;
                const z = -Math.abs(offset) * depthStep;
                const rotateY = offset * rotateStep;
                thumb.style.position = 'absolute';
                thumb.style.left = `${center}px`;
                transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            } else {
                const y = offset * spacing;
                thumb.style.position = 'absolute';
                thumb.style.top = '0';
                thumb.style.left = '50%';
                transform = `translateX(-50%) translateY(${y + center - thumbsArray[activeIndex].offsetHeight / 2}px) scale(${scale})`;
            }

            thumb.dataset.baseTransform = transform; // 🔑 save base transform
            thumb.style.transform = transform;
            thumb.style.opacity = opacity;
            thumb.style.zIndex = zIndex;
            thumb.classList.toggle('active', i === activeIndex);
        });
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

    // thumb interactions
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => setActive(i, i > currentIndex ? 1 : -1));
        thumb.addEventListener("mouseenter", () => {
            // just add a little scale boost on top of base transform
            const base = thumb.dataset.baseTransform || "";
            thumb.style.transform = base + " scale(1.05)";
        });
        thumb.addEventListener("mouseleave", () => {
            // restore from updateThumbs
            updateThumbs(currentIndex);
        });
    });

    // buttons
    const prevBtn = container.querySelector(".carousel-btn.prev");
    const nextBtn = container.querySelector(".carousel-btn.next");
    prevBtn?.addEventListener("click", () => setActive(currentIndex - 1, -1));
    nextBtn?.addEventListener("click", () => setActive(currentIndex + 1, 1));

    // auto slide
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
