import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const curl_to_code_converter = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-900 dark:text-white">
      <label class="block mb-1">${t("label.curl")}</label>
      <textarea
        id="curlInput"
        class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 font-mono"
        placeholder="${t("placeholder.curl")}"
      ></textarea>

      <div class="flex items-center justify-between gap-2">
        <label class="block">${t("label.language")}</label>
        <select
          id="langSelect"
          class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="ansible">Ansible</option>
          <option value="csharp">C#</option>
          <option value="dart">Dart</option>
          <option value="elixir">Elixir</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript (fetch)</option>
          <option value="kotlin">Kotlin</option>
          <option value="lua">Lua</option>
          <option value="node">Node.js</option>
          <option value="objc">Objective-C</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="python">Python (requests)</option>
          <option value="r">R</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="swift">Swift</option>
          <option value="wget">Wget</option>
        </select>
      </div>

      <button
        id="btnConvertCurl"
        class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      >
        ${t("button.convert")}
      </button>

      <div>
        <label class="block mb-1">${t("label.output")}</label>
        <textarea
          id="curlCodeOutput"
          readonly
          class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 h-40 font-mono"
        ></textarea>
        <button
          id="btnCopyCurlCode"
          class="mt-2 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        >
          ${tGlobal("copy")}
        </button>
      </div>
    </div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("curlInput");
    const output = document.getElementById("curlCodeOutput");
    const btn = document.getElementById("btnConvertCurl");
    const copy = document.getElementById("btnCopyCurlCode");
    const lang = document.getElementById("langSelect");

    btn.onclick = async () => {
      const command = input.value.trim();
      const selected = lang.value;

      if (!command.startsWith("curl ")) {
        output.value = `// ${t("error.invalid")}`;
        return;
      }

      try {
        const res = await fetch("https://services.devutils.tools/curl2code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ curl: command, lang: selected }),
        });

        const data = await res.json();
        output.value = data.code || `// ${t("error.empty")}`;
      } catch (err) {
        output.value = `// ${t("error.failed")}: ${err.message}`;
      }
    };

    copy.onclick = () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copy.innerText;
        copy.innerText = tGlobal("copied");
        setTimeout(() => (copy.innerText = original), 1500);
      });
    };
  },
};

export default curl_to_code_converter;
