/* =========================================================
   JS3 MODAL CART MODULE
   - handles all modals in the Cart section
   - integrates with behavior and organism modules
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.modals) JS3.modals = {};

  JS3.modals.cart = {
    modals: {},

    /* -----------------------------
       REGISTER A CART MODAL
       modalId: unique string
       element: DOM element
    ----------------------------- */
    register(modalId, element) {
      if (!modalId || !element) return;
      this.modals[modalId] = element;
      element.style.display = "none";
    },

    /* -----------------------------
       OPEN MODAL
    ----------------------------- */
    open(modalId) {
      const modal = this.modals[modalId];
      if (!modal) return;
      modal.style.display = "block";

      // track open in behavior
      if (JS3.behaviorMemory) {
        JS3.behaviorMemory.trackEvent("cart:open", { id: modalId });
      }

      // trigger organism event
      if (JS3.organism) JS3.emit("cart:open", { id: modalId });
    },

    /* -----------------------------
       CLOSE MODAL
    ----------------------------- */
    close(modalId) {
      const modal = this.modals[modalId];
      if (!modal) return;
      modal.style.display = "none";

      // track close in behavior
      if (JS3.behaviorMemory) {
        JS3.behaviorMemory.trackEvent("cart:close", { id: modalId });
      }

      // trigger organism event
      if (JS3.organism) JS3.emit("cart:close", { id: modalId });
    },

    /* -----------------------------
       TOGGLE MODAL
    ----------------------------- */
    toggle(modalId) {
      const modal = this.modals[modalId];
      if (!modal) return;
      if (modal.style.display === "block") {
        this.close(modalId);
      } else {
        this.open(modalId);
      }
    },

    /* -----------------------------
       INITIALIZE MODALS FROM DOM
    ----------------------------- */
    init() {
      const modalElements = document.querySelectorAll("[data-js3-cart-modal]");
      modalElements.forEach(el => {
        const id = el.getAttribute("data-js3-cart-modal");
        this.register(id, el);
      });

      console.log("JS3 cart modals initialized:", Object.keys(this.modals));
    }
  };

  // auto-init on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    JS3.modals.cart.init();
  });
})();
