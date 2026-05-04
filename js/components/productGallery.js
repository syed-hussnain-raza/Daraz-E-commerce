// components/productGallery.js

function initThumbs() {
  const thumbs = document.querySelectorAll(".pd-thumb");
  const mainImg = document.getElementById("pd-main-img");
  if (!thumbs.length || !mainImg) return;

  const LEFT = 80; // scroll amount for thumb strip
  const TIMEOUT = 120; // transition timeout

  let lockedSrc = mainImg.src;

  thumbs.forEach((thumb) => {
    const src = thumb.dataset.src;

    thumb.addEventListener("mouseenter", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(src);
      }, TIMEOUT);
    });

    thumb.addEventListener("mouseleave", () => {
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = lockedSrc;
        mainImg.style.opacity = "1";
        if (window.updateZoomBg) window.updateZoomBg(lockedSrc);
      }, TIMEOUT);
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
      }, TIMEOUT);
    });
  });

  const strip = document.getElementById("pd-thumbs");

  document.getElementById("pd-thumb-prev")?.addEventListener("click", () => {
    const thumbs = document.querySelectorAll(".pd-thumb");
    const active = document.querySelector(".pd-thumb.active");
    const idx = [...thumbs].indexOf(active);
    const prev = idx > 0 ? idx - 1 : thumbs.length - 1;
    thumbs[prev].click();
    strip.scrollBy({ left: -LEFT, behavior: "smooth" });
  });

  document.getElementById("pd-thumb-next")?.addEventListener("click", () => {
    const thumbs = document.querySelectorAll(".pd-thumb");
    const active = document.querySelector(".pd-thumb.active");
    const idx = [...thumbs].indexOf(active);
    const next = idx < thumbs.length - 1 ? idx + 1 : 0;
    thumbs[next].click();
    strip.scrollBy({ left: LEFT, behavior: "smooth" });
  });
}

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

    const WIDTH = 200;
    const HEIGHT = 300;

    const layoutRect = layout.getBoundingClientRect();
    const galleryRect = gallery.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    const panelW = Math.max(layoutRect.right - galleryRect.right - 20, WIDTH);
    const panelH = Math.max(wrapRect.width * 1.5, HEIGHT);

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
