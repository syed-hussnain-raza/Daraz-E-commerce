// utils.js: shared across main and product pages

// initStickyHeader
function initStickyHeader() {
  const topBar = document.querySelector(".top-bar");
  const onlyHeight = document.querySelector(".homepage-only-height");
  const flashSale = document.querySelector(".flash-sale");
  const productMain = document.querySelector(".product-main");

  function update() {
    if (onlyHeight) {
      onlyHeight.classList.toggle("only-height--hidden", window.scrollY > 0);
    }

    if (flashSale) {
      const headerBottom = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
      const flashTop = flashSale.getBoundingClientRect().top;
      topBar.classList.toggle("top-bar--hidden", flashTop <= headerBottom);
    } else if (productMain && topBar) {
      topBar.classList.toggle("top-bar--hidden", window.scrollY > 60);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function starsHTML(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += `<i class="bi bi-star-fill"></i>`;
    } else if (rating >= i - 0.5) {
      html += `<i class="bi bi-star-half"></i>`;
    } else {
      html += `<i class="bi bi-star"></i>`;
    }
  }
  return html;
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}
