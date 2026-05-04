// pages/main.js

const JFY_PAGE_SIZE = 18;
let jfyAllProducts = [];
let jfyPage = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchMainData();
  const TIMEOUT = 800;

  renderCarousel(data.carousel);
  renderFlashSale(data.flashSale);
  renderCategories(data.categories);

  jfyAllProducts = [...data.justForYou, ...data.justForYou, ...data.justForYou];
  jfyPage = 0;
  renderJustForYou(false);
  initCarousel();

  const headerData = await fetchHeaderData();
  renderHeader(headerData, { isProductPage: false });
  initLoginModal();
  initStickyHeader();
  initMobileDrawer();

  const footerData = await fetchFooterData();
  renderFooter(footerData);
  initSideNav();

  document.querySelector(".jfy-load-btn")?.addEventListener("click", () => {
    const btn = document.querySelector(".jfy-load-btn");
    const loader = document.querySelector(".jfy-loader");
    btn.style.display = "none";
    loader.style.display = "block";
    setTimeout(() => {
      renderJustForYou(true);
      loader.style.display = "none";
      btn.style.display = "block";
    }, TIMEOUT);
  });
});

function productURL(id) {
  return `../views/product.html?id=${id}`;
}

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

function renderJustForYou(append) {
  const container = document.getElementById("jfy-cards");
  if (!container) return;

  if (jfyPage * JFY_PAGE_SIZE >= jfyAllProducts.length) jfyPage = 0;

  const start = jfyPage * JFY_PAGE_SIZE;
  const slice = jfyAllProducts.slice(start, start + JFY_PAGE_SIZE);

  const html = slice
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

  if (append) {
    const prevCount = container.children.length;
    container.insertAdjacentHTML("beforeend", html);
    const firstNew = container.children[prevCount];
    if (firstNew)
      firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    container.innerHTML = html;
  }

  jfyPage++;
}
