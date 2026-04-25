//  main.js

document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/main.json")
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

  const slides = track.querySelectorAll(".carousel-slide");
  totalSlides = slides.length;

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

  dots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      resetAutoPlay();
    });
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    goTo((currentIndex - 1 + totalSlides) % totalSlides);
    resetAutoPlay();
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    goTo((currentIndex + 1) % totalSlides);
    resetAutoPlay();
  });

  goTo(0);
  startAutoPlay();
}

function goTo(index) {
  currentIndex = index;
  const track = document.getElementById("carousel-track");
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("dot--active", i === currentIndex);
  });
}

function startAutoPlay() {
  autoTimer = setInterval(() => {
    goTo((currentIndex + 1) % totalSlides);
  }, 5000);
}

function resetAutoPlay() {
  clearInterval(autoTimer);
  startAutoPlay();
}

// Side navigator
function initSideNav() {
  const sideNav = document.getElementById("side-nav");
  if (!sideNav) return;

  const navTop = document.getElementById("nav-top");
  const navItems = document.querySelectorAll(".side-nav-item[data-section]");
  const sections = ["flash-sale", "categories", "just-for-you"];

  navTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.querySelector("." + btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
  });

  const flashSale = document.querySelector(".flash-sale");
  if (!flashSale) return;

  window.addEventListener("scroll", () => {
    const flashTop = flashSale.getBoundingClientRect().top;
    sideNav.classList.toggle(
      "side-nav--visible",
      flashTop < window.innerHeight,
    );
  });

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

// Login Modal
function initLoginModal() {
  const overlay = document.getElementById("login-overlay");
  const closeBtn = document.getElementById("login-close");
  const tabs = document.querySelectorAll(".login-tab");
  const eyeBtn = document.getElementById("login-eye");
  const passInput = document.getElementById("login-pass");

  // Helper functions
  function openModal() {
    overlay.classList.add("login-overlay--open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("login-overlay--open");
    document.body.style.overflow = "";
  }

  // Open on LOGIN or SIGN UP clicks in the top bar
  document.querySelectorAll(".top-bar-inner a").forEach((link) => {
    const text = link.textContent.trim().toUpperCase();
    if (text === "LOGIN" || text === "SIGN UP") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Close on X button
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // Close on overlay backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("login-tab--active"));
      tab.classList.add("login-tab--active");
      document
        .querySelectorAll(".login-panel")
        .forEach((p) => p.classList.add("login-panel--hidden"));
      document
        .getElementById("panel-" + tab.dataset.tab)
        .classList.remove("login-panel--hidden");
    });
  });

  // Password eye toggle
  if (eyeBtn && passInput) {
    eyeBtn.addEventListener("click", () => {
      const isHidden = passInput.type === "password";
      passInput.type = isHidden ? "text" : "password";
      eyeBtn.innerHTML = isHidden
        ? '<i class="bi bi-eye"></i>'
        : '<i class="bi bi-eye-slash"></i>';
    });
  }
}

document.addEventListener("DOMContentLoaded", initLoginModal);
