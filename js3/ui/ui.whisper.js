/* =========================================================
   JS3 UI WHISPER
   - subtle luxury behavioral messages
   ========================================================= */

(function () {
  if (!window.JS3) {
    console.error("JS3 not found – ui.whisper aborted");
    return;
  }

  let container = null;
  let hideTimer = null;

  function createWhisper() {
    container = document.createElement("div");
    container.id = "js3-whisper";

    container.style.position = "fixed";
    container.style.bottom = "26px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.padding = "10px 18px";
    container.style.borderRadius = "22px";
    container.style.fontSize = "13px";
    container.style.letterSpacing = "0.08em";
    container.style.fontFamily = "'Inter', sans-serif";
    container.style.background = "rgba(0,0,0,0.45)";
    container.style.backdropFilter = "blur(14px)";
    container.style.color = "#c9b46d";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.style.transition = "opacity .6s ease, transform .6s ease";
    container.style.zIndex = "9999";
    container.style.whiteSpace = "nowrap";

    document.body.appendChild(container);
  }

  function showWhisper(text, duration = 4000) {
    if (!container) createWhisper();
    if (hideTimer) clearTimeout(hideTimer);

    container.textContent = text;
    container.style.opacity = "1";
    container.style.transform = "translateX(-50%) translateY(0)";

    hideTimer = setTimeout(() => {
      container.style.opacity = "0";
      container.style.transform = "translateX(-50%) translateY(8px)";
    }, duration);
  }

  /* -----------------------------
     EVENT LISTENER
  ----------------------------- */
  JS3.on("ui:whisper", payload => {
    if (!payload || !payload.text) return;
    showWhisper(payload.text, payload.duration);
  });

  console.log("JS3 ui.whisper loaded");
})();
