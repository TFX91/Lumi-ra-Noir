/* =========================================================
   JS3 DOM UTILS MODULE
   - helper functions for DOM manipulation
   ========================================================= */

(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.utils) JS3.utils = {};

  JS3.utils.dom = {

    /* -----------------------------
       SELECTOR SHORTCUT
       el: string (selector)
    ----------------------------- */
    $(el) {
      return document.querySelector(el);
    },

    $all(el) {
      return document.querySelectorAll(el);
    },

    /* -----------------------------
       CREATE ELEMENT
       tag: string, options: {class, id, attributes, text}
    ----------------------------- */
    create(tag, options = {}) {
      const el = document.createElement(tag);
      if (options.class) el.className = options.class;
      if (options.id) el.id = options.id;
      if (options.text) el.textContent = options.text;
      if (options.html) el.innerHTML = options.html;
      if (options.attributes) {
        for (let attr in options.attributes) {
          el.setAttribute(attr, options.attributes[attr]);
        }
      }
      return el;
    },

    /* -----------------------------
       ADD EVENT LISTENER
    ----------------------------- */
    on(el, event, handler) {
      if (!el) return;
      if (el instanceof NodeList || Array.isArray(el)) {
        el.forEach((e) => e.addEventListener(event, handler));
      } else {
        el.addEventListener(event, handler);
      }
    },

    /* -----------------------------
       REMOVE EVENT LISTENER
    ----------------------------- */
    off(el, event, handler) {
      if (!el) return;
      if (el instanceof NodeList || Array.isArray(el)) {
        el.forEach((e) => e.removeEventListener(event, handler));
      } else {
        el.removeEventListener(event, handler);
      }
    },

    /* -----------------------------
       TOGGLE CLASS
    ----------------------------- */
    toggleClass(el, className) {
      if (!el) return;
      el.classList.toggle(className);
    },

    /* -----------------------------
       ADD CLASS
    ----------------------------- */
    addClass(el, className) {
      if (!el) return;
      el.classList.add(className);
    },

    /* -----------------------------
       REMOVE CLASS
    ----------------------------- */
    removeClass(el, className) {
      if (!el) return;
      el.classList.remove(className);
    },

    /* -----------------------------
       GET ATTRIBUTE
    ----------------------------- */
    getAttr(el, attr) {
      if (!el) return null;
      return el.getAttribute(attr);
    },

    /* -----------------------------
       SET ATTRIBUTE
    ----------------------------- */
    setAttr(el, attr, value) {
      if (!el) return;
      el.setAttribute(attr, value);
    },

    /* -----------------------------
       REMOVE ELEMENT
    ----------------------------- */
    remove(el) {
      if (!el) return;
      if (el.parentNode) el.parentNode.removeChild(el);
    },

    /* -----------------------------
       APPEND CHILD
    ----------------------------- */
    append(parent, child) {
      if (!parent || !child) return;
      parent.appendChild(child);
    },

    /* -----------------------------
       CLEAR CHILDREN
    ----------------------------- */
    clear(el) {
      if (!el) return;
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    }

  };

})();
