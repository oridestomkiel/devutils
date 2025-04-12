import{l as e,b as t,i as n}from"./include-partial-062af8a1.js";import{t as o}from"./index-97e4faf8.js";function r(e){return new Promise(((t,n)=>{const o=document.createElement("script");o.src=e,o.onload=t,o.onerror=n,document.body.appendChild(o)}))}function d(e){return new Promise(((t,n)=>{const o=document.createElement("link");o.rel="stylesheet",o.href=e,o.onload=t,o.onerror=n,document.head.appendChild(o)}))}(async()=>{var a,i,s,l,c,u,m;const g=(null==(a=window.getDevutilsLang)?void 0:a.call(window))||"en";await e(g);const p={headTitle:"tool.head.title",metaDescription:"tool.head.description",ogTitle:"tool.head.title",ogDescription:"tool.head.description",twitterTitle:"tool.head.title",twitterDescription:"tool.head.description"};for(const[e,n]of Object.entries(p)){const o=document.getElementById(e);if(!o)continue;const r=t(n);r&&("TITLE"===o.tagName?o.textContent=r:o.setAttribute("content",r))}await n("header-placeholder","/devutils/partials/header.html"),await n("footer-placeholder","/devutils/partials/footer.html"),await n("mobileMenu","/devutils/partials/mobile-menu.html");const h=document.getElementById("toolContainer"),b=new URLSearchParams(window.location.search).get("slug"),v=o[b];if(!v)return document.title=t("tool.notFoundTitle"),void(h.innerHTML=`<p class="text-red-600 dark:text-red-400">${t("tool.notFound").replace("{slug}",b)}</p>`);v.slug=b,v.loadI18n&&await v.loadI18n();const y=(null==(i=v.i18n)?void 0:i.title)||v.title,x=(null==(s=v.i18n)?void 0:s.description)||v.description||"";document.title=`${y} - DevUtils`;const w=document.createElement("meta");w.name="description",w.content=x,document.head.appendChild(w),h.innerHTML="",function(e,n){const o=JSON.parse(localStorage.getItem("devutils_prefs")||"{}"),r=o.order||[],d=o.enabled||{},a=document.createElement("button");a.innerHTML=`➕ ${t("addToHome")}`,a.className="absolute top-2 right-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-2 py-1 text-xs rounded shadow",a.style.zIndex=10,d[e]&&(a.innerHTML=`✅ ${t("inHome")}`,a.disabled=!0,a.classList.add("opacity-50","cursor-default"));a.addEventListener("click",(()=>{if(!r.includes(e)){const t=r.reduce(((e,t,n)=>d[t]?n:e),-1);r.splice(t+1,0,e)}d[e]=!0,localStorage.setItem("devutils_prefs",JSON.stringify({order:r,enabled:d})),a.innerHTML=`✅ ${t("added")}`,a.disabled=!0,a.classList.add("opacity-50","cursor-default")}));const i=document.createElement("div");i.className="relative",i.appendChild(a);const s=document.getElementById("toolContainer"),l=document.createElement("h1");l.className="text-2xl font-bold mb-4 text-gray-900 dark:text-white",l.textContent=n,s.innerHTML="",s.appendChild(i),s.appendChild(l)}(b,y);const f=document.createElement("section");f.className="mt-6";const E=document.createElement("div");E.className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white p-4 rounded-xl shadow",E.innerHTML=`\n    <p class="text-gray-700 dark:text-gray-400 mb-2">${x}</p>\n    <div class="mt-6">${v.render()}</div>  \n    <div class="text-sm text-gray-600 dark:text-gray-400 mt-6">\n      <strong>${t("tags")}:</strong> ${((null==(l=v.i18n)?void 0:l.tags)||v.tags||[]).join(", ")}<br/>\n      <strong>${t("category")}:</strong> ${(null==(c=v.i18n)?void 0:c.category)||v.category||t("other")} |\n      <strong>${t("author")}:</strong> ${(null==(u=v.i18n)?void 0:u.author)||v.author||"devutils"}\n    </div>\n    <div class="mt-4">\n      <button id="showSourceBtn" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">\n        ${t("viewSource")}\n      </button>\n      <div id="sourceContainer" class="mt-2 hidden border border-gray-300 dark:border-gray-700 rounded">\n        <div class="relative bg-gray-100 dark:bg-gray-800 rounded-t" style="height: 25px">\n          <span id="copiadoMsg" class="text-green-600 dark:text-green-400 absolute right-2 top-1 hidden">${t("copied")}</span>\n          <button id="copiarBtn" class="absolute right-2 top-1 text-blue-600 dark:text-blue-400 hover:underline">${t("copy")}</button>\n        </div>\n        <pre class="line-numbers bg-gray-200 dark:bg-gray-900 rounded-b text-xs">\n          <code id="sourceCode" class="language-javascript block p-4 text-green-700 dark:text-green-400 font-mono whitespace-pre-wrap"></code>\n        </pre>\n      </div>\n    </div>\n  `,f.appendChild(E),h.appendChild(f),null==(m=v.init)||m.call(v),function(e){const n=document.getElementById("showSourceBtn"),o=document.getElementById("sourceContainer"),a=document.getElementById("copiarBtn"),i=document.getElementById("copiadoMsg");let s=!1;n.addEventListener("click",(async()=>{if(o.classList.contains("hidden")){if(o.classList.remove("hidden"),n.textContent=t("hideSource"),!s){const n=`/assets/tools/${e}.js`;try{const e=await fetch(n);if(!e.ok)throw new Error("loadError");await Promise.all([d("/vendor/prism.min.css"),r("/vendor/prism.min.js")]);const t=(await e.text()).trim().replace(/</g,"&lt;").replace(/>/g,"&gt;");document.getElementById("sourceCode").innerHTML=t,Prism.highlightAll(),s=!0}catch(a){document.getElementById("sourceCode").textContent=t("loadError")}}}else o.classList.add("hidden"),n.textContent=t("viewSource")})),a.addEventListener("click",(()=>{const e=document.getElementById("sourceCode").textContent;navigator.clipboard.writeText(e).then((()=>{a.classList.add("hidden"),i.classList.remove("hidden"),setTimeout((()=>{a.classList.remove("hidden"),i.classList.add("hidden")}),2e3)}))}))}(b)})();
