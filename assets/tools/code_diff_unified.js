import { loadToolI18n } from "../../utils/i18n-loader.js";

const code_diff_unified = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <textarea
      id="diffOriginalV2"
      rows="12"
      placeholder="${t("placeholder.original")}"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
    ></textarea>
    <textarea
      id="diffModifiedV2"
      rows="12"
      placeholder="${t("placeholder.modified")}"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
    ></textarea>
  </div>

  <button
    id="diffCompareBtnV2"
    class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    ${t("compare")}
  </button>

  <div id="diffHtmlOutputV2"
    class="mt-4 text-sm overflow-auto bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-4">
  </div>
    `;
  },

  init() {
    const style = document.createElement("style");
    style.innerHTML = `
      .d2h-wrapper {
        background-color: #1f2937 !important;
        color: #e5e7eb !important;
      }
      .d2h-code-line,
      .d2h-code-linenumber {
        background-color: #1f2937 !important;
        color: #e5e7eb !important;
      }
      .d2h-del {
        background-color: #7f1d1d !important;
        color: #fee2e2 !important;
      }
      .d2h-ins {
        background-color: #065f46 !important;
        color: #d1fae5 !important;
      }
      .d2h-file-header {
        background-color: #111827 !important;
        color: #cbd5e1 !important;
      }
      .d2h-tag {
        background-color: #374151 !important;
        color: #93c5fd !important;
        border: none;
      }
      .d2h-diff-txt {
        color: #d1d5db !important;
      }
      .d2h-code-line del,
      .d2h-code-side-line del,
      .d2h-code-line-ctn del {
        background-color: #7f1d1d !important;
        color: #fee2e2 !important;
        text-decoration: none !important;
        padding: 1px 4px;
        border-radius: 4px;
      }
      .d2h-code-line ins,
      .d2h-code-side-line ins,
      .d2h-code-line-ctn ins {
        background-color: #065f46 !important;
        color: #d1fae5 !important;
        text-decoration: none !important;
        padding: 1px 4px;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);

    const loadDiffLibs = (callback) => {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      const loadCSS = (href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      };

      if (!window.Diff2Html || !window.Diff) {
        loadCSS("./vendor/diff2html.min.css");
        Promise.all([
          loadScript("./vendor/diff.min.js"),
          loadScript(",/vendor/diff2html.min.js"),
        ]).then(callback);
      } else {
        callback();
      }
    };

    document
      .getElementById("diffCompareBtnV2")
      .addEventListener("click", () => {
        const original = document.getElementById("diffOriginalV2").value.trim();
        const modified = document.getElementById("diffModifiedV2").value.trim();

        loadDiffLibs(() => {
          const diffStr = window.Diff.createTwoFilesPatch(
            "original.txt",
            "modificado.txt",
            original,
            modified,
            "",
            ""
          );

          const html = window.Diff2Html.html(diffStr, {
            drawFileList: false,
            matching: "lines",
            outputFormat: "line-by-line",
          });

          document.getElementById("diffHtmlOutputV2").innerHTML = html;
        });
      });
  },
};

export default code_diff_unified;
