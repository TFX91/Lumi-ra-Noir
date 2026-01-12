if(!window.JS3) window.JS3 = {};
if(!JS3.effects) JS3.effects = {};

JS3.effects.ambient = (function(){

  const logo = document.querySelector(".logo");
  const UV_KEY = "ln_uv";
  let uvMode = localStorage.getItem(UV_KEY) === "true";

  if(uvMode) document.body.classList.add("uv");

  if(logo){
    logo.addEventListener("click", () => {
      uvMode = !uvMode;
      document.body.classList.toggle("uv", uvMode);
      localStorage.setItem(UV_KEY, uvMode);
    });

    let pulse = false;
    setInterval(() => {
      pulse = !pulse;
      logo.style.transform = pulse ? "scale(1.08) rotate(-1deg)" : "scale(1) rotate(0deg)";
      logo.style.textShadow = pulse ? "0 0 16px var(--uv),0 0 28px var(--uv)" : "0 0 0 transparent";
    }, 1500);
  }

  return {
    init: function(){
      console.log("JS3 ambient effects ready");
    }
  };

})();
