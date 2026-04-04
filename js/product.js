// ============================================================
//  product.js — product page (product.html)
//  Depends on: js/utils.js (loaded before this script)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initThumbs();
  initZoom();
  initQty();
  initColorSelect();
  initFlashTimer();
  initViewMore();
});

// ── Image thumbnails ─────────────────────────────────────────────────────────
function initThumbs() {
  const thumbs = document.querySelectorAll(".pd-thumb");
  const mainImg = document.getElementById("pd-main-img");
  if (!thumbs.length || !mainImg) return;

  let lockedSrc = mainImg.src;

  thumbs.forEach((thumb) => {
    const src = thumb.dataset.src;

    // Hover: preview image in main frame
    thumb.addEventListener("mouseenter", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(src);
      }, 120);
    });

    // Mouse leave: restore locked image
    thumb.addEventListener("mouseleave", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = lockedSrc;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(lockedSrc);
      }, 120);
    });

    // Click: lock the image permanently
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

  // Thumbnail strip prev/next scroll
  const strip = document.getElementById("pd-thumbs");
  document.getElementById("pd-thumb-prev")?.addEventListener("click", () => {
    strip.scrollBy({ left: -80, behavior: "smooth" });
  });
  document.getElementById("pd-thumb-next")?.addEventListener("click", () => {
    strip.scrollBy({ left: 80, behavior: "smooth" });
  });
}

// ── Glass magnifier zoom ─────────────────────────────────────────────────────
function initZoom() {
  const wrap = document.getElementById("pd-zoom-wrap");
  const lens = document.getElementById("pd-zoom-lens");
  const result = document.getElementById("pd-zoom-result");
  const mainImg = document.getElementById("pd-main-img");
  if (!wrap || !lens || !result || !mainImg) return;

  const ZOOM = 3;

  // Cached panel dimensions — read once on mouseenter, not every mousemove.
  let resultW = 0;
  let resultH = 0;
  let lensW = 0;
  let lensH = 0;

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

// ── Quantity +/- ─────────────────────────────────────────────────────────────
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

// ── Color selector ───────────────────────────────────────────────────────────
function initColorSelect() {
  const btns = document.querySelectorAll(".pd-color-btn");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// ── Flash sale countdown ─────────────────────────────────────────────────────
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

// ── View More / View Less toggle ─────────────────────────────────────────────
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
      if (wrap) {
        wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}
