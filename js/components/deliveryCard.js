// components/deliveryCard.js

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
