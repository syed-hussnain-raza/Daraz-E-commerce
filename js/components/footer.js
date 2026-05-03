// components/footer.js

function renderFooter(data) {
  const footer = document.querySelector("footer.site-footer");
  if (!footer) return;

  const isMainPage = !!document.querySelector(".flash-sale");

  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-inner">
        <div class="inner-row">
          <div class="col-12 col-sm-6 col-lg-3">
            <h3 class="footer-heading">${data.customerCare.heading}</h3>
            <ul class="footer-list">
              ${data.customerCare.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}
            </ul>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <h3 class="footer-heading">${data.darazLinks.heading}</h3>
            <ul class="footer-list">
              ${data.darazLinks.links
                .map((l) =>
                  l.href
                    ? `<li><a href="${l.href}">${l.label}</a></li>`
                    : `<li><span>${l.label}</span></li>`,
                )
                .join("")}
            </ul>
          </div>
          <div class="col-12 col-sm-12 col-lg-6">
            <div class="footer-app-col">
              <div class="footer-app-identity">
                <img src="${data.app.logo.src}" alt="${data.app.logo.alt}" class="footer-app-logo" />
                <div>
                  <p class="footer-app-tagline">${data.app.tagline}</p>
                  <p class="footer-app-sub">${data.app.sub}</p>
                </div>
              </div>
              <div class="footer-store-btns">
                ${data.app.stores
                  .map(
                    (s) =>
                      `<a href="${s.href}"><img src="${s.src}" alt="${s.alt}" class="footer-store-img" /></a>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-payments">
      <div class="payment-container">
        <div class="footer-width-32">
          <h3 class="footer-heading">${data.paymentMethods.heading}</h3>
          <div class="footer-pay-icons">
            ${data.paymentMethods.icons.map((i) => `<img src="${i.src}" alt="${i.alt}" />`).join("")}
          </div>
        </div>
        <div class="footer-width-32">
          <h3 class="footer-heading">${data.verifiedBy.heading}</h3>
          <div class="footer-verified-icons">
            ${data.verifiedBy.icons.map((i) => `<img src="${i.src}" alt="${i.alt}" />`).join("")}
          </div>
        </div>
      </div>
    </div>

    ${isMainPage ? renderAboutSection(data) : ""}

    <div class="footer-bottom">
      <div class="footer-inner">
        <div class="row g-2">
          <div class="col-6 px-0 mt-0">
            <h3 class="footer-heading">${data.international.heading}</h3>
            <div class="footer-countries">
              ${data.international.countries
                .map(
                  (c) =>
                    `<a href="${c.href}"><img src="${c.flag}" alt="${c.label}" /><span>${c.label}</span></a>`,
                )
                .join("")}
            </div>
          </div>
          <div class="col-3 px-0 mt-0">
            <h3 class="footer-heading">${data.social.heading}</h3>
            <div class="footer-social">
              ${data.social.links
                .map(
                  (s) =>
                    `<a href="${s.href}" class="social-link"><img src="${s.icon}" alt="${s.alt}" /></a>`,
                )
                .join("")}
            </div>
          </div>
          <div class="col-3 px-0 mt-0 text-end">
            <p class="footer-copyright">${data.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAboutSection(data) {
  const { about, tags } = data;

  const leftAbout = `
    <h1 class="footer-about-h1">${about.sections[0].heading}</h1>
    <p class="footer-about-body">${about.sections[0].body}</p>
    <h1 class="footer-about-h1">${about.sections[1].heading}</h1>
    ${about.sections[1].subSections
      .map(
        (s) =>
          `<p class="footer-about-body"><strong>${s.bold}</strong><br />${s.text}</p>`,
      )
      .join("")}
  `;

  const rightAbout = `
    <p class="footer-about-body">
      ${about.continuedText}
      ${about.moreSections.map((s) => `<br /><strong>${s.bold}</strong><br />${s.text}`).join("")}
    </p>
  `;

  const leftGroups = tags.groups.slice(0, 7);
  const rightGroups = tags.groups.slice(7);

  function renderTagGroup(g) {
    return `
      <h4 class="footer-tags-sub">${g.sub}</h4>
      <div class="footer-tags">
        ${g.tags.map((t) => `<a href="#">${t}</a>`).join("")}
      </div>
    `;
  }

  return `
    <div class="footer-about-row">
      <div class="footer-inner">
        <div class="inner-row g-4">
          <div class="col-12 col-md-6 col-lg-3 pe-5">${leftAbout}</div>
          <div class="col-12 col-md-6 col-lg-3 pe-5">${rightAbout}</div>
          <div class="col-12 col-md-6 col-lg-3 pe-5">
            <h3 class="footer-tags-main-heading">${tags.heading}</h3>
            ${leftGroups.map(renderTagGroup).join("")}
          </div>
          <div class="col-12 col-md-6 col-lg-3 pe-5">
            ${rightGroups.map(renderTagGroup).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}
