// Wait for the DOM Tree Creation Completition
document.addEventListener("DOMContentLoaded", () => {
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

// Carousel
let currentIndex = 0;
let totalSlides = 0;
let autoTimer = null;

function initCarousel() {
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");

  // Count how many slides are already in the HTML
  const slides = track.querySelectorAll(".carousel-slide");
  totalSlides = slides.length;

  // Build one dot button per slide and inject them into the dots container
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

  // Clicking a dot jumps straight to that slide
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

// Move the track to show the slide at `index` and sync the active dot
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

// Sticky header: hide top-bar after scrolling past hero section
function initStickyHeader() {
  const topBar = document.querySelector(".top-bar");
  const onlyHeight = document.querySelector(".homepage-only-height");
  const mainHeader = document.querySelector(".main-header");
  const flashSale = document.querySelector(".flash-sale");
  const heroSection = document.querySelector(".hero-section");

  function update() {
    // only-height: hide as soon as user scrolls even 1px
    if (onlyHeight) {
      onlyHeight.classList.toggle("only-height--hidden", window.scrollY > 0);
    }

    // top-bar: hide when flash-sale top reaches bottom of full header
    if (flashSale) {
      const headerBottom = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
      const flashTop = flashSale.getBoundingClientRect().top;
      topBar.classList.toggle("top-bar--hidden", flashTop <= headerBottom);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Side navigator: scroll-to and active state
function initSideNav() {
  const sideNav = document.getElementById("side-nav");
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

  window.addEventListener("scroll", () => {
    const flashTop = flashSale.getBoundingClientRect().top;
    // flashTop < window.innerHeight means flash-sale has entered the viewport from bottom
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

// Product
// ── 1. Thumbnail hover preview + click lock ──────────────────
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

// ── 2. Glass magnifier zoom ───────────────────────────────────
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
  // Expose so initThumbs can call it on hover/click
  window.updateZoomBg = updateZoomBg;

  wrap.addEventListener("mouseenter", () => {
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

    // Compute zoomed background
    const bgW = rect.width * ZOOM;
    const bgH = rect.height * ZOOM;
    const bgX = ((x - lensW / 2) / rect.width) * bgW;
    const bgY = ((y - lensH / 2) / rect.height) * bgH;

    result.style.backgroundSize = `${bgW}px ${bgH}px`;
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });
}

// ── 3. Quantity +/- ──────────────────────────────────────────
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

// ── 4. Color selector ────────────────────────────────────────
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

// ── 5. Flash sale countdown ──────────────────────────────────
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

// ── 6. View More — expand product description ─────────────────
function initViewMore() {
  const btn = document.getElementById("pd-view-more-btn");
  const content = document.getElementById("pd-desc-content");
  const fade = document.getElementById("pd-desc-fade");
  const wrap = document.getElementById("pd-view-more-wrap");
  if (!btn || !content || !fade || !wrap) return;

  btn.addEventListener("click", () => {
    content.classList.add("pd-desc-expanded");
    fade.classList.add("pd-desc-fade-hidden");
    wrap.classList.add("pd-hidden");
  });
}
