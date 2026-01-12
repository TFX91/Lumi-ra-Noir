/* =========================================================
   JS3 WISHLIST STORE MODULE
   - manages wishlist items
   - integrates with modals, behavior, organism
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.store) JS3.store = {};

  JS3.store.wishlist = {
    items: [],

    /* -----------------------------
       ADD ITEM TO WISHLIST
       item: { id, name, price }
    ----------------------------- */
    addItem(item) {
      if (!this.items.find(i => i.id === item.id)) {
        this.items.push({ ...item });
        this.save();
        this.updateUI();
        this.trackBehavior("addItem", item);
      }
    },

    /* -----------------------------
       REMOVE ITEM FROM WISHLIST
    ----------------------------- */
    removeItem(itemId) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.save();
      this.updateUI();
      this.trackBehavior("removeItem", { id: itemId });
    },

    /* -----------------------------
       CHECK IF ITEM EXISTS
    ----------------------------- */
    hasItem(itemId) {
      return !!this.items.find(i => i.id === itemId);
    },

    /* -----------------------------
       SAVE TO LOCAL STORAGE
    ----------------------------- */
    save() {
      localStorage.setItem("js3_wishlist", JSON.stringify(this.items));
    },

    /* -----------------------------
       LOAD FROM LOCAL STORAGE
    ----------------------------- */
    load() {
      const data = localStorage.getItem("js3_wishlist");
      if (data) {
        this.items = JSON.parse(data);
      }
      this.updateUI();
    },

    /* -----------------------------
       UPDATE UI (trigger modals)
    ----------------------------- */
    updateUI() {
      if (JS3.modals && JS3.modals.collection) {
        JS3.modals.collection.init(); // re-init modals if needed
      }

      const countElem = document.querySelector("[data-js3-wishlist-count]");
      if (countElem) {
        countElem.textContent = this.items.length;
      }
    },

    /* -----------------------------
       TRACK BEHAVIOR
    ----------------------------- */
    trackBehavior(action, data) {
      if (JS3.behaviorMemory) {
        JS3.behaviorMemory.trackEvent(`wishlist:${action}`, data);
      }
      if (JS3.organism) {
        JS3.emit(`wishlist:${action}`, data);
      }
    },

    /* -----------------------------
       INITIALIZE STORE
    ----------------------------- */
    init() {
      this.load();
      console.log("JS3 wishlist store initialized:", this.items);
    }
  };

  // auto-init on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    JS3.store.wishlist.init();
  });
})();
