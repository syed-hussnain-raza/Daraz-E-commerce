// ============================================================
//  utils.js — shared across main and product pages
// ============================================================

/**
 * initStickyHeader
 * Handles top-bar hide/show on scroll, and the homepage-only-height div.
 * Works for both the index page (flash-sale trigger) and the product page
 * (scroll offset trigger).
 */
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
