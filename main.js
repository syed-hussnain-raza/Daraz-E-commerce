// Wait for the DOM Tree Creation Completition
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initStickyHeader();
  initSideNav();
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
  const flashSale = document.querySelector(".flash-sale");

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Hide top-bar only when flash-sale has scrolled fully above the viewport top
      topBar.classList.toggle(
        "top-bar--hidden",
        entry.boundingClientRect.top < 0,
      );
    },
    { threshold: 0 },
  );

  if (flashSale) observer.observe(flashSale);
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
