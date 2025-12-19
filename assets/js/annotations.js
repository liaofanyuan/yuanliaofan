(function () {
  function closeAll() {
    document.querySelectorAll(".anno-pop.is-open").forEach(el => {
      el.classList.remove("is-open");
      el.classList.remove("bottom-popup");
    });
    document.querySelectorAll(".anno-trigger[aria-expanded='true']").forEach(btn => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function positionPopover(btn, pop) {
    // 所有设备统一使用底部弹窗
    pop.classList.add("is-open");
    pop.classList.add("bottom-popup");
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".anno-trigger");
    const popClicked = e.target.closest(".anno-pop");

    if (!btn && popClicked) return;

    if (btn) {
      const id = btn.getAttribute("data-anno");
      const pop = document.getElementById(id);
      if (!pop) return;

      const isOpen = pop.classList.contains("is-open");

      closeAll();

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        positionPopover(btn, pop);
      }
      return;
    }

    closeAll();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  window.addEventListener("scroll", closeAll, { passive: true });
  window.addEventListener("resize", closeAll);
})();
