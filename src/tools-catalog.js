import "./style.css";
import { tools } from "./tools/index.js";

const toolsList = document.getElementById("toolsList");
const searchInput = document.getElementById("search");

function renderCatalog(filter = "") {
  toolsList.innerHTML = "";

  const allTools = Object.entries(tools).map(([key, tool]) => ({
    key,
    ...tool,
  }));

  const filteredTools = allTools.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  const toolsCountEl = document.getElementById("toolsCount");
  toolsCountEl.textContent = `${filteredTools.length} ferramenta(s) encontrada(s)`;

  const groupedByCategory = {};
  filteredTools.forEach((tool) => {
    const cat = tool.category || "Outros";
    if (!groupedByCategory[cat]) {
      groupedByCategory[cat] = [];
    }
    groupedByCategory[cat].push(tool);
  });

  const sortedCategories = Object.keys(groupedByCategory).sort();

  sortedCategories.forEach((category) => {
    const toolsInThisCategory = groupedByCategory[category].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    const section = document.createElement("section");
    section.innerHTML = `
    <h2 class="text-xl font-bold mb-4 mt-4">${category}</h2>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      ${toolsInThisCategory
        .map(
          (t) => `
            <li>
              <a
                href="/tool.html?slug=${t.key}"
                class="block bg-gray-800 p-3 rounded hover:bg-gray-700 transition-colors"
              >
                ${t.title}
              </a>
            </li>
          `
        )
        .join("")}
    </ul>
  `;

    toolsList.appendChild(section);
  });
}

searchInput.addEventListener("input", (e) => {
  renderCatalog(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
});
