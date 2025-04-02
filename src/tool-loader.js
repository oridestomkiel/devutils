import "./style.css";
import { tools } from "./tools/index.js";

const container = document.getElementById("toolContainer");
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");
const tool = tools[slug];

if (!tool) {
  document.title = "Ferramenta não encontrada - DevUtils";
  container.innerHTML = `<p class="text-red-500">❌ Ferramenta <strong>${slug}</strong> não encontrada.</p>`;
} else {
  document.title = `${tool.title} - DevUtils`;
  const meta = document.createElement("meta");
  meta.name = "description";
  meta.content = tool.description || tool.title;
  document.head.appendChild(meta);

  container.innerHTML = ""; // limpa tudo

  setupAddToHomeButton(slug, tool.title);

  const section = document.createElement("section");
  section.className = "mt-6";

  const card = document.createElement("div");
  card.className = "bg-gray-800 p-4 rounded-xl shadow";

  card.innerHTML = `
    <p class="text-gray-400 mb-2">${tool.description || ""}</p>
    <div class="mt-6">${tool.render()}</div>  
    <div class="text-sm text-gray-500 mt-6">
      <strong>Tags:</strong> ${(tool.tags || []).join(", ")}<br/>
      <strong>Categoria:</strong> ${tool.category || "Outros"} | 
      <strong>Autor:</strong> ${tool.author || "devutils"}
    </div>
    <div class="mt-4">
      <button id="showSourceBtn" class="text-sm text-blue-400 hover:underline">
        Ver código-fonte do módulo
      </button>
      <div id="sourceContainer" class="mt-2 hidden border border-gray-700 rounded">
        <div class="relative bg-gray-800 rounded-t" style="height: 25px">
          <span id="copiadoMsg" class="text-green-400 absolute right-2 top-1 hidden">Copiado!</span>
          <button id="copiarBtn" class="absolute right-2 top-1 text-blue-400 hover:underline">Copiar código</button>
        </div>
        <pre class="line-numbers bg-gray-900 rounded-b text-xs">
          <code id="sourceCode" class="language-javascript block p-4 text-green-400 font-mono whitespace-pre-wrap"></code>
        </pre>
      </div>
    </div>
  `;

  section.appendChild(card);
  container.appendChild(section);
  tool.init?.();
  setupSourceViewer(slug);
}

function setupSourceViewer(slug) {
  const showBtn = document.getElementById("showSourceBtn");
  const container = document.getElementById("sourceContainer");
  const copiarBtn = document.getElementById("copiarBtn");
  const msg = document.getElementById("copiadoMsg");

  let carregado = false;

  showBtn.addEventListener("click", async () => {
    const isHidden = container.classList.contains("hidden");

    if (isHidden) {
      container.classList.remove("hidden");
      showBtn.textContent = "Ocultar código-fonte do módulo";

      if (!carregado) {
        const filePath = `/assets/tools/${slug}.js`;
        try {
          const res = await fetch(filePath);
          if (!res.ok) throw new Error("Erro ao carregar código");

          await Promise.all([
            loadCSS(
              "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css"
            ),
            loadCSS(
              "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.css"
            ),
            loadScript(
              "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
            ),
            loadScript(
              "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"
            ),
            loadScript(
              "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js"
            ),
          ]);

          const code = await res.text();
          const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          document.getElementById("sourceCode").innerHTML = escaped;
          Prism.highlightAll();

          carregado = true;
        } catch (err) {
          document.getElementById("sourceCode").textContent =
            "Erro ao carregar o código.";
        }
      }
    } else {
      container.classList.add("hidden");
      showBtn.textContent = "Ver código-fonte do módulo";
    }
  });

  copiarBtn.addEventListener("click", () => {
    const code = document.getElementById("sourceCode").textContent;
    navigator.clipboard.writeText(code).then(() => {
      copiarBtn.classList.add("hidden");
      msg.classList.remove("hidden");
      setTimeout(() => {
        copiarBtn.classList.remove("hidden");
        msg.classList.add("hidden");
      }, 2000);
    });
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = resolve;
    l.onerror = reject;
    document.head.appendChild(l);
  });
}

function setupAddToHomeButton(slug, title) {
  const prefs = JSON.parse(localStorage.getItem("devutils_prefs") || "{}");
  const order = prefs.order || [];
  const enabled = prefs.enabled || {};

  const btn = document.createElement("button");
  btn.innerHTML = `➕ Adicionar à Home`;
  btn.className =
    "absolute top-2 right-2 bg-green-600 hover:bg-green-700 px-2 py-1 text-xs rounded";
  btn.style.zIndex = 10;

  if (enabled[slug]) {
    btn.innerHTML = `✅ Na Home`;
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-default");
  }

  btn.addEventListener("click", () => {
    if (!order.includes(slug)) {
      // Adiciona no final do bloco de ativos
      let lastActiveIndex = order.reduce((last, key, i) => {
        return enabled[key] ? i : last;
      }, -1);

      order.splice(lastActiveIndex + 1, 0, slug);
    }

    enabled[slug] = true;

    localStorage.setItem("devutils_prefs", JSON.stringify({ order, enabled }));

    btn.innerHTML = `✅ Adicionado!`;
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-default");
  });

  const header = document.createElement("div");
  header.className = "relative";
  header.appendChild(btn);

  const toolContainer = document.getElementById("toolContainer");
  const titleEl = document.createElement("h1");
  titleEl.className = "text-2xl font-bold mb-4";
  titleEl.textContent = title;

  toolContainer.innerHTML = ""; // limpa
  toolContainer.appendChild(header);
  toolContainer.appendChild(titleEl);
}
