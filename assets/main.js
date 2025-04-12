import{t as e,l as t,i as n}from"./include-partial-55fcdce0.js";import{_ as a,t as r}from"./index-06da1cfd.js";function o(e){const t=document.getElementById("countTotal"),n=document.getElementById("countOn");t&&n&&(t.textContent=e.order.length,n.textContent=Object.values(e.enabled).filter(Boolean).length)}async function l(t,n,d,s=""){d.innerHTML="";[...t.order].sort(((e,n)=>(t.enabled[e]?0:1)-(t.enabled[n]?0:1))).forEach((a=>{const i=r[a];if(!i)return;const c=e(a,"title")||i.title;if(s&&!c.toLowerCase().includes(s.toLowerCase()))return;const u=document.createElement("li");u.className="bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-move border border-gray-300 dark:border-gray-600",u.setAttribute("data-id",a),u.innerHTML=`\n      <div class="flex items-center gap-3 w-full justify-between">\n        <span class="text-gray-500 dark:text-gray-400 cursor-grab select-none">☰</span>\n        <label class="flex items-center gap-2 flex-1 justify-between cursor-pointer">\n          <span class="flex-1 text-gray-900 dark:text-white">${c}</span>\n          <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400" ${t.enabled[a]?"checked":""} />\n        </label>\n      </div>\n    `;const g=u.querySelector("input");g.addEventListener("click",(e=>e.stopPropagation())),g.addEventListener("change",(e=>{t.enabled[a]=e.target.checked,o(t),n(),l(t,n,d,s)})),d.appendChild(u)})),window.sortableLoaded||(await a((()=>import("https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js")),[]),window.sortableLoaded=!0),new Sortable(d,{animation:150,handle:".cursor-grab",onEnd:()=>{const e=Array.from(document.querySelectorAll("#sortable li")).map((e=>e.getAttribute("data-id")));t.order=e,n()}})}(async()=>{var a;const d=(null==(a=window.getDevutilsLang)?void 0:a.call(window))||"en";await t(d);const s=window.tGlobal,i=document.getElementById("cardContainer"),c=JSON.parse(localStorage.getItem("devutils_expanded")||"{}"),u="pt"===d?["gerador_de_cnpj","gerador_de_cpf","advanced_jwt_viewer","json_formatter","random_password_generator"]:["advanced_jwt_viewer","json_formatter","random_password_generator","image_to_base64_converter","uuid_generator"],g=Object.keys(r),m=localStorage.getItem("devutils_prefs");let b;if(m){b=JSON.parse(m),g.forEach((e=>{b.order.includes(e)||b.order.push(e),e in b.enabled||(b.enabled[e]=!1)}));if(!Object.entries(b.enabled).some((([e,t])=>t&&r[e]))){console.warn("⚠️ Nenhuma ferramenta habilitada válida encontrada. Aplicando padrão do idioma.");const e=g.filter((e=>!u.includes(e))),t=[...u,...e];b={order:t,enabled:Object.fromEntries(g.map((e=>[e,u.includes(e)])))}}}else{const e=g.filter((e=>!u.includes(e))),t=[...u,...e];b={order:t,enabled:Object.fromEntries(g.map((e=>[e,u.includes(e)])))},localStorage.setItem("devutils_prefs",JSON.stringify(b))}function p(){localStorage.setItem("devutils_prefs",JSON.stringify(b)),v()}function f(e,t,n){const a=["","col-span-2","col-span-3"],r=c[t]||"",o=a.indexOf(r),l=a[(o+1)%a.length];a.filter(Boolean).forEach((t=>e.classList.remove(t))),l&&e.classList.add(l),c[t]=l,localStorage.setItem("devutils_expanded",JSON.stringify(c)),n.textContent="col-span-3"===l?"🡼":"⛶"}async function v(){var t,n;i.innerHTML="";for(const a of b.order)if(b.enabled[a]&&r[a]){const o=r[a],l=(null==(t=o.slug)?void 0:t.trim())||a;if(!l){console.warn("⚠️ Ferramenta com slug inválido encontrada:",o);continue}o.loadI18n&&await o.loadI18n();const d=document.createElement("div");d.setAttribute("data-slug",l),d.className="tool-card transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg relative";const s=c[l];s&&d.classList.add(s),d.innerHTML=`\n          <div class="absolute right-2 top-2 flex gap-1">\n            <button class="resize-btn text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">\n              ${"col-span-3"===s?"🡼":"⛶"}\n            </button>\n            <a href="/tool.html?slug=${l}" class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">\n              🔗\n            </a>\n          </div>\n          <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">${e(l,"title")}</h2>\n          ${o.render()}\n        `,i.appendChild(d);const u=d.querySelector(".resize-btn");null==u||u.addEventListener("click",(()=>f(d,l,u))),null==(n=o.init)||n.call(o)}}v(),window.expandCard=(e,t)=>{const n=e.closest(".tool-card");n&&f(n,t,e)};const y={headTitle:"head.title",metaDescription:"head.description",ogTitle:"head.title",ogDescription:"head.description",twitterTitle:"head.title",twitterDescription:"head.description"};for(const[e,t]of Object.entries(y)){const n=document.getElementById(e),a=s(t);n&&a&&("TITLE"===n.tagName?n.textContent=a:n.setAttribute("content",a))}await n("header-placeholder","/partials/header.html"),await n("footer-placeholder","/partials/footer.html"),await n("sidebar-placeholder","/partials/sidebar.html"),await n("mobileMenu","/partials/mobile-menu.html"),document.getElementById("settings-btn").classList.remove("hidden");const h=setInterval((()=>{const e=document.getElementById("sortable");e&&(clearInterval(h),l(b,p,e),function(e,t){var n,a,r,d,s;const i=document.getElementById("searchInput"),c=document.getElementById("clearSearchBtn"),u=document.getElementById("sortable");null==(n=document.getElementById("menuBtn"))||n.addEventListener("click",(()=>{document.getElementById("mobileMenu").classList.toggle("hidden")})),window.toggleSidebar=function(){const t=document.getElementById("sidebar");t.classList.toggle("translate-x-full"),t.classList.contains("translate-x-full")||(setTimeout((()=>{var e;null==(e=document.getElementById("searchInput"))||e.focus()}),300),o(e))};let g=Object.values(e.enabled).some((e=>!e));null==(a=document.getElementById("toggleAllBtn"))||a.addEventListener("click",(()=>{const n=g;e.order.forEach((t=>{e.enabled[t]=n})),g=!g,document.getElementById("toggleAllBtn").textContent=n?"Desmarcar todos":"Selecionar todos",t(),l(e,t,u,i.value)})),null==i||i.addEventListener("input",(n=>{const a=n.target.value;l(e,t,u,a),c.style.display=a?"block":"none"})),null==c||c.addEventListener("click",(()=>{i.value="",c.style.display="none",l(e,t,u)})),null==(r=document.getElementById("backupBtn"))||r.addEventListener("click",(()=>{const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(t),a=document.createElement("a");a.href=n,a.download="devutils-prefs.json",a.click(),URL.revokeObjectURL(n)})),null==(d=document.getElementById("importPrefsInput"))||d.addEventListener("change",(n=>{const a=n.target.files[0];if(!a)return;const r=new FileReader;r.onload=()=>{try{const n=JSON.parse(r.result);if(!n.order||!n.enabled)return void alert("Arquivo inválido");Object.assign(e,n),t(),l(e,t,u)}catch(n){alert("Erro ao importar configurações.")}},r.readAsText(a)})),null==(s=document.getElementById("resetPrefsBtn"))||s.addEventListener("click",(()=>{confirm("Tem certeza que deseja resetar todas as configurações?")&&(localStorage.removeItem("devutils_prefs"),localStorage.removeItem("devutils_expanded"),location.reload())}))}(b,p))}),50)})();
