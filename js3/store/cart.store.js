/* =========================================================
   JS3 CART STORE MODULE
   - manages cart items, quantities, totals
   - integrates with modals, behavior, organism
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.store) JS3.store = {};

  JS3.store.cart = {
    items: [],

    /* -----------------------------
       ADD ITEM TO CART
       item: { id, name, price, quantity }
    ----------------------------- */
    addItem(item) {
      const existing = this.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }

      this.save();
      this.updateUI();
      this.trackBehavior("addItem", item);
    },

    /* -----------------------------
       REMOVE ITEM FROM CART
    ----------------------------- */
    removeItem(itemId) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.save();
      this.updateUI();
      this.trackBehavior("removeItem", { id: itemId });
    },

    /* -----------------------------
       UPDATE ITEM QUANTITY
    ----------------------------- */
    updateItemQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId);
      if (!item) return;
      item.quantity = quantity;
      this.save();
      this.updateUI();
      this.trackBehavior("updateQuantity", { id: itemId, quantity });
    },

    /* -----------------------------
       GET TOTAL
    ----------------------------- */
    getTotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    /* -----------------------------
       SAVE TO LOCAL STORAGE
    ----------------------------- */
    save() {
      localStorage.setItem("js3_cart", JSON.stringify(this.items));
    },

    /* -----------------------------
       LOAD FROM LOCAL STORAGE
    ----------------------------- */
    load() {
      const data = localStorage.getItem("js3_cart");
      if (data) {
        this.items = JSON.parse(data);
      }
      this.updateUI();
    },

    /* -----------------------------
       UPDATE UI (trigger modal/cart)
    ----------------------------- */
    updateUI() {
      if (JS3.modals && JS3.modals.cart) {
        JS3.modals.cart.init(); // re-init modals if needed
      }

      const totalElem = document.querySelector("[data-js3-cart-total]");
      if (totalElem) totalElem.textContent = this.getTotal().toFixed(2);

      const countElem = document.querySelector("[data-js3-cart-count]");
      if (countElem) {
        countElem.textContent = this.items.reduce((c, i) => c + i.quantity, 0);
      }
    },

    /* -----------------------------
       TRACK BEHAVIOR
    ----------------------------- */
    trackBehavior(action, data) {
      if (JS3.behaviorMemory) {
        JS3.behaviorMemory.trackEvent(`cart:${action}`, data);
      }
      if (JS3.organism) {
        JS3.emit(`cart:${action}`, data);
      }
    },

    /* -----------------------------
       INITIALIZE STORE
    ----------------------------- */
    init() {
      this.load();
      console.log("JS3 cart store initialized:", this.items);
    }
  };

  // auto-init on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    JS3.store.cart.init();
  });
})();
