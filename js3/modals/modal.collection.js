// =========================================================
// JS3 MODAL COLLECTION MODULE – plná integrácia s CSS
// =========================================================
window.JS3 = window.JS3 || {};
JS3.modals = JS3.modals || {};
JS3.store = JS3.store || {};
JS3.store.cart = JS3.store.cart || {};
JS3.store.wishlist = JS3.store.wishlist || { addToWishlist: (item) => console.log("Added to wishlist", item) };

/* ==============================
   CART – LOCAL STORAGE CORE
============================== */
JS3.store.cart.addToCart = function(item){
    if(!item) return;

    const cartKey = "ln_cart";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const variant = document.getElementById("variantSelect")?.value || "Klasik";
    const visual = document.getElementById("visualSelect")?.value || "classic";

    const existing = cart.find(p =>
        p.id === item.id &&
        p.variant === variant &&
        p.visual === visual
    );

    if(existing){
        existing.qty += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            variant,
            visual,
            qty: 1
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    document.dispatchEvent(new Event("js3:cart:updated"));
    console.log("🛒 Added to cart:", item.name);
};

JS3.modals.collection = (function(){

    // ==========================
    // COLLECTION DATA
    // ==========================
    const collectionData = [];
    if(JS3.data && JS3.data.products){
        ["kids","special","events","abstract","mini"].forEach(cat=>{
            if(Array.isArray(JS3.data.products[cat])){
                collectionData.push(...JS3.data.products[cat].slice(0,5));
            }
        });
    }

    const self = {};
    self.collectionData = collectionData;

    // ==========================
    // MODAL ELEMENTS
    // ==========================
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const closeBtn = document.getElementById('modalCloseBtn');
    const modalUVBtn = document.getElementById('modalUVBtn');
    const modalCartBtn = document.getElementById('modalCartBtn');
    const modalWishlistBtn = document.getElementById('modalWishlistBtn');

    let currentItem = null;
    let uvActive = false;

    // ==========================
    // EPHEMERAL
    // ==========================
    function showEphemeral(text){
        const el = document.createElement('div');
        el.className = 'ephemeral';
        el.textContent = text;
        document.body.appendChild(el);
        setTimeout(()=> el.style.opacity = 1, 10);
        setTimeout(()=>{
            el.style.opacity = 0;
            setTimeout(()=> el.remove(), 400);
        }, 1600);
    }

    // ==========================
    // MODAL CONTROL
    // ==========================
    self.openModal = function(item){
        if(!item) return;
        currentItem = item;
        uvActive = false;

        modal.style.display = 'flex';
        modalImg.src = item.image;
        modalName.textContent = item.name;
        modalDesc.textContent = item.description;
        modalPrice.textContent = item.price + "€";
    };

    function closeModal(){
        modal.style.display = 'none';
    }

    function toggleUV(){
        if(!currentItem) return;
        uvActive = !uvActive;
        if(currentItem.uvImage){
            modalImg.src = uvActive ? currentItem.uvImage : currentItem.image;
        } else {
            showEphemeral("UV verzia nie je dostupná");
        }
    }

    // ==========================
    // INIT
    // ==========================
    self.init = function(){
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e=>{ if(e.target === modal) closeModal(); });
        modalUVBtn.addEventListener('click', toggleUV);

        modalCartBtn.addEventListener('click', ()=>{
            JS3.store.cart.addToCart(currentItem);
            showEphemeral("Pridané do košíka");
        });

        modalWishlistBtn.addEventListener('click', ()=>{
            JS3.store.wishlist.addToWishlist(currentItem);
            showEphemeral("Pridané do wishlistu");
        });

        document.addEventListener('keydown', e=>{
            if(e.key === 'Escape') closeModal();
        });
    };

    return self;

})();

document.addEventListener('DOMContentLoaded', ()=>JS3.modals.collection.init());
