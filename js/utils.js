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
