// header.js: renders header dynamically + handles login modal

document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/header.json")
    .then((res) => res.json())
    .then((data) => {
      renderHeader(data);
      initLoginModal();
      initStickyHeader();
    })
    .catch((err) => console.error("Failed to load header.json:", err));
});

// Render Header
function renderHeader(data) {
  const header = document.querySelector("header");
  if (!header) return;

  // Detect if we are on product page
  const isProductPage = document.body.classList.contains("page-product");

  // Build search tags HTML (product page only)
  const searchTagsHTML =
    isProductPage && data.searchTags
      ? `<div class="search-tags">
        ${data.searchTags
          .map(
            (t, i) =>
              (i > 0 ? '<span class="divider">|</span>' : "") +
              `<a href="${t.href}">${t.label}</a>`,
          )
          .join("")}
      </div>`
      : "";

  // Build search wrapper: product page wraps bar+tags and main page just has bar
  const searchHTML = isProductPage
    ? `<div class="search-wrapper">
        <div class="search-bar">
          <input type="text" placeholder="${data.search.placeholder}" />
          <button class="search-btn" aria-label="Search">
            <img src="${data.search.iconSrc}" alt="Search icon" />
          </button>
        </div>
        ${searchTagsHTML}
      </div>`
    : `<div class="search-bar">
        <input type="text" placeholder="${data.search.placeholder}" />
        <button class="search-btn" aria-label="Search">
          <img src="${data.search.iconSrc}" alt="Search icon" />
        </button>
      </div>`;

  // Build top-bar links
  const topBarLinks = data.topBar
    .map(
      (link) =>
        `<a href="${link.href}" ${link.action ? `data-action="${link.action}"` : ""}>${link.label}</a>`,
    )
    .join("");

  // Build sub-nav (product page only)
  const subNavHTML = isProductPage
    ? `<div class="sub-nav">
        <div class="sub-nav-inner">
          <button class="categories-btn">
            Categories <i class="bi bi-chevron-down"></i>
          </button>
        </div>
      </div>`
    : `<div class="homepage-only-height"></div>`;

  header.innerHTML = `
    <!-- Top bar -->
    <nav class="top-bar">
      <div class="top-bar-inner">
        ${topBarLinks}
      </div>
    </nav>

    <!-- Main header: logo, search, cart -->
    <div class="main-header">
      <div class="main-header-inner">
        <a href="${data.logo.href}" class="logo-link">
          <img src="${data.logo.src}" alt="${data.logo.alt}" class="logo-img" />
        </a>
        ${searchHTML}
        <a href="${data.cart.href}" class="cart-link" title="Cart">
          <i class="${data.cart.icon}"></i>
        </a>
      </div>
    </div>
    ${subNavHTML}

    <!-- Login Modal -->
    <div class="login-overlay" id="login-overlay">
      <div class="login-modal" id="login-modal">
        <div class="login-tabs">
          <button class="login-tab login-tab--active" data-tab="password">Password</button>
          <div class="login-tab-divider"></div>
          <button class="login-tab" data-tab="phone">Phone Number</button>
          <button class="login-close" id="login-close" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Password panel -->
        <div class="login-panel" id="panel-password">
          <input class="login-input" type="text" placeholder="Please enter your Phone or Email" id="login-email" />
          <div class="login-input-wrap">
            <input class="login-input" type="password" placeholder="Please enter your password" id="login-pass" />
            <button class="login-eye" id="login-eye" aria-label="Toggle password">
              <i class="bi bi-eye-slash"></i>
            </button>
          </div>
          <a href="#" class="login-forgot">Forgot password?</a>
          <button class="login-btn">LOGIN</button>
          <p class="login-signup-row">
            Don't have an account? <a href="#" class="login-signup-link">Sign up</a>
          </p>
          <div class="login-or">Or, login with</div>
          <div class="login-social-row">
            <button class="login-social-btn">
              <img src="https://www.google.com/favicon.ico" alt="G" width="18" /> Google
            </button>
            <button class="login-social-btn">
              <i class="bi bi-facebook" style="color:#1877f2;font-size:18px"></i> Facebook
            </button>
          </div>
        </div>

        <!-- Phone panel -->
        <div class="login-panel login-panel--hidden" id="panel-phone">
          <div class="login-phone-wrap">
            <div class="login-phone-prefix"><span><small>PK</small>+92</span></div>
            <input class="login-input login-input--phone" type="tel" placeholder="Please enter your phone number" />
          </div>
          <button class="login-btn login-btn--whatsapp">
            <i class="bi bi-whatsapp"></i> Send code via Whatsapp
          </button>
          <p class="login-signup-row">
            Don't have an account? <a href="#" class="login-signup-link">Sign up</a>
          </p>
          <div class="login-or">Or, login with</div>
          <div class="login-social-row">
            <button class="login-social-btn">
              <img src="https://www.google.com/favicon.ico" alt="G" width="18" /> Google
            </button>
            <button class="login-social-btn">
              <i class="bi bi-facebook" style="color:#1877f2;font-size:18px"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Login Modal
function initLoginModal() {
  document.addEventListener("click", (e) => {
    // Open on Login / Sign Up
    const link = e.target.closest("[data-action='login']");
    if (link) {
      e.preventDefault();
      openModal();
      return;
    }

    // Close on X button
    if (e.target.closest("#login-close")) {
      closeModal();
      return;
    }

    // Close on backdrop
    const overlay = document.getElementById("login-overlay");
    if (overlay && e.target === overlay) {
      closeModal();
      return;
    }

    // Tab switching
    const tab = e.target.closest(".login-tab");
    if (tab && tab.dataset.tab) {
      document
        .querySelectorAll(".login-tab")
        .forEach((t) => t.classList.remove("login-tab--active"));
      tab.classList.add("login-tab--active");
      document
        .querySelectorAll(".login-panel")
        .forEach((p) => p.classList.add("login-panel--hidden"));
      const panel = document.getElementById("panel-" + tab.dataset.tab);
      if (panel) panel.classList.remove("login-panel--hidden");
      return;
    }

    // Password eye toggle
    if (e.target.closest("#login-eye")) {
      const passInput = document.getElementById("login-pass");
      const eyeBtn = document.getElementById("login-eye");
      if (passInput && eyeBtn) {
        const isHidden = passInput.type === "password";
        passInput.type = isHidden ? "text" : "password";
        eyeBtn.innerHTML = isHidden
          ? '<i class="bi bi-eye"></i>'
          : '<i class="bi bi-eye-slash"></i>';
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal() {
  const overlay = document.getElementById("login-overlay");
  if (overlay) {
    overlay.classList.add("login-overlay--open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const overlay = document.getElementById("login-overlay");
  if (overlay) {
    overlay.classList.remove("login-overlay--open");
    document.body.style.overflow = "";
  }
}
