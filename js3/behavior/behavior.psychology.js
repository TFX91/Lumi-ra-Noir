/* =========================================================
   JS3 BEHAVIOR PSYCHOLOGY
   - luxury reverse psychology whispers
   - non-intrusive behavioral feedback
   ========================================================= */

(function () {
  if (!window.JS3 || !JS3.state || !JS3.state.behavior) {
    console.error("JS3 or behavior.core not found – psychology aborted");
    return;
  }

  const state = JS3.state.behavior;
  const timers = {};
  let lastShownAt = 0;

  /* -----------------------------
     LUXURY PSYCHOLOGY TEXTS (30)
  ----------------------------- */
  const messages = [
    "Niektoré kúsky si vás nájdu samy.",
    "Zdá sa, že vás zaujíma viac než len povrch.",
    "Pozornosť sa nezastaví náhodou.",
    "Nie všetko, čo zaujme, sa dá pomenovať.",
    "Tento moment pôsobí povedome.",
    "Nie každý sa k tomuto detailu vráti.",
    "Niektoré rozhodnutia sa nerobia okamžite.",
    "Tento výber neosloví každého.",
    "Niektoré veci si vyžadujú čas.",
    "Nie všetko je určené na rýchlu odpoveď.",
    "Niektoré vrstvy zostávajú skryté.",
    "Nie každý detail sa odhalí hneď.",
    "Ticho často prezrádza viac.",
    "Nie všetko má byť vysvetlené.",
    "Niektoré dojmy sa vracajú.",
    "Niektoré veci dávajú zmysel až neskôr.",
    "Čas tu nehrá proti vám.",
    "Nie je dôvod ponáhľať sa.",
    "Niektoré voľby dozrievajú.",
    "Moment ešte neskončil.",
    "Tento pohľad nie je pre každého.",
    "Niektoré kúsky si vyberajú vás.",
    "Nie všetko je určené na vystavenie.",
    "Tento detail má svojich pozorovateľov.",
    "Niektoré rozhodnutia ostávajú osobné.",
    "Nie je potrebné nič potvrdiť.",
    "Niektoré veci netreba vlastniť hneď.",
    "Váš pohľad tu nie je náhodný.",
    "Nie všetko musí byť vyslovené.",
    "Tento moment môže zostať otvorený."
  ];

  /* -----------------------------
     HELPERS
  ----------------------------- */
  function canShow() {
    const now = Date.now();
    return now - lastShownAt > 45000; // min. 45s pauza
  }

  function pickMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function showWhisper() {
    if (!canShow()) return;

    lastShownAt = Date.now();
    JS3.emit("ui:whisper", {
      text: pickMessage(),
      tone: "luxury",
      duration: 4200
    });
  }

  function delayTrigger(name, delay, fn) {
    if (timers[name]) clearTimeout(timers[name]);
    timers[name] = setTimeout(fn, delay);
  }

  /* -----------------------------
     EXIT INTENT (VERY RARE)
  ----------------------------- */
  JS3.on("behavior:intent", intent => {
    if (intent === "exit" && !state.exitWhispered) {
      state.exitWhispered = true;
      delayTrigger("exitWhisper", 1200, showWhisper);
    }
  });

  /* -----------------------------
     IDLE STATE
  ----------------------------- */
  JS3.on("behavior:idle", () => {
    if (!state.idleWhispered) {
      state.idleWhispered = true;
      delayTrigger("idleWhisper", 2500, showWhisper);
    }
  });

  /* -----------------------------
     SCROLL DEPTH
  ----------------------------- */
  JS3.on("behavior:scroll", percent => {
    if (percent > 55 && !state.scrollWhispered) {
      state.scrollWhispered = true;
      delayTrigger("scrollWhisper", 1200, showWhisper);
    }
  });

  /* -----------------------------
     PRODUCT FOCUS (HOVER / VIEW)
  ----------------------------- */
  JS3.on("behavior:focus", () => {
    if (Math.random() < 0.25) { // len občas
      delayTrigger("focusWhisper", 1500, showWhisper);
    }
  });

  /* -----------------------------
     INIT
  ----------------------------- */
  JS3.emit("behavior:psychology-ready");
  console.log("JS3 behavior.psychology loaded (luxury mode)");
})();
