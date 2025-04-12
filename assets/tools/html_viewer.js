import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const html_viewer = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.2",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
    <div class="p-4 bg-gray-100 dark:bg-gray-800 text-sm space-y-4 text-gray-800 dark:text-white rounded">
      <div class="flex flex-wrap gap-2">
        <button id="btnSample" class="bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded">${t(
          "example"
        )}</button>
        <button id="btnClear" class="bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded">${tGlobal(
          "clear"
        )}</button>
        <button id="btnFormat" class="bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded">${t(
          "format"
        )}</button>
        <button id="btnCopiarHTML" class="bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded">${tGlobal(
          "copy"
        )}</button>
      </div>

      <div class="relative border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
        <div id="editor" class="min-h-[200px] bg-white dark:bg-gray-900 text-black dark:text-white p-2"></div>
        <div id="editorPlaceholder" class="absolute top-0 left-8 p-2 text-gray-500 pointer-events-none select-none">
          &lt;!-- ${t("placeholder")} --&gt;
        </div>
      </div>

      <iframe id="previewHTML" class="w-full h-96 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hidden"></iframe>
    </div>
    `;
  },

  async init() {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
      });

    const loadCSS = (href) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    };

    loadCSS("./vendor/codemirror.css");
    loadCSS("./vendor/material-darker.css");

    await loadScript("./vendor/codemirror.min.js");
    await loadScript("./vendor/htmlmixed.js");
    await loadScript("./vendor/xml.min.js");
    await loadScript("./vendor/javascript.min.js");
    await loadScript("./vendor/css.min.js");
    await loadScript("./vendor/closetag.min.js");
    await loadScript("./vendor/beautify-html.min.js");

    const cm = window.CodeMirror(document.getElementById("editor"), {
      mode: "htmlmixed",
      theme: "material-darker",
      lineNumbers: true,
      autoCloseTags: true,
      value: "",
    });

    const iframe = document.getElementById("previewHTML");
    const placeholder = document.getElementById("editorPlaceholder");

    const updatePreview = () => {
      const html = cm.getValue().trim();
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const isEmpty = html === "";

      placeholder.style.display = isEmpty ? "block" : "none";

      if (!isEmpty) {
        iframe.classList.remove("hidden");
        doc.open();
        doc.write(html);
        doc.close();
      } else {
        iframe.classList.add("hidden");
      }
    };

    cm.on("change", updatePreview);
    updatePreview();

    document.getElementById("btnSample").onclick = () => {
      cm.setValue(`<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: blue; }
  </style>
</head>
<body>
  <h1>Olá do DevUtils!</h1>
  <p>Este é um exemplo básico de HTML renderizado ao vivo.</p>
</body>
</html>`);
    };

    document.getElementById("btnClear").onclick = () => {
      cm.setValue("");
    };

    document.getElementById("btnFormat").onclick = () => {
      const formatted = window.html_beautify(cm.getValue(), {
        indent_size: 2,
        max_preserve_newlines: 0,
      });
      cm.setValue(formatted.trim());
    };

    document.getElementById("btnCopiarHTML").onclick = () => {
      navigator.clipboard.writeText(cm.getValue()).then(() => {
        const btn = document.getElementById("btnCopiarHTML");
        btn.textContent = tGlobal("copied");
        setTimeout(() => (btn.textContent = tGlobal("copy")), 1500);
      });
    };
  },
};

export default html_viewer;
