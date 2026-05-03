// pages/product.js

document.addEventListener("DOMContentLoaded", async () => {
  const headerData = await fetchHeaderData();
  renderHeader(headerData, { isProductPage: true });
  initLoginModal();
  initStickyHeader();
  initMobileDrawer();
  initCategoriesDropdown(headerData.categories);

  const footerData = await fetchFooterData();
  renderFooter(footerData);

  const id = getQueryParam("id") || "dustproof";
  const product = await fetchProductData(id);
  if (product) populatePage(product);
});

function populatePage(p) {
  document.title = `${p.fullTitle} - Daraz.pk`;

  const breadcrumbNav = document.querySelector(".breadcrumb-nav");
  if (breadcrumbNav) {
    const crumbs = p.breadcrumb
      .map((b) => `<a href="#">${b}</a><i class="bi bi-chevron-right"></i>`)
      .join("");
    breadcrumbNav.innerHTML = `${crumbs}<span>${p.fullTitle}</span>`;
  }

  const mainImg = document.getElementById("pd-main-img");
  if (mainImg) {
    mainImg.src = p.img;
    mainImg.alt = p.alt;
  }

  const thumbsContainer = document.getElementById("pd-thumbs");
  if (thumbsContainer && p.thumbs) {
    thumbsContainer.innerHTML = p.thumbs
      .map(
        (src, i) => `
        <button class="pd-thumb ${i === 0 ? "active" : ""}" data-src="${src}">
          <img src="${src}" alt="thumb ${i + 1}" />
        </button>`,
      )
      .join("");
  }

  const title = document.querySelector(".pd-title");
  if (title) title.textContent = p.fullTitle;

  renderStarRating(p.stars, p.ratingCount, p.answeredQuestions);

  const brandEl = document.querySelector(".pd-brand");
  if (brandEl) {
    brandEl.innerHTML = `Brand: <a href="#" class="pd-brand-link">${p.brand}</a>
      <span class="pd-dot">|</span>
      <a href="#" class="pd-brand-link">More ${p.brandCategory} from ${p.brand}</a>`;
  }

  const priceEl = document.querySelector(".pd-price");
  const originalEl = document.querySelector(".pd-original");
  const discountEl = document.querySelector(".pd-discount-badge");
  if (priceEl) priceEl.textContent = p.price;
  if (originalEl) originalEl.textContent = p.original;
  if (discountEl) discountEl.textContent = p.discount;

  renderColors(p.colors);
  renderDelivery(p.delivery);
  renderWarranty(p.warranty);
  renderSeller(p.seller);
  renderDetails(p);
  renderReviews(p);
  renderQuestions(p);
  renderAlsoLike(p.alsoLike);

  initThumbs();
  initZoom();
  initQty();
  initColorSelect();
  initFlashTimer();
  initViewMore();
}

function renderStarRating(stars, ratingCount, answeredQuestions) {
  const ratingRow = document.querySelector(".pd-rating-row");
  if (!ratingRow) return;
  ratingRow.innerHTML = `
    <div class="pd-stars">${starsHTML(stars)}</div>
    <a href="#reviews" class="pd-rating-link">Ratings ${ratingCount}</a>
    <span class="pd-dot">|</span>
    <a href="#questions" class="pd-rating-link">${answeredQuestions} Answered Questions</a>
    <div class="pd-actions-row">
      <button class="pd-action-btn" title="Share"><i class="bi bi-share-fill"></i></button>
      <button class="pd-action-btn" title="Wishlist"><i class="bi bi-heart"></i></button>
    </div>
  `;
}

function renderColors(colors) {
  let colorRow = document.querySelector(".pd-color-row");
  if (!colors || colors.length === 0) {
    if (colorRow) colorRow.style.display = "none";
    return;
  }
  if (!colorRow) {
    colorRow = document.createElement("div");
    colorRow.className = "pd-option-row pd-color-row";
    const qtyRow = document.querySelector(".pd-option-row");
    if (qtyRow) qtyRow.parentNode.insertBefore(colorRow, qtyRow);
    else document.querySelector(".pd-info")?.appendChild(colorRow);
  }
  colorRow.style.display = "";
  colorRow.innerHTML = `
    <span class="pd-option-label">Color</span>
    <div class="pd-colors">
      ${colors
        .map(
          (c, i) =>
            `<button class="pd-color-btn${i === 0 ? " active" : ""}" data-color="${c}">${c}</button>`,
        )
        .join("")}
    </div>
  `;
}

function renderDetails(p) {
  const bulletsList = document.querySelector(".pd-details-list");
  if (bulletsList && p.bullets) {
    bulletsList.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");
  }

  const descContent = document.getElementById("pd-desc-content");
  if (descContent) {
    const specsGrid = Object.entries(p.specs)
      .map(
        ([key, val]) => `
        <div class="pd-spec-row">
          <span class="pd-spec-key">${key}</span>
          <span class="pd-spec-val">${val}</span>
        </div>`,
      )
      .join("");

    descContent.innerHTML = `
      <p>${p.description}</p>
      <div class="pd-desc-img-wrap">
        <img src="${p.img}" alt="${p.alt}" class="pd-desc-img" />
        <img src="${p.thumbs[1] || p.img}" alt="${p.alt}" class="pd-desc-img" />
      </div>
      <div class="pd-specs-card" id="specs">
        <h2 class="pd-section-title">Specifications of</h2>
        <div class="pd-specs-grid">${specsGrid}</div>
        <div class="pd-box-row my-4">
          <span class="pd-spec-key">What's in the box</span>
          <div class="pd-box-val">${p.inBox}</div>
        </div>
      </div>
    `;
  }
}

function renderQuestions(p) {
  const questionsTitle = document.querySelector("#questions .pd-section-title");
  if (questionsTitle)
    questionsTitle.textContent = `Questions about this product (${p.answeredQuestions})`;

  const qaSub = document.querySelector(".pd-qa-sub");
  if (qaSub)
    qaSub.textContent = `Other questions answered by ${p.seller.name} (${p.answeredQuestions})`;
}

function renderAlsoLike(alsoLike) {
  const grid = document.querySelector(".pd-also-grid");
  if (!grid || !alsoLike) return;
  grid.innerHTML = alsoLike
    .map(
      (item) => `
      <a href="#" class="pd-also-card">
        <img src="${item.img}" alt="${item.name}" />
        <div class="yml-card-body">
          <p class="pd-also-name">${item.name}</p>
          <p class="pd-also-price">${item.price}</p>
          <div class="pd-also-stars">${starsHTML(item.stars)}</div>
        </div>
      </a>`,
    )
    .join("");
}

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

function initColorSelect() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pd-color-btn");
    if (!btn) return;
    document
      .querySelectorAll(".pd-color-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
}

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

function initViewMore() {
  const btn = document.getElementById("pd-view-more-btn");
  const content = document.getElementById("pd-desc-content");
  const fade = document.getElementById("pd-desc-fade");
  if (!btn || !content || !fade) return;
  let expanded = false;
  btn.addEventListener("click", () => {
    expanded = !expanded;
    if (expanded) {
      content.classList.add("pd-desc-expanded");
      fade.classList.add("pd-desc-fade-hidden");
      btn.textContent = "VIEW LESS";
    } else {
      content.classList.remove("pd-desc-expanded");
      fade.classList.remove("pd-desc-fade-hidden");
      btn.textContent = "VIEW MORE";
      const wrap = document.getElementById("pd-desc-wrap");
      if (wrap) wrap.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
