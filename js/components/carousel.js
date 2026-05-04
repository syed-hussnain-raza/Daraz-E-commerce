// components/carousel.js

let currentIndex = 0;
let totalSlides = 0;
let autoTimer = null;
const AUTOPLAYTIME = 5000; // 5 seconds

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
  }, AUTOPLAYTIME);
}

function resetAutoPlay() {
  clearInterval(autoTimer);
  startAutoPlay();
}
