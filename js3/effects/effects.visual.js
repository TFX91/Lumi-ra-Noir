/* =========================================================
   JS3 VISUAL EFFECTS MODULE
   - luxury hover, modal animation, UV glow
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.effects) JS3.effects = {};

  JS3.effects.visual = {

    /* -----------------------------
       FADE IN ELEMENT
    ----------------------------- */
    fadeIn(el, duration = 300) {
      if (!el) return;
      el.style.opacity = 0;
      el.style.display = "flex";
      el.style.transition = `opacity ${duration}ms ease`;
      requestAnimationFrame(() => el.style.opacity = 1);
    },

    /* -----------------------------
       FADE OUT ELEMENT
    ----------------------------- */
    fadeOut(el, duration = 300) {
      if (!el) return;
      el.style.opacity = 1;
      el.style.transition = `opacity ${duration}ms ease`;
      el.style.opacity = 0;
      setTimeout(() => el.style.display = "none", duration);
    },

    /* -----------------------------
       MODAL LUXURY OPEN
    ----------------------------- */
    modalOpen(modalBox) {
      if (!modalBox) return;
      modalBox.style.opacity = 0;
      modalBox.style.transform = "scale(0.96)";
      modalBox.style.transition =
        "opacity 420ms ease, transform 420ms cubic-bezier(.22,1,.36,1)";
      requestAnimationFrame(() => {
        modalBox.style.opacity = 1;
        modalBox.style.transform = "scale(1)";
      });
    },

    /* -----------------------------
       MODAL LUXURY CLOSE
    ----------------------------- */
    modalClose(modalBox) {
      if (!modalBox) return;
      modalBox.style.opacity = 1;
      modalBox.style.transform = "scale(1)";
      requestAnimationFrame(() => {
        modalBox.style.opacity = 0;
        modalBox.style.transform = "scale(0.96)";
      });
    },

    /* -----------------------------
       CARD HOVER GLOW
    ----------------------------- */
    attachCardHover() {
      document.querySelectorAll(".product, .collection-card").forEach(card => {
        card.style.transition =
          "transform 400ms ease, box-shadow 400ms ease";

        card.addEventListener("mouseenter", () => {
          card.style.transform = "translateY(-6px)";
          card.style.boxShadow =
            "0 20px 50px rgba(255,255,255,0.12)";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "translateY(0)";
          card.style.boxShadow = "none";
        });
      });
    },

    /* -----------------------------
       UV IMAGE GLOW EFFECT
    ----------------------------- */
    uvGlow(img) {
      if (!img) return;
      img.style.transition =
        "filter 300ms ease, box-shadow 300ms ease";

      img.style.filter = "brightness(1.15)";
      img.style.boxShadow =
        "0 0 35px rgba(180,120,255,0.55)";

      setTimeout(() => {
        img.style.filter = "";
        img.style.boxShadow = "";
      }, 600);
    },

    /* -----------------------------
       INITIALIZE
    ----------------------------- */
    init() {
      this.attachCardHover();

      // Hook pre modal
      document.addEventListener("js3:modal:open", e => {
        this.fadeIn(e.detail.modal, 300);
        this.modalOpen(e.detail.box);
      });

      document.addEventListener("js3:modal:close", e => {
        this.modalClose(e.detail.box);
        this.fadeOut(e.detail.modal, 250);
      });

      document.addEventListener("js3:modal:uv", e => {
        this.uvGlow(e.detail.image);
      });

      console.log("JS3 visual effects initialized ✨");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    JS3.effects.visual.init();
  });

})();
