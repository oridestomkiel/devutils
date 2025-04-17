import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const jsonpath_tester = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="space-y-6 text-sm text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div>
    <label class="block mb-1 font-medium">${t("label.json")}</label>
    <textarea id="jpJson" class="w-full h-40 p-2 font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" placeholder='{"menu": {"popup": {"menuitem": [{"value": "New"}]}}}'></textarea>
  </div>

  <div>
    <label class="block mb-1 font-medium">${t("label.path")}</label>
    <input id="jpPath" type="text" class="w-full p-2 font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" placeholder="$.menu.popup.menuitem[*].value" />
  </div>

  <div id="jpOutputWrapper" class="hidden mt-4">
    <label class="block text-sm mb-1 font-medium">${t("label.output")}</label>
    <pre id="jpOutput" class="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-xs whitespace-pre-wrap overflow-auto text-green-700 dark:text-green-400"></pre>
  </div>

  <div class="mt-8 border-t pt-4 text-xs text-gray-600 dark:text-gray-400">
    <h3 class="font-semibold mb-2">${t("label.help")}</h3>
    <div class="grid text-left grid-cols-[auto_1fr] gap-x-4 gap-y-2">
      <div><code>$</code></div><div>Objeto ou array raiz.</div>
      <div><code>@</code></div><div>Nó atual (para filtros).</div>
      <div><code>obj.prop</code></div><div>Acesso via ponto.</div>
      <div><code>['prop']</code></div><div>Acesso via colchete.</div>
      <div><code>..prop</code></div><div>Busca profunda.</div>
      <div><code>*</code></div><div>Todos os filhos (curinga).</div>
      <div><code>[n]</code></div><div>Item pelo índice (0-based).</div>
      <div><code>[n1,n2]</code></div><div>Vários índices.</div>
      <div><code>[start:end:step]</code></div><div>Fatiamento de array.</div>
      <div><code>?(expr)</code></div><div>Filtro booleano.</div>
      <div><code>(expr)</code></div><div>Script JS dentro da expressão.</div>
    </div>
  </div>
</div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;
    const $ = (id) => document.getElementById(id);

    import("/public/vendor/jsonpath-min.js")
      .then(({ JSONPath }) => {
        const update = () => {
          const jsonRaw = $("jpJson").value.trim();
          const path = $("jpPath").value.trim();
          const output = $("jpOutput");
          const wrapper = $("jpOutputWrapper");

          try {
            const json = JSON.parse(jsonRaw);
            const result = JSONPath({ path, json });
            output.textContent = JSON.stringify(result, null, 2);
          } catch (err) {
            output.textContent = `❌ ${t("error")}: ${err.message}`;
          }

          wrapper.classList.remove("hidden");
        };

        $("jpJson").addEventListener("input", update);
        $("jpPath").addEventListener("input", update);
      })
      .catch((err) => {
        console.error("Erro ao carregar JSONPath:", err);
        $("jpOutput").textContent = `❌ ${t("error")}: ${err.message}`;
        $("jpOutputWrapper").classList.remove("hidden");
      });
  },
};

export default jsonpath_tester;
