// Wait for the DOM Tree Creation Completition
document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      renderCarousel(data.carousel);
      renderFlashSale(data.flashSale);
      renderCategories(data.categories);
      renderJustForYou(data.justForYou);
    })
    .catch((err) => console.error("Failed to load data.json:", err))
    .finally(() => {
      initCarousel();
      initStickyHeader();
      initSideNav();
      initThumbs();
      initZoom();
      initQty();
      initColorSelect();
      initFlashTimer();
      initViewMore();
    });
});

// Render: Carousel slides
function renderCarousel(slides) {
  const track = document.getElementById("carousel-track");
  if (!track || !slides) return;
  track.innerHTML = slides
    .map(
      (s) =>
        `<div class="carousel-slide"><img src="${s.src}" alt="${s.alt}" /></div>`,
    )
    .join("");
}

// Render: Flash Sale cards
function renderFlashSale(products) {
  const container = document.getElementById("flash-sale-cards");
  if (!container || !products) return;
  container.innerHTML = products
    .map(
      (p) => `
      <div class="col-6 col-sm-4 col-md-2">
        <a href="${p.href}" class="product-card">
          <img src="${p.img}" alt="${p.alt}" />
          <p class="product-card-name">${p.name}</p>
          <p class="product-card-price">${p.price}</p>
          <div class="product-card-meta">
            <span class="product-card-original">${p.original}</span>
            <span class="product-card-discount">${p.discount}</span>
          </div>
        </a>
      </div>`,
    )
    .join("");
}

// Render: Categories
function renderCategories(categories) {
  const grid = document.getElementById("categories-grid");
  if (!grid || !categories) return;
  grid.innerHTML = categories
    .map(
      (c) => `
      <div class="category-col">
        <a href="#" class="category-item">
          <img src="${c.img}" alt="${c.alt}" /><span>${c.label}</span>
        </a>
      </div>`,
    )
    .join("");
}

// Render: Just For You cards
function renderJustForYou(products) {
  const container = document.getElementById("jfy-cards");
  if (!container || !products) return;
  container.innerHTML = products
    .map(
      (p) => `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2">
        <a href="${p.href}" class="jfy-card">
          <img src="${p.img}" alt="${p.alt}" />
          <div class="jfy-card-info">
            <p class="jfy-card-name">${p.name}</p>
            <div class="jfy-card-price-row">
              <span class="jfy-card-price">${p.price}</span>
              <span class="jfy-card-discount">${p.discount}</span>
            </div>
            <div class="jfy-card-rating">
              <span class="jfy-stars">${p.stars}</span>
              <span>${p.reviews}</span>
            </div>
          </div>
        </a>
      </div>`,
    )
    .join("");
}

// Carousel
let currentIndex = 0;
let totalSlides = 0;
let autoTimer = null;

function initCarousel() {
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");
  if (!track || !dots) return;

  // Count number of slides
  const slides = track.querySelectorAll(".carousel-slide");
  totalSlides = slides.length;

  // Build one dot button per slide
  const dotsHTML = Array.from(slides)
    .map(
      (_, i) =>
        `<button
        class="dot${i === 0 ? " dot--active" : ""}"
        data-index="${i}"
        aria-label="Go to slide ${i + 1}"
      ></button>`,
    )
    .join("");
  dots.innerHTML = dotsHTML;

  // dots mapping to related banners
  dots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      resetAutoPlay();
    });
  });

  // Prev/next buttons
  document.getElementById("btn-prev").addEventListener("click", () => {
    goTo((currentIndex - 1 + totalSlides) % totalSlides);
    resetAutoPlay();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    goTo((currentIndex + 1) % totalSlides);
    resetAutoPlay();
  });

  // Start at slide 0
  goTo(0);
  startAutoPlay();
}

// Move the track to show the slide
function goTo(index) {
  currentIndex = index;

  const track = document.getElementById("carousel-track");
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("dot--active", i === currentIndex);
  });
}

// Auto-advance every 5 seconds
function startAutoPlay() {
  autoTimer = setInterval(() => {
    goTo((currentIndex + 1) % totalSlides);
  }, 5000);
}

// Stop and restart the auto-play timer
function resetAutoPlay() {
  clearInterval(autoTimer);
  startAutoPlay();
}

function initStickyHeader() {
  const topBar = document.querySelector(".top-bar");
  const onlyHeight = document.querySelector(".homepage-only-height");
  const flashSale = document.querySelector(".flash-sale");
  const productMain = document.querySelector(".product-main");

  function update() {
    // only-height: hide as soon as user scrolls even 1px (index page only)
    if (onlyHeight) {
      onlyHeight.classList.toggle("only-height--hidden", window.scrollY > 0);
    }

    if (flashSale) {
      // Hide top-bar when flash-sale's top edge reaches the bottom of the header
      const headerBottom = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
      const flashTop = flashSale.getBoundingClientRect().top;
      topBar.classList.toggle("top-bar--hidden", flashTop <= headerBottom);
    } else if (productMain && topBar) {
      // Hide top-bar once the user has scrolled ~60px into the product content
      topBar.classList.toggle("top-bar--hidden", window.scrollY > 60);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Side navigator: scroll-to and active state
function initSideNav() {
  const sideNav = document.getElementById("side-nav");
  if (!sideNav) return;

  const navTop = document.getElementById("nav-top");
  const navItems = document.querySelectorAll(".side-nav-item[data-section]");
  const sections = ["flash-sale", "categories", "just-for-you"];

  // Scroll to top
  navTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Scroll to section on click
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.querySelector("." + btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Show nav when flash-sale bottom edge enters viewport from below
  const flashSale = document.querySelector(".flash-sale");
  if (!flashSale) return;

  window.addEventListener("scroll", () => {
    const flashTop = flashSale.getBoundingClientRect().top;
    sideNav.classList.toggle(
      "side-nav--visible",
      flashTop < window.innerHeight,
    );
  });

  // Active state: section becomes active when it crosses above mid-page
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = sections.find((c) =>
            entry.target.classList.contains(c),
          );
          navItems.forEach((btn) => {
            btn.classList.toggle(
              "nav--active",
              btn.dataset.section === sectionClass,
            );
          });
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -45% 0px" },
  );

  document
    .querySelectorAll(".flash-sale, .categories, .just-for-you")
    .forEach((sec) => activeObserver.observe(sec));
}

// image and thumbs
function initThumbs() {
  const thumbs = document.querySelectorAll(".pd-thumb");
  const mainImg = document.getElementById("pd-main-img");
  if (!thumbs.length || !mainImg) return;

  let lockedSrc = mainImg.src;

  thumbs.forEach((thumb) => {
    const src = thumb.dataset.src;

    // Hover: preview image in main frame
    thumb.addEventListener("mouseenter", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(src);
      }, 120);
    });

    // Mouse leave: restore locked image
    thumb.addEventListener("mouseleave", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = lockedSrc;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(lockedSrc);
      }, 120);
    });

    // Click: lock the image permanently
    thumb.addEventListener("click", () => {
      lockedSrc = src;
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(src);
      }, 120);
    });
  });

  // Thumbnail strip prev/next scroll
  const strip = document.getElementById("pd-thumbs");
  document.getElementById("pd-thumb-prev")?.addEventListener("click", () => {
    strip.scrollBy({ left: -80, behavior: "smooth" });
  });
  document.getElementById("pd-thumb-next")?.addEventListener("click", () => {
    strip.scrollBy({ left: 80, behavior: "smooth" });
  });
}

// Glass magnifier zoom
function initZoom() {
  const wrap = document.getElementById("pd-zoom-wrap");
  const lens = document.getElementById("pd-zoom-lens");
  const result = document.getElementById("pd-zoom-result");
  const mainImg = document.getElementById("pd-main-img");
  if (!wrap || !lens || !result || !mainImg) return;

  const ZOOM = 3;

  function updateZoomBg(src) {
    result.style.backgroundImage = `url('${src}')`;
  }
  window.updateZoomBg = updateZoomBg;

  // Size the result panel dynamically
  function sizeResultPanel() {
    const layout = document.querySelector(".pd-layout");
    const gallery = document.querySelector(".pd-gallery");
    if (!layout || !gallery) return;

    const layoutRect = layout.getBoundingClientRect();
    const galleryRect = gallery.getBoundingClientRect();

    const availableWidth = layoutRect.right - galleryRect.right - 16;
    const availableHeight = wrap.getBoundingClientRect().height;

    result.style.width = Math.max(availableWidth, 200) + "px";
    result.style.height = Math.max(availableHeight, 300) + "px";
    result.style.left = galleryRect.width + 16 + "px";
    result.style.top = "0";
  }

  wrap.addEventListener("mouseenter", () => {
    sizeResultPanel();
    lens.style.display = "block";
    result.style.display = "block";
    updateZoomBg(mainImg.src);
  });

  wrap.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
  });

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const lensW = lens.offsetWidth;
    const lensH = lens.offsetHeight;

    // Clamp so lens stays inside the wrap
    x = Math.max(lensW / 2, Math.min(x, rect.width - lensW / 2));
    y = Math.max(lensH / 2, Math.min(y, rect.height - lensH / 2));

    // Position lens centred on cursor
    lens.style.left = `${x - lensW / 2}px`;
    lens.style.top = `${y - lensH / 2}px`;

    // Compute zoomed background.
    const bgW = rect.width * ZOOM;
    const bgH = rect.height * ZOOM;
    const bgX = (x / rect.width) * bgW - result.offsetWidth / 2;
    const bgY = (y / rect.height) * bgH - result.offsetHeight / 2;

    result.style.backgroundSize = `${bgW}px ${bgH}px`;
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });
}

// 3. Quantity +/-
function initQty() {
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");
  const val = document.getElementById("qty-val");
  if (!minus || !plus || !val) return;

  minus.addEventListener("click", () => {
    const n = parseInt(val.textContent);
    if (n > 1) val.textContent = n - 1;
  });

  plus.addEventListener("click", () => {
    val.textContent = parseInt(val.textContent) + 1;
  });
}

// ── 4. Color selector
function initColorSelect() {
  const btns = document.querySelectorAll(".pd-color-btn");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// 5. Flash sale countdown
function initFlashTimer() {
  const el = document.getElementById("flash-timer");
  if (!el) return;

  let total = 10 * 3600 + 1 * 60 + 55;

  setInterval(() => {
    if (total <= 0) {
      el.textContent = "00:00:00";
      return;
    }
    total--;
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// View More / View Less toggle
function initViewMore() {
  const btn = document.getElementById("pd-view-more-btn");
  const content = document.getElementById("pd-desc-content");
  const fade = document.getElementById("pd-desc-fade");
  // NOTE: the wrap is NOT hidden anymore; instead the button text toggles.
  if (!btn || !content || !fade) return;

  let expanded = false;

  btn.addEventListener("click", () => {
    expanded = !expanded;

    if (expanded) {
      // Expand
      content.classList.add("pd-desc-expanded");
      fade.classList.add("pd-desc-fade-hidden");
      btn.textContent = "VIEW LESS";
    } else {
      // Collapse back
      content.classList.remove("pd-desc-expanded");
      fade.classList.remove("pd-desc-fade-hidden");
      btn.textContent = "VIEW MORE";

      // Scroll back up to the description section so the user isn't stranded
      const wrap = document.getElementById("pd-desc-wrap");
      if (wrap) {
        wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}
