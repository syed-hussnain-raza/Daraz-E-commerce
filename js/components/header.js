// components/header.js

function renderHeader(data, config = {}) {
  const header = document.querySelector("header");
  if (!header) return;

  const isProductPage = config.isProductPage || false;

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

  const topBarLinks = data.topBar
    .map(
      (link) =>
        `<a href="${link.href}" ${link.action ? `data-action="${link.action}"` : ""}>${link.label}</a>`,
    )
    .join("");

  const subNavHTML = isProductPage
    ? `<div class="sub-nav">
        <div class="sub-nav-inner">
          <button class="categories-btn" id="categories-btn">
            Categories
            <i class="bi bi-chevron-down cat-chevron" id="cat-chevron"></i>
          </button>
        </div>
        <div class="cat-dropdown" id="cat-dropdown"></div>
      </div>`
    : `<div class="homepage-only-height"></div>`;

  const drawerTopBarItems = data.topBar
    .map((link) => {
      const icon = resolveDrawerIcon(link.label);
      return `<a href="${link.href}" ${link.action ? `data-action="${link.action}"` : ""}>
        <i class="bi ${icon}"></i>${link.label}
      </a>`;
    })
    .join("");

  const drawerCategoriesSection =
    isProductPage && data.categories
      ? `<div class="drawer-section-title">Categories</div>
       ${data.categories
         .map((cat) => `<a href="#"><i class="bi bi-tag"></i>${cat.label}</a>`)
         .join("")}`
      : "";

  const mobileDrawerHTML = `
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="mobile-drawer-overlay" id="drawer-overlay"></div>
      <div class="mobile-drawer-panel">
        <div class="drawer-header">
          <img src="${data.logo.src}" alt="${data.logo.alt}" class="drawer-logo" />
          <button class="drawer-close" id="drawer-close" aria-label="Close menu">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <nav class="drawer-nav">
          ${drawerCategoriesSection}
          <div class="drawer-section-title">Account</div>
          ${drawerTopBarItems}
        </nav>
      </div>
    </div>`;

  header.innerHTML = `
    <nav class="top-bar">
      <div class="top-bar-inner">${topBarLinks}</div>
    </nav>
    <div class="main-header">
      <div class="main-header-inner">
        <a href="${data.logo.href}" class="logo-link">
          <img src="${data.logo.src}" alt="${data.logo.alt}" class="logo-img" />
        </a>
        ${searchHTML}
        <a href="${data.cart.href}" class="cart-link" title="Cart">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.51345 5H1.33325V3H6.15306L7.21972 8.33333H30.5315L27.5012 25H8.51345L4.51345 5ZM7.61972 10.3333L10.1531 23H25.832L28.135 10.3333H7.61972Z" fill="white"/>
            <path d="M11.9999 28C11.9999 28.7364 11.403 29.3333 10.6666 29.3333C9.93021 29.3333 9.33325 28.7364 9.33325 28C9.33325 27.2636 9.93021 26.6667 10.6666 26.6667C11.403 26.6667 11.9999 27.2636 11.9999 28Z" fill="white"/>
            <path d="M25.3333 29.3333C26.0696 29.3333 26.6666 28.7364 26.6666 28C26.6666 27.2636 26.0696 26.6667 25.3333 26.6667C24.5969 26.6667 23.9999 27.2636 23.9999 28C23.9999 28.7364 24.5969 29.3333 25.3333 29.3333Z" fill="white"/>
          </svg>
        </a>
        <button class="hamburger-btn" id="hamburger-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    ${subNavHTML}
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
        <div class="login-panel" id="panel-password">
          <input class="login-input" type="text" placeholder="Please enter your Phone or Email" id="login-email" required/>
          <div class="login-input-wrap">
            <input class="login-input" type="password" placeholder="Please enter your password" id="login-pass" />
            <button class="login-eye" id="login-eye" aria-label="Toggle password">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" width="18" height="18" style="display:block"><path d="M32.711 11c-3.166 4.841-8.573 8.03-14.71 8.03-6.139 0-11.546-3.189-14.712-8.03M9.79 17.5l-3 5m8.5-3-1 5.5m12.5-7.5 3 5m-8.5-3 1 5.5"></path></svg>
            </button>
          </div>
          <a href="#" class="login-forgot">Forgot password?</a>
          <button class="login-btn">LOGIN</button>
          <p class="login-signup-row">Don't have an account? <a href="#" class="login-signup-link">Sign up</a></p>
          <div class="login-or">Or, login with</div>
          <div class="login-social-row">
            <button class="login-social-btn">
              <img src="https://www.google.com/favicon.ico" alt="G" width="22" /> Google
            </button>
            <button class="login-social-btn">
              <i class="bi bi-facebook fb-fwc"></i> Facebook
            </button>
          </div>
        </div>
        <div class="login-panel login-panel--hidden" id="panel-phone">
          <div class="login-phone-wrap">
            <div class="login-phone-prefix"><span><span style="font-size:10px">PK</span>+92</span></div>
            <input class="login-input login-input--phone" type="tel" placeholder="Please enter your phone number" />
          </div>
          <button class="login-btn login-btn--whatsapp">
            <img src="../assets/icons/whatsapp-icon.png" alt="WhatsApp" class="whatsapp-icon"> Send code via Whatsapp
          </button>
          <p class="login-signup-row">Don't have an account? <a href="#" class="login-signup-link">Sign up</a></p>
          <div class="login-or">Or, login with</div>
          <div class="login-social-row">
            <button class="login-social-btn">
              <img src="https://www.google.com/favicon.ico" alt="G" width="22" /> Google
            </button>
            <button class="login-social-btn">
              <i class="bi bi-facebook fb-fwc"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById("mobile-drawer")) {
    document.body.insertAdjacentHTML("beforeend", mobileDrawerHTML);
  }
}

function resolveDrawerIcon(label) {
  const map = {
    login: "bi-person",
    "sign up": "bi-person-plus",
    signup: "bi-person-plus",
    register: "bi-person-plus",
    help: "bi-question-circle",
    "help center": "bi-question-circle",
    sell: "bi-shop",
    seller: "bi-shop",
    "become a seller": "bi-shop",
    "download app": "bi-phone",
    app: "bi-phone",
    "track order": "bi-box-seam",
    orders: "bi-bag",
    account: "bi-person-circle",
    notifications: "bi-bell",
  };
  const key = label.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return "bi-chevron-right";
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

function initMobileDrawer() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  if (!hamburgerBtn) return;

  function openDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    const btn = document.getElementById("hamburger-btn");
    if (!drawer) return;
    drawer.classList.add("is-open");
    btn?.classList.add("is-open");
    btn?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    const btn = document.getElementById("hamburger-btn");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    btn?.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburgerBtn.addEventListener("click", () => {
    const drawer = document.getElementById("mobile-drawer");
    drawer?.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });

  document.addEventListener("click", (e) => {
    if (e.target.id === "drawer-overlay") closeDrawer();
    if (e.target.closest("#drawer-close")) closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".drawer-nav a");
    if (link && !link.dataset.action) closeDrawer();
    if (link && link.dataset.action === "login") closeDrawer();
  });
}

function initCategoriesDropdown(categories) {
  const btn = document.getElementById("categories-btn");
  const dropdown = document.getElementById("cat-dropdown");
  const chevron = document.getElementById("cat-chevron");
  if (!btn || !dropdown) return;

  dropdown.innerHTML = `
    <div class="cat-dropdown-inner">
      <ul class="cat-root-list" id="cat-root-list">
        ${categories
          .map(
            (cat, i) => `
          <li class="cat-root-item" data-index="${i}">
            ${cat.label}
            ${cat.subs.length ? `<i class="bi bi-chevron-right"></i>` : ""}
          </li>`,
          )
          .join("")}
      </ul>
      <ul class="cat-sub-panel" id="cat-sub-panel"></ul>
      <div class="cat-grand-panel" id="cat-grand-panel"></div>
    </div>`;

  const rootList = document.getElementById("cat-root-list");
  const subPanel = document.getElementById("cat-sub-panel");
  const grandPanel = document.getElementById("cat-grand-panel");
  const subNav = btn.closest(".sub-nav");

  subNav.addEventListener("mouseenter", () => {
    dropdown.classList.add("cat-dropdown--open");
    chevron.style.transform = "rotate(180deg)";
  });
  subNav.addEventListener("mouseleave", () => {
    dropdown.classList.remove("cat-dropdown--open");
    chevron.style.transform = "";
    subPanel.classList.remove("cat-sub-panel--visible");
    grandPanel.classList.remove("cat-grand-panel--visible");
  });

  rootList.addEventListener("mouseover", (e) => {
    const item = e.target.closest(".cat-root-item");
    if (!item) return;
    const idx = Number(item.dataset.index);
    const cat = categories[idx];

    rootList
      .querySelectorAll(".cat-root-item")
      .forEach((el) => el.classList.remove("cat-root-item--active"));
    item.classList.add("cat-root-item--active");

    subPanel.innerHTML = cat.subs
      .map(
        (sub, si) => `
      <li class="cat-sub-item" data-index="${si}">
        <a href="#">${sub.label}</a>
        ${sub.grands.length ? `<i class="bi bi-chevron-right"></i>` : ""}
      </li>`,
      )
      .join("");

    subPanel.classList.add("cat-sub-panel--visible");
    grandPanel.innerHTML = "";
    grandPanel.classList.remove("cat-grand-panel--visible");

    subPanel.querySelectorAll(".cat-sub-item").forEach((subItem) => {
      subItem.addEventListener("mouseenter", () => {
        const si = Number(subItem.dataset.index);
        const sub = cat.subs[si];
        subPanel
          .querySelectorAll(".cat-sub-item")
          .forEach((el) => el.classList.remove("cat-sub-item--active"));
        subItem.classList.add("cat-sub-item--active");
        if (!sub.grands.length) {
          grandPanel.innerHTML = "";
          grandPanel.classList.remove("cat-grand-panel--visible");
          return;
        }
        grandPanel.innerHTML = sub.grands
          .map((g) => `<a href="#" class="cat-grand-item">${g}</a>`)
          .join("");
        grandPanel.classList.add("cat-grand-panel--visible");
      });
    });
  });
}
