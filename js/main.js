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
    .catch((err) => console.error("Failed to load main.json:", err))
    .finally(() => {
      initCarousel();
    });
});

// Build the product page URL for a given product id.
function productURL(id) {
  return `../views/product.html?id=${id}`;
}

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
        <a href="${productURL(p.id)}" class="product-card">
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
        <a href="${productURL(p.id)}" class="jfy-card">
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

  dots.innerHTML = Array.from(slides)
    .map(
      (_, i) =>
        `<button class="dot${i === 0 ? " dot--active" : ""}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`,
    )
    .join("");

  dots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      resetAutoPlay();
    });
  });

  document.getElementById("btn-prev")?.addEventListener("click", () => {
    goTo((currentIndex - 1 + totalSlides) % totalSlides);
    resetAutoPlay();
  });

  document.getElementById("btn-next")?.addEventListener("click", () => {
    goTo((currentIndex + 1) % totalSlides);
    resetAutoPlay();
  });

  goTo(0);
  startAutoPlay();
}

function goTo(index) {
  currentIndex = index;
  const track = document.getElementById("carousel-track");
  if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
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
