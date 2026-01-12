/* =========================================================
   JS3 BEHAVIOR MEMORY
   - track user interactions
   - maintain persistent state
   - enable adaptive modals
   ========================================================= */

(function () {
  if (!window.JS3 || !JS3.state.behavior) {
    console.error("JS3 or behavior.core not found – memory aborted");
    return;
  }

  const memory = JS3.state.behavior.memory || {};
  const maxHistory = 50; // maximum stored events

  /* -----------------------------
     HELPER: ADD EVENT TO MEMORY
  ----------------------------- */
  function addEvent(type, data = {}) {
    if (!memory.history) memory.history = [];
    memory.history.push({
      type,
      data,
      timestamp: Date.now()
    });
    // trim history
    if (memory.history.length > maxHistory) memory.history.shift();
  }

  /* -----------------------------
     HELPER: COUNT EVENTS
  ----------------------------- */
  function countEvents(type) {
    return memory.history.filter(event => event.type === type).length;
  }

  /* -----------------------------
     EXPOSE MEMORY API
  ----------------------------- */
  JS3.behaviorMemory = {
    addEvent,
    countEvents,
    getHistory: () => memory.history || [],
    clearHistory: () => {
      memory.history = [];
    }
  };

  /* -----------------------------
     AUTO TRACK CORE EVENTS
  ----------------------------- */
  JS3.on("modal:show", modal => addEvent("modal:show", modal));
  JS3.on("modal:close", modal => addEvent("modal:close", modal));
  JS3.on("behavior:intent", intent => addEvent("intent", { intent }));

  JS3.state.behavior.memory = memory;

  console.log("JS3 behavior.memory loaded");
})();
