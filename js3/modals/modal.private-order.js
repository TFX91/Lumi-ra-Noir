/* =========================================================
   JS3 MODAL PRIVATE ORDER MODULE
   - handles private order panel functionality
   - integrates with behavior, organism, and JS3.data
========================================================= */
(function () {
  if (!window.JS3) window.JS3 = {};
  if (!JS3.modals) JS3.modals = {};

  JS3.modals.privateOrder = {
    modals: {},
    privateCart: [],
    selectedProduct: null,

    /* -----------------------------
       INIT MODAL
    ----------------------------- */
    init() {
      const waitAndInit = () => {
        if (!JS3.data || !JS3.data.products || !JS3.data.visualVariants || !JS3.data.flavourVariants || !JS3.data.productVariants) {
          setTimeout(waitAndInit, 50);
          return;
        }
        this.cacheDOM();
        this.initCategories();
        this.initRollboxes();
        this.bindEvents();
        this.selectFirstProduct();
        console.log("JS3 private order initialized");
      };
      waitAndInit();
    },

    /* -----------------------------
       CACHE DOM ELEMENTS
    ----------------------------- */
    cacheDOM() {
      this.leftPanel = document.getElementById("privateLeftCategories");
      this.middlePanel = document.querySelector(".private-order-center");
      this.previewName = document.getElementById("previewName");
      this.previewVisual = document.getElementById("previewVisual");
      this.previewFlavour = document.getElementById("previewFlavour");
      this.previewVariant = document.getElementById("previewVariant");
      this.previewQty = document.getElementById("previewQty");
      this.previewPrice = document.getElementById("previewPrice");

      this.previewVisualSelect = document.getElementById("previewVisualSelect");
      this.previewFlavourSelect = document.getElementById("previewFlavourSelect");
      this.previewProductVariantSelect = document.getElementById("previewProductVariantSelect");
      this.previewQtyInput = document.getElementById("previewQtyInput");
      this.previewImg = document.getElementById("previewImg");

      this.addToPrivateCartBtn = document.getElementById("addToPrivateCart");
      this.sendPrivateOrderBtn = document.getElementById("sendPrivateOrder");
      this.gdprCheckbox = document.getElementById("gdprPrivate");
      this.privateOrderList = document.getElementById("privateOrderList");
      this.messageBox = document.getElementById("privateOrderMessage");
      this.notesInput = document.getElementById("privateNotes");
    },

    /* -----------------------------
       INIT LEFT PANEL CATEGORIES
    ----------------------------- */
    initCategories() {
      this.leftPanel.innerHTML = "";
      Object.keys(JS3.data.products).forEach(catKey => {
        const catName = catKey.toUpperCase();
        const catItems = JS3.data.products[catKey];

        const catDiv = document.createElement("div");
        catDiv.style.marginBottom = "16px";

        const h4 = document.createElement("h4");
        h4.style.cursor = "pointer";
        h4.style.color = "#C9B46D";
        h4.style.fontWeight = "600";
        h4.innerText = catName;

        const prodGrid = document.createElement("div");
        prodGrid.className = "category-products";
        prodGrid.style.display = "none";

        catItems.forEach(prod => {
          const prodDiv = document.createElement("div");
          prodDiv.className = "product";
          prodDiv.innerHTML = `<h5>${prod.name}</h5><p>${prod.price} €</p>`;
          prodDiv.addEventListener("click", () => this.selectProduct(prod));
          prodGrid.appendChild(prodDiv);
        });

        h4.addEventListener("click", () => {
          this.leftPanel.querySelectorAll(".category-products").forEach(grid => {
            if (grid !== prodGrid) grid.style.display = "none";
            if (grid.previousElementSibling) grid.previousElementSibling.classList.remove("active");
          });
          const isVisible = prodGrid.style.display === "grid";
          prodGrid.style.display = isVisible ? "none" : "grid";
          h4.classList.toggle("active", !isVisible);
        });

        catDiv.appendChild(h4);
        catDiv.appendChild(prodGrid);
        this.leftPanel.appendChild(catDiv);
      });
    },

    /* -----------------------------
       INIT ROLLBOXES
    ----------------------------- */
    initRollboxes() {
      this.previewVisualSelect.innerHTML = JS3.data.visualVariants.map(v => `<option value="${v.name}">${v.name}</option>`).join("");
      this.previewFlavourSelect.innerHTML = JS3.data.flavourVariants.map(f => `<option value="${f.name}">${f.name}</option>`).join("");
      this.previewProductVariantSelect.innerHTML = JS3.data.productVariants.map(pv => `<option value="${pv}">${pv}</option>`).join("");
    },

    /* -----------------------------
       BIND EVENTS
    ----------------------------- */
    bindEvents() {
      this.previewVisualSelect.addEventListener("change", () => {
        if (!this.selectedProduct) return;
        this.selectedProduct.visual = this.previewVisualSelect.value;
        this.previewVisual.innerText = `Vizuál: ${this.selectedProduct.visual}`;
      });

      this.previewFlavourSelect.addEventListener("change", () => {
        if (!this.selectedProduct) return;
        this.selectedProduct.flavour = this.previewFlavourSelect.value;
        this.previewFlavour.innerText = `Príchuť: ${this.selectedProduct.flavour}`;
      });

      this.previewProductVariantSelect.addEventListener("change", () => {
        if (!this.selectedProduct) return;
        this.selectedProduct.variant = this.previewProductVariantSelect.value;
        this.previewVariant.innerText = `Variant: ${this.selectedProduct.variant}`;
      });

      this.previewQtyInput.addEventListener("input", () => {
        if (!this.selectedProduct) return;
        const qty = parseInt(this.previewQtyInput.value) || 1;
        this.selectedProduct.qty = qty;
        this.previewQty.innerText = `Počet: ${qty}`;
        this.previewPrice.innerText = `Cena: ${this.selectedProduct.price * qty} €`;
      });

      this.addToPrivateCartBtn.addEventListener("click", () => this.addToCart());
      this.sendPrivateOrderBtn.addEventListener("click", () => this.sendOrder());
    },

    /* -----------------------------
       SELECT PRODUCT
    ----------------------------- */
    selectProduct(prod) {
      this.selectedProduct = {
        ...prod,
        qty: 1,
        visual: JS3.data.visualVariants[0].name,
        flavour: JS3.data.flavourVariants[0].name,
        variant: JS3.data.productVariants[0]
      };

      this.previewName.innerText = prod.name;
      this.previewVisual.innerText = `Vizuál: ${this.selectedProduct.visual}`;
      this.previewFlavour.innerText = `Príchuť: ${this.selectedProduct.flavour}`;
      this.previewVariant.innerText = `Variant: ${this.selectedProduct.variant}`;
      this.previewQty.innerText = `Počet: 1`;
      this.previewPrice.innerText = `Cena: ${prod.price} €`;

      this.previewVisualSelect.value = this.selectedProduct.visual;
      this.previewFlavourSelect.value = this.selectedProduct.flavour;
      this.previewProductVariantSelect.value = this.selectedProduct.variant;

      if(this.previewImg) this.previewImg.src = prod.img || "";
    },

    /* -----------------------------
       ADD TO CART
    ----------------------------- */
    addToCart() {
      if (!this.selectedProduct) return alert("Vyberte produkt!");
      const cartItem = { ...this.selectedProduct };
      this.privateCart.push(cartItem);

      const itemDiv = document.createElement("div");
      itemDiv.className = "private-cart-item";
      itemDiv.innerHTML = `<span>${cartItem.name} | ${cartItem.variant} | ${cartItem.qty} ks | ${cartItem.price * cartItem.qty} €</span>
      <button>Odstrániť</button>`;
      itemDiv.querySelector("button").addEventListener("click", () => {
        const index = this.privateCart.indexOf(cartItem);
        if (index > -1) this.privateCart.splice(index, 1);
        itemDiv.remove();
      });

      this.privateOrderList.appendChild(itemDiv);
      this.messageBox.innerText = `${cartItem.name} pridaný do dopytu!`;
    },

    /* -----------------------------
       SEND ORDER
    ----------------------------- */
    sendOrder() {
      if (!this.gdprCheckbox.checked) { alert("Súhlas s GDPR je povinný."); return; }
      if (this.privateCart.length === 0) { alert("Žiadny produkt v dopyte!"); return; }

      const firstName = document.querySelector("input[name='firstName']").value;
      const lastName = document.querySelector("input[name='lastName']").value;
      const email = document.querySelector("input[name='email']").value;
      const phone = document.querySelector("input[name='phone']").value;
      const notes = this.notesInput.value;

      const orderDetails = this.privateCart.map(p =>
        `${p.name} | ${p.visual} | ${p.flavour} | ${p.variant} | ${p.qty} ks | ${p.price * p.qty} €`
      ).join("\n");

      const templateParams = { firstName, lastName, email, phone, notes, orderDetails };

      emailjs.send("service_skuvlfb", "template_xiqb34i", templateParams, "uBmaCJ5QxxC0LOY1W")
        .then(res => {
          this.messageBox.innerText = "Dopyt úspešne odoslaný!";
          this.privateCart = [];
          this.privateOrderList.innerHTML = "";
        })
        .catch(err => {
          this.messageBox.innerText = "Chyba pri odosielaní. Skúste znova.";
        });
    },

    /* -----------------------------
       SELECT FIRST PRODUCT
    ----------------------------- */
    selectFirstProduct() {
      const firstCatKey = Object.keys(JS3.data.products)[0];
      if (!firstCatKey) return;
      const firstProduct = JS3.data.products[firstCatKey][0];
      if (firstProduct) this.selectProduct(firstProduct);

      const firstCategoryHeader = this.leftPanel.querySelector("h4");
      const firstCategoryGrid = this.leftPanel.querySelector(".category-products");
      if (firstCategoryHeader && firstCategoryGrid) {
        firstCategoryGrid.style.display = "grid";
        firstCategoryHeader.classList.add("active");
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    JS3.modals.privateOrder.init();
  });

})();
