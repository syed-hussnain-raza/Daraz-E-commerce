// components/loginMo

function initLoginModal() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-action='login']");
    if (link) {
      e.preventDefault();
      openModal();
      return;
    }
    if (e.target.closest("#login-close")) {
      closeModal();
      return;
    }
    const overlay = document.getElementById("login-overlay");
    if (overlay && e.target === overlay) {
      closeModal();
      return;
    }
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
    if (e.target.closest("#login-eye")) {
      const passInput = document.getElementById("login-pass");
      const eyeBtn = document.getElementById("login-eye");
      if (passInput && eyeBtn) {
        const isHidden = passInput.type === "password";
        passInput.type = isHidden ? "text" : "password";
        eyeBtn.innerHTML = isHidden
          ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" width="18" height="18" style="display:block"><circle cx="18" cy="17.5" r="4"></circle><path d="M3.284 18.47a1.77 1.77 0 0 1 0-1.94c3.167-4.84 8.573-8.03 14.711-8.03s11.545 3.19 14.711 8.03a1.77 1.77 0 0 1 0 1.94c-3.166 4.84-8.573 8.03-14.71 8.03-6.139 0-11.545-3.19-14.712-8.03"></path></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" width="18" height="18" style="display:block"><path d="M32.711 11c-3.166 4.841-8.573 8.03-14.71 8.03-6.139 0-11.546-3.189-14.712-8.03M9.79 17.5l-3 5m8.5-3-1 5.5m12.5-7.5 3 5m-8.5-3 1 5.5"></path></svg>`;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const inputs = document.querySelectorAll("#panel-password .login-input");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        let msg = input.nextElementSibling;
        if (!msg || !msg.classList.contains("login-error")) {
          msg = document.createElement("p");
          msg.className = "login-error";
          msg.textContent = "You can't leave this empty.";
          input.parentNode.insertBefore(msg, input.nextSibling);
        }
      }
    });
    input.addEventListener("focus", () => {
      input.style.borderColor = "";
      const msg = input.parentNode.querySelector(".login-error");
      if (msg) msg.remove();
    });
  });
}
