import "./style.css";
import { tools } from "./tools/index.js";

const container = document.getElementById("cardContainer");
const list = document.getElementById("sortable");

const defaultEnabled = [
  "geradordecnpj",
  "cpf",
  "jsonformatter",
  "passwordgen",
  "jwtviewer",
];

const localPrefs = localStorage.getItem("devutils_prefs");
let prefs;

if (!localPrefs) {
  const allTools = Object.keys(tools);
  const remainingTools = allTools.filter((k) => !defaultEnabled.includes(k));
  const initialOrder = [...defaultEnabled, ...remainingTools];

  prefs = {
    order: initialOrder,
    enabled: Object.fromEntries(
      allTools.map((k) => [k, defaultEnabled.includes(k)])
    ),
  };
} else {
  prefs = JSON.parse(localPrefs);

  const allTools = Object.keys(tools);
  allTools.forEach((key) => {
    if (!prefs.order.includes(key)) prefs.order.push(key);
    if (!(key in prefs.enabled)) prefs.enabled[key] = false;
  });
}

Object.keys(tools).forEach((key) => {
  if (!prefs.order.includes(key)) prefs.order.push(key);
  if (!(key in prefs.enabled)) prefs.enabled[key] = false;
});

function savePrefs() {
  localStorage.setItem("devutils_prefs", JSON.stringify(prefs));
  renderCards();
}

function renderCards() {
  container.innerHTML = "";
  prefs.order.forEach((key) => {
    if (prefs.enabled[key] && tools[key]) {
      const tool = tools[key];
      const card = document.createElement("div");
      card.className = "bg-gray-800 p-4 rounded-xl shadow relative";
      const slug = tool.slug || key;
      card.innerHTML = `
        <a href="/tool.html?slug=${slug}" class="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300">
          🔗
        </a>
        <h2 class="text-lg font-semibold mb-2">${tool.title}</h2>
        ${tool.render()}
      `;
      container.appendChild(card);
      tool.init?.();
    }
  });
}

renderCards();

let sortableLoaded = false;

async function renderSidebarList(filter = "") {
  list.innerHTML = "";

  const ordered = [...prefs.order].sort((a, b) => {
    const aChecked = prefs.enabled[a] ? 0 : 1;
    const bChecked = prefs.enabled[b] ? 0 : 1;
    return aChecked - bChecked;
  });

  ordered.forEach((tool) => {
    const mod = tools[tool];
    if (!mod) return;

    if (filter && !mod.title.toLowerCase().includes(filter.toLowerCase()))
      return;

    const li = document.createElement("li");
    li.className = "bg-gray-700 p-2 rounded cursor-move";

    li.setAttribute("data-id", tool);
    li.innerHTML = `
    <div class="flex items-center gap-3 w-full justify-between">
      <span class="text-gray-400 cursor-grab select-none">☰</span>
      <label class="flex items-center gap-2 flex-1 justify-between cursor-pointer">
        <span class="flex-1 text-white">${mod.title}</span>
        <input type="checkbox" class="form-checkbox h-5 w-5" ${
          prefs.enabled[tool] ? "checked" : ""
        } />
      </label>
    </div>
  `;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("click", (e) => e.stopPropagation());
    checkbox.addEventListener("change", (e) => {
      prefs.enabled[tool] = e.target.checked;
      savePrefs();
      renderSidebarList(searchInput.value);
    });

    list.appendChild(li);
  });

  if (!sortableLoaded) {
    await import(
      "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"
    );
    sortableLoaded = true;
  }

  new Sortable(list, {
    animation: 150,
    handle: ".cursor-grab",
    onEnd: () => {
      const newOrder = Array.from(
        document.querySelectorAll("#sortable li")
      ).map((li) => li.getAttribute("data-id"));
      prefs.order = newOrder;
      savePrefs();
    },
  });

  document.getElementById("countTotal").textContent = prefs.order.length;
  document.getElementById("countOn").textContent = Object.values(
    prefs.enabled
  ).filter(Boolean).length;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderSidebarList(e.target.value);
});

renderSidebarList();

let toggleState = true;

document.getElementById("toggleAllBtn").addEventListener("click", () => {
  const newEnabled = toggleState;
  prefs.order.forEach((tool) => {
    prefs.enabled[tool] = newEnabled;
  });

  toggleState = !toggleState;
  document.getElementById("toggleAllBtn").textContent = newEnabled
    ? "Desmarcar todos"
    : "Selecionar todos";

  savePrefs();
  renderSidebarList(document.getElementById("searchInput").value);
});

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  renderSidebarList(value);
  clearSearchBtn.style.display = value ? "block" : "none";
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.style.display = "none";
  renderSidebarList();
});

document.getElementById("backupBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(prefs, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "devutils-prefs.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importPrefsInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported.order || !imported.enabled) {
        alert("Arquivo inválido");
        return;
      }
      prefs = imported;
      savePrefs();
      renderSidebarList();
    } catch (err) {
      alert("Erro ao importar configurações.");
    }
  };
  reader.readAsText(file);
});

document.getElementById("resetPrefsBtn").addEventListener("click", () => {
  const confirmReset = confirm(
    "Tem certeza que deseja resetar todas as configurações?"
  );
  if (confirmReset) {
    localStorage.removeItem("devutils_prefs");
    location.reload();
  }
});
