// product.js

document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
});

// Dynamic Product Loading
function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "dustproof";

  console.log(`[product.js] Loading product id: "${productId}"`);

  fetch("../data/products.json")
    .then((res) => {
      if (!res.ok)
        throw new Error(
          `HTTP ${res.status} — products.json not found. Make sure data/products.json exists in your project.`,
        );
      return res.json();
    })
    .then((data) => {
      const product = data.products.find((p) => p.id === productId);
      if (!product) {
        console.warn(
          `[product.js] Product "${productId}" not found. Falling back to dustproof.`,
        );
        const fallback = data.products.find((p) => p.id === "dustproof");
        if (fallback) populatePage(fallback);
        return;
      }
      console.log(`[product.js] Found product: "${product.name}"`);
      populatePage(product);
    })
    .catch((err) => {
      console.error("[product.js] Failed to load products.json:", err.message);
    });
}

// Populate the Entire Product Page

function populatePage(p) {
  // Page title
  document.title = `${p.fullTitle} - Daraz.pk`;

  // Breadcrumb
  const breadcrumbNav = document.querySelector(".breadcrumb-nav");
  if (breadcrumbNav) {
    const crumbs = p.breadcrumb
      .map((b) => `<a href="#">${b}</a><i class="bi bi-chevron-right"></i>`)
      .join("");
    breadcrumbNav.innerHTML = `${crumbs}<span>${p.fullTitle}</span>`;
  }

  // Main image
  const mainImg = document.getElementById("pd-main-img");
  if (mainImg) {
    mainImg.src = p.img;
    mainImg.alt = p.alt;
  }

  // Thumbnails
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

  // Product title
  const title = document.querySelector(".pd-title");
  if (title) title.textContent = p.fullTitle;

  // Rating row
  renderStarRating(p.stars, p.ratingCount, p.answeredQuestions);

  // Brand
  const brandEl = document.querySelector(".pd-brand");
  if (brandEl) {
    brandEl.innerHTML = `Brand: <a href="#" class="pd-brand-link">${p.brand}</a>
      <span class="pd-dot">|</span>
      <a href="#" class="pd-brand-link">More ${p.brandCategory} from ${p.brand}</a>`;
  }

  // Price block
  const priceEl = document.querySelector(".pd-price");
  const originalEl = document.querySelector(".pd-original");
  const discountEl = document.querySelector(".pd-discount-badge");
  if (priceEl) priceEl.textContent = p.price;
  if (originalEl) originalEl.textContent = p.original;
  if (discountEl) discountEl.textContent = p.discount;

  // Render: Colors
  renderColors(p.colors);

  // Render: Delivery card
  renderDelivery(p.delivery);

  // Render: Return & Warranty
  renderWarranty(p.warranty);

  // Render: Seller
  renderSeller(p.seller);

  // Render: Product details
  renderDetails(p);

  // Render: Ratings & Reviews
  renderReviews(p);

  // Render: Questions
  renderQuestions(p);

  // Render: You May Also Like
  renderAlsoLike(p.alsoLike);

  // Init all interactions after DOM is populated
  initThumbs();
  initZoom();
  initQty();
  initColorSelect();
  initFlashTimer();
  initViewMore();
}

// Star Rating Helper

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

// Colors
function renderColors(colors) {
  let colorRow = document.querySelector(".pd-color-row");

  if (!colors || colors.length === 0) {
    if (colorRow) colorRow.style.display = "none";
    return;
  }

  if (!colorRow) {
    // Create it before the qty row
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

// Delivery
function renderDelivery(delivery) {
  if (!delivery) return;
  const card = document.getElementById("pd-card-delivery");
  if (!card) return;

  const codRow = delivery.cod
    ? `<div class="pd-delivery-row">
        <div class="pd-delivery-left d-flex align-items-baseline">
          <i class="bi bi-cash-stack"></i>
          <div><p class="pd-delivery-name">Cash on Delivery Available</p></div>
        </div>
      </div>`
    : "";

  card.innerHTML = `
    <div class="pd-card-header">Delivery Options <i class="bi bi-info-circle"></i></div>
    <div class="pd-delivery-location">
      <i class="bi bi-geo-alt"></i>
      <span>Sindh, Karachi - Gulshan-e-Iqbal, Block 15</span>
      <a href="#" class="pd-change-link">CHANGE</a>
    </div>
    <div class="pd-delivery-row">
      <div class="pd-delivery-left">
        <i class="bi bi-box-seam"></i>
        <div>
          <p class="pd-delivery-name">Standard Delivery</p>
          <p class="pd-delivery-sub">Guaranteed by ${delivery.eta}</p>
        </div>
      </div>
      <span class="pd-delivery-price">${delivery.standard}</span>
    </div>
    <div class="pd-delivery-row">
      <div class="pd-delivery-left">
        <i class="bi bi-truck"></i>
        <div>
          <p class="pd-delivery-name">Standard Collection Point</p>
          <p class="pd-delivery-sub">Guaranteed by ${delivery.eta}</p>
        </div>
      </div>
      <span class="pd-delivery-price">${delivery.collection}</span>
    </div>
    ${codRow}
  `;
}

// Return & Warranty
function renderWarranty(warranty) {
  if (!warranty) return;
  const warrantyCard = document.getElementById("pd-card-warranty");
  if (!warrantyCard) return;

  const changeMindRow = warranty.changeMind
    ? `<div class="pd-return-row"><i class="bi bi-arrow-counterclockwise"></i><span>Change of Mind</span></div>`
    : "";

  warrantyCard.innerHTML = `
    <div class="pd-card-header">Return & Warranty <i class="bi bi-info-circle"></i></div>
    ${changeMindRow}
    <div class="pd-return-row">
      <i class="bi bi-clock-history"></i>
      <span>${warranty.returnDays} days easy return</span>
    </div>
    <div class="pd-return-row">
      <i class="bi bi-${warranty.warranty !== "Not available" ? "shield-check" : "shield-slash"}"></i>
      <span>${warranty.warranty}</span>
    </div>
  `;
}

// Seller
function renderSeller(seller) {
  if (!seller) return;
  const sellerCard = document.getElementById("pd-card-seller");
  if (!sellerCard) return;

  sellerCard.innerHTML = `
    <p class="pd-sold-by">Sold by</p>
    <div class="pd-seller-row">
      <p class="pd-seller-name">${seller.name}</p>
      <a href="#" class="pd-chat-btn"><i class="bi bi-chat-left-fill"></i> Chat Now</a>
    </div>
    <div class="pd-seller-stats">
      <div class="pd-stat" style="border-right:1px solid #f0f0f0">
        <p class="pd-stat-label">Positive Seller Ratings</p>
        <p class="pd-stat-val">${seller.positiveRating}</p>
      </div>
      <div class="pd-stat" style="border-right:1px solid #f0f0f0">
        <p class="pd-stat-label">Ship on Time</p>
        <p class="pd-stat-val">${seller.shipOnTime}</p>
      </div>
      <div class="pd-stat">
        <p class="pd-stat-label">Chat Response Rate</p>
        <p class="pd-stat-val ${seller.chatResponse === "Not enough data" ? "pd-stat-na" : ""}">${seller.chatResponse}</p>
      </div>
    </div>
    <a href="#" class="pd-store-link">GO TO STORE</a>
  `;
}

// Product Details
function renderDetails(p) {
  // Bullets
  const bulletsList = document.querySelector(".pd-details-list");
  if (bulletsList && p.bullets) {
    bulletsList.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");
  }

  // Description
  const descContent = document.getElementById("pd-desc-content");
  if (descContent) {
    // Build specs grid
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

  // Section title "Product details of"
  const detailTitle = document.querySelector(".pd-section-title.px-24.m-0");
  if (detailTitle) detailTitle.textContent = `Product details of`;
}

// Reviews
function renderReviews(p) {
  // Review section heading
  const reviewTitle = document.querySelector("#reviews .pd-section-title");
  if (reviewTitle) {
    reviewTitle.textContent = `Ratings & Reviews of ${p.fullTitle}`;
  }

  // Overview: rating number + stars + count
  const ratingNum = document.querySelector(".pd-rating-num");
  if (ratingNum) {
    ratingNum.innerHTML = `${p.stars} <span class="pd-rating-denom">/5</span>`;
  }
  const starsBig = document.querySelector(".pd-stars-big");
  if (starsBig) starsBig.innerHTML = starsHTML(p.stars);

  const ratingCount = document.querySelector(".pd-rating-count");
  if (ratingCount) ratingCount.textContent = `${p.ratingCount} Ratings`;

  // Review cards
  const reviewList = document.querySelector(".pd-review-list");
  if (reviewList && p.reviews) {
    reviewList.innerHTML = p.reviews
      .map(
        (r) => `
        <div class="pd-review">
          <div class="pd-review-header">
            <div class="pd-review-stars">${starsHTML(r.stars)}</div>
            <span class="pd-review-date">${r.date}</span>
          </div>
          <div class="pd-review-user">
            <span class="pd-reviewer">${r.user}</span>
            ${r.verified ? `<span class="pd-verified"><i class="bi bi-patch-check-fill"></i> Verified Purchase</span>` : ""}
          </div>
          <p class="pd-review-text">${r.text}</p>
          <div class="pd-review-images">
            <img src="${p.img}" alt="review img" />
          </div>
          <div class="pd-review-footer">
            <button class="pd-like-btn">
              <i class="bi bi-hand-thumbs-up-fill"></i> ${r.likes}
            </button>
          </div>
        </div>`,
      )
      .join("");
  }
}

// Questions
function renderQuestions(p) {
  const questionsTitle = document.querySelector("#questions .pd-section-title");
  if (questionsTitle) {
    questionsTitle.textContent = `Questions about this product (${p.answeredQuestions})`;
  }

  const qaSub = document.querySelector(".pd-qa-sub");
  if (qaSub) {
    qaSub.textContent = `Other questions answered by ${p.seller.name} (${p.answeredQuestions})`;
  }
}

// You May Also Like
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

// Image Thumbnails
function initThumbs() {
  const thumbs = document.querySelectorAll(".pd-thumb");
  const mainImg = document.getElementById("pd-main-img");
  if (!thumbs.length || !mainImg) return;

  let lockedSrc = mainImg.src;

  thumbs.forEach((thumb) => {
    const src = thumb.dataset.src;

    thumb.addEventListener("mouseenter", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(src);
      }, 120);
    });

    thumb.addEventListener("mouseleave", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = lockedSrc;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(lockedSrc);
      }, 120);
    });

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

  const strip = document.getElementById("pd-thumbs");

  document.getElementById("pd-thumb-prev")?.addEventListener("click", () => {
    const thumbs = document.querySelectorAll(".pd-thumb");
    const active = document.querySelector(".pd-thumb.active");
    const idx = [...thumbs].indexOf(active);
    const prev = idx > 0 ? idx - 1 : thumbs.length - 1;
    thumbs[prev].click();
    strip.scrollBy({ left: -80, behavior: "smooth" });
  });

  document.getElementById("pd-thumb-next")?.addEventListener("click", () => {
    const thumbs = document.querySelectorAll(".pd-thumb");
    const active = document.querySelector(".pd-thumb.active");
    const idx = [...thumbs].indexOf(active);
    const next = idx < thumbs.length - 1 ? idx + 1 : 0;
    thumbs[next].click();
    strip.scrollBy({ left: 80, behavior: "smooth" });
  });
}

// Glass Magnifier Zoom
function initZoom() {
  const wrap = document.getElementById("pd-zoom-wrap");
  const lens = document.getElementById("pd-zoom-lens");
  const result = document.getElementById("pd-zoom-result");
  const mainImg = document.getElementById("pd-main-img");
  if (!wrap || !lens || !result || !mainImg) return;

  const ZOOM = 3;
  let resultW = 0,
    resultH = 0,
    lensW = 0,
    lensH = 0;

  function updateZoomBg(src) {
    result.style.backgroundImage = `url('${src}')`;
  }
  window.updateZoomBg = updateZoomBg;

  function sizeResultPanel() {
    const layout = document.querySelector(".pd-layout");
    const gallery = document.querySelector(".pd-gallery");
    if (!layout || !gallery) return;

    const layoutRect = layout.getBoundingClientRect();
    const galleryRect = gallery.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    const panelW = Math.max(layoutRect.right - galleryRect.right - 20, 200);
    const panelH = Math.max(wrapRect.width * 1.5, 300);

    result.style.width = panelW + "px";
    result.style.height = panelH + "px";
    result.style.left = galleryRect.width + 20 + "px";
    result.style.top = wrapRect.top - layoutRect.top + "px";

    resultW = panelW;
    resultH = panelH;
    lensW = lens.offsetWidth;
    lensH = lens.offsetHeight;
  }

  wrap.addEventListener("mouseenter", () => {
    sizeResultPanel();
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

    x = Math.max(lensW / 2, Math.min(x, rect.width - lensW / 2));
    y = Math.max(lensH / 2, Math.min(y, rect.height - lensH / 2));

    lens.style.left = x - lensW / 2 + "px";
    lens.style.top = y - lensH / 2 + "px";

    const bgW = rect.width * ZOOM;
    const bgH = (rect.height - 8) * ZOOM;
    const imgX = (x / rect.width) * bgW;
    const imgY = (y / (rect.height - 8)) * bgH;
    const bgX = Math.min(Math.max(imgX - resultW / 2, 0), bgW - resultW);
    const bgY = Math.min(Math.max(imgY - resultH / 2, 0), bgH - resultH);

    result.style.backgroundSize = `${bgW}px ${bgH}px`;
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });
}

// Quantity +/-
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

// Color Selector
function initColorSelect() {
  // Use event delegation since color buttons are dynamically injected
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pd-color-btn");
    if (!btn) return;
    document
      .querySelectorAll(".pd-color-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
}

// Flash Sale Countdown
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

// View More / Less Toggle
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
