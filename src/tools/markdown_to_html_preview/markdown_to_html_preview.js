import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const markdown_live_editor = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
<div class="flex flex-col md:flex-row gap-4 h-[75vh]">
  <div class="w-full md:w-1/2 flex flex-col">
    <div class="flex justify-between items-center mb-2">
      <label class="text-sm font-medium">${t("label.markdown")}</label>
      <div class="space-x-2">
        <button id="btnResetMd" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600">${tGlobal(
          "reset"
        )}</button>
        <button id="btnCopyMdRaw" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600">${tGlobal(
          "copy"
        )}</button>
      </div>
    </div>
    <div id="mdEditor" class="flex-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 overflow-hidden"></div>
  </div>

  <div class="w-full md:w-1/2 flex flex-col">
    <div class="flex justify-between items-center mb-2">
      <label class="text-sm font-medium">${t("label.preview")}</label>
      <label class="inline-flex items-center gap-1 text-xs">
        <input type="checkbox" id="mdScrollSync" />
        ${t("label.scrollSync")}
      </label>
    </div>
    <div id="mdPreview" class="markdown-body border border-gray-300 dark:border-gray-700 rounded p-4 overflow-auto bg-white dark:bg-gray-900 text-sm h-full"></div>
  </div>
</div>
    `;
  },

  init() {
    const defaultInput = `# Markdown Live Preview

Type your markdown on the left and see the preview here!

\`\`\`js
console.log("Hello Markdown");
\`\`\``;

    const previewEl = document.getElementById("mdPreview");
    const resetBtn = document.getElementById("btnResetMd");
    const copyBtn = document.getElementById("btnCopyMdRaw");
    const syncScrollEl = document.getElementById("mdScrollSync");

    let editor,
      scrollSync = false;

    const loadDeps = async () => {
      if (!window.marked) {
        await import("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
      }

      if (!window.DOMPurify) {
        await import(
          "https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"
        );
      }

      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/loader.js";
        script.onload = () => {
          window.require.config({
            paths: {
              vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
            },
          });
          window.require(["vs/editor/editor.main"], () => resolve());
        };
        document.head.appendChild(script);
      });
    };

    const renderMarkdown = (value) => {
      const rawHtml = marked.parse(value || "");
      const safeHtml = DOMPurify.sanitize(rawHtml);
      previewEl.innerHTML = safeHtml;
    };

    const setupEditor = () => {
      editor = monaco.editor.create(document.getElementById("mdEditor"), {
        value: defaultInput,
        language: "markdown",
        automaticLayout: true,
        theme: document.documentElement.classList.contains("dark")
          ? "vs-dark"
          : "vs-light",
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
      });

      editor.onDidChangeModelContent(() => {
        const content = editor.getValue();
        renderMarkdown(content);
        localStorage.setItem("devutils.markdown.last", content);
      });

      editor.onDidScrollChange((e) => {
        if (!scrollSync) return;
        const scrollTop = e.scrollTop;
        const scrollHeight = e.scrollHeight;
        const editorHeight = editor.getLayoutInfo().height;
        const ratio = scrollTop / (scrollHeight - editorHeight);
        const previewScroll =
          ratio * (previewEl.scrollHeight - previewEl.clientHeight);
        previewEl.scrollTo(0, previewScroll);
      });

      const saved = localStorage.getItem("devutils.markdown.last");
      if (saved) editor.setValue(saved);
      renderMarkdown(editor.getValue());
    };

    const setupEvents = () => {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset editor content?")) {
          editor.setValue(defaultInput);
          localStorage.removeItem("devutils.markdown.last");
          previewEl.scrollTo({ top: 0 });
        }
      });

      copyBtn.addEventListener("click", () => {
        const val = editor.getValue();
        navigator.clipboard.writeText(val).then(() => {
          copyBtn.textContent = tGlobal("copied");
          setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
        });
      });

      syncScrollEl.addEventListener("change", (e) => {
        scrollSync = e.target.checked;
      });
    };

    const injectGithubCss = () => {
      const existing = document.getElementById("githubMarkdownCss");
      if (existing) existing.remove();

      const isDark = document.documentElement.classList.contains("dark");

      const link = document.createElement("link");
      link.id = "githubMarkdownCss";
      link.rel = "stylesheet";
      link.href = isDark
        ? "https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown-dark.css"
        : "https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown-light.css";

      document.head.appendChild(link);
    };

    const applyMonacoTheme = () => {
      if (!window.monaco || !editor) return;

      const isDark = document.documentElement.classList.contains("dark");
      const theme = isDark ? "vs-dark" : "vs-light";
      monaco.editor.setTheme(theme);
    };

    const observeThemeChange = () => {
      const observer = new MutationObserver(() => {
        injectGithubCss();
        applyMonacoTheme();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    };

    const watchThemeChange = () => {
      const observer = new MutationObserver(() => {
        injectGithubCss();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    };

    loadDeps().then(() => {
      injectGithubCss();
      setupEditor();
      setupEvents();
      watchThemeChange();
      observeThemeChange();
    });
  },
};

export default markdown_live_editor;
