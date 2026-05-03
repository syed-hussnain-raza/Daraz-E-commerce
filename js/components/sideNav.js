// components/sideNav.js

function initSideNav() {
  const sideNav = document.getElementById("side-nav");
  if (!sideNav) return;

  const navTop = document.getElementById("nav-top");
  const navItems = document.querySelectorAll(".side-nav-item[data-section]");
  const sections = ["flash-sale", "categories", "just-for-you"];

  navTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.querySelector("." + btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
  });

  const flashSale = document.querySelector(".flash-sale");
  if (!flashSale) return;

  window.addEventListener("scroll", () => {
    const flashTop = flashSale.getBoundingClientRect().top;
    sideNav.classList.toggle(
      "side-nav--visible",
      flashTop < window.innerHeight,
    );
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = sections.find((c) =>
            entry.target.classList.contains(c),
          );
          navItems.forEach((btn) => {
            btn.classList.toggle(
              "nav--active",
              btn.dataset.section === sectionClass,
            );
          });
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -45% 0px" },
  );

  document
    .querySelectorAll(".flash-sale, .categories, .just-for-you")
    .forEach((sec) => activeObserver.observe(sec));
}
