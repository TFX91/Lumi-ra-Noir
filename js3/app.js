/* =========================================================
   JS3 CORE APP
   - global state
   - event bus
   - init
   ========================================================= */

(function () {
  if (window.JS3) {
    console.warn("JS3 already initialized");
    return;
  }

  const JS3 = {
    /* -----------------------------
       GLOBAL STATE
    ----------------------------- */
    state: {
      cart: [],
      wishlist: [],
      behavior: {
        visits: 0,
        idle: false,
        intent: null
      }
    },

    /* -----------------------------
       EVENT BUS
    ----------------------------- */
    events: {},

    on(event, handler) {
      (this.events[event] ||= []).push(handler);
    },

    emit(event, payload) {
      (this.events[event] || []).forEach(fn => fn(payload));
    },

    /* -----------------------------
       STORAGE
    ----------------------------- */
    load() {
      try {
        this.state.cart = JSON.parse(localStorage.getItem("js3_cart")) || [];
        this.state.wishlist = JSON.parse(localStorage.getItem("js3_wishlist")) || [];
        this.state.behavior.visits =
          Number(localStorage.getItem("js3_visits")) || 0;
      } catch (e) {
        console.error("JS3 load error", e);
      }
    },

    save() {
      localStorage.setItem("js3_cart", JSON.stringify(this.state.cart));
      localStorage.setItem("js3_wishlist", JSON.stringify(this.state.wishlist));
      localStorage.setItem("js3_visits", this.state.behavior.visits);
    },

    /* -----------------------------
       INIT
    ----------------------------- */
    init() {
      this.load();
      this.state.behavior.visits++;
      this.save();

      this.emit("app:init");
      console.log("JS3 initialized", this.state);
    }
  };

  window.JS3 = JS3;
  document.addEventListener("DOMContentLoaded", () => JS3.init());
})();
