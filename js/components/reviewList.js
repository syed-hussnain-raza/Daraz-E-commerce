// components/reviewList.js

function renderReviews(p) {
  const reviewTitle = document.querySelector("#reviews .pd-section-title");
  if (reviewTitle)
    reviewTitle.textContent = `Ratings & Reviews of ${p.fullTitle}`;

  const ratingNum = document.querySelector(".pd-rating-num");
  if (ratingNum)
    ratingNum.innerHTML = `${p.stars} <span class="pd-rating-denom">/5</span>`;

  const starsBig = document.querySelector(".pd-stars-big");
  if (starsBig) starsBig.innerHTML = starsHTML(p.stars);

  const ratingCount = document.querySelector(".pd-rating-count");
  if (ratingCount) ratingCount.textContent = `${p.ratingCount} Ratings`;

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
