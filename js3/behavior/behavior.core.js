/* =========================================================
   JS3 BEHAVIOR CORE
   - idle detection
   - scroll depth
   - basic intent signals
   ========================================================= */

(function () {
  if (!window.JS3) {
    console.error("JS3 not found – behavior.core aborted");
    return;
  }

  const state = JS3.state.behavior;

  let lastActivity = Date.now();
  let idleTriggered = false;
  let maxScroll = 0;

  /* -----------------------------
     ACTIVITY TRACKING
  ----------------------------- */
  ["mousemove", "keydown", "touchstart"].forEach(evt => {
    document.addEventListener(evt, () => {
      lastActivity = Date.now();
      if (state.idle) {
        state.idle = false;
        idleTriggered = false;
        JS3.emit("behavior:active");
      }
    });
  });

  /* -----------------------------
     IDLE DETECTION
  ----------------------------- */
  setInterval(() => {
    if (!idleTriggered && Date.now() - lastActivity > 15000) {
      state.idle = true;
      idleTriggered = true;
      JS3.emit("behavior:idle");
    }
  }, 3000);

  /* -----------------------------
     SCROLL DEPTH
  ----------------------------- */
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const percent = Math.round((scrollTop / docHeight) * 100);

    if (percent > maxScroll) {
      maxScroll = percent;
      JS3.emit("behavior:scroll", percent);
    }
  });

  /* -----------------------------
     EXIT INTENT (DESKTOP)
  ----------------------------- */
  document.addEventListener("mouseout", e => {
    if (e.clientY <= 0) {
      state.intent = "exit";
      JS3.emit("behavior:intent", "exit");
    }
  });

  /* -----------------------------
     INIT SIGNAL
  ----------------------------- */
  JS3.emit("behavior:core-ready");
  console.log("JS3 behavior.core loaded");
})();
