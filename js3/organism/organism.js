/* =========================================================
   JS3 ORGANISM MODULE
   - coordinates all JS3 modules
   - reacts adaptively to user behavior
   - enables dynamic project organism behavior
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.state) JS3.state = {};
  
  JS3.organism = {
    observers: [],
    
    /* -----------------------------
       REGISTER OBSERVER
       Observer = function(eventType, data)
    ----------------------------- */
    observe(fn) {
      if (typeof fn === "function") this.observers.push(fn);
    },

    /* -----------------------------
       TRIGGER EVENT
    ----------------------------- */
    emit(eventType, data = {}) {
      this.observers.forEach(fn => {
        try {
          fn(eventType, data);
        } catch (e) {
          console.error("Organism observer error:", e);
        }
      });
    },

    /* -----------------------------
       REACTIVE RULES
    ----------------------------- */
    adaptBehavior() {
      // example: if user closes cart modal 3x quickly, suggest wishlist
      const mem = JS3.behaviorMemory;
      if (!mem) return;

      const cartCloses = mem.countEvents("modal:close") || 0;
      if (cartCloses >= 3) {
        console.log("Organism: suggesting wishlist based on user behavior");
        JS3.emit("organism:suggest", { action: "wishlist" });
      }

      // other rules can be added here
    }
  };

  // auto-track behavior events
  if (JS3.behaviorMemory) {
    JS3.observe = JS3.organism.observe.bind(JS3.organism);
    JS3.emit = JS3.organism.emit.bind(JS3.organism);

    setInterval(() => {
      JS3.organism.adaptBehavior();
    }, 5000); // check every 5s
  }

  console.log("JS3 organism module loaded");
})();
