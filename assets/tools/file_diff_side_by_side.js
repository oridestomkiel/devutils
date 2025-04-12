import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const file_diff_side_by_side = {
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
      <div>
        <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">${t(
          "originalFile"
        )}</label>
        <input
          type="file"
          id="fileOriginalV3"
          class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1"
        />
      </div>
      <div>
        <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">${t(
          "modifiedFile"
        )}</label>
        <input
          type="file"
          id="fileModifiedV3"
          class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1"
        />
      </div>
    </div>

    <button
      id="diffCompareBtnV3"
      class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      ${t("compare")}
    </button>

    <div
      id="diffHtmlOutputV3"
      class="mt-4 text-sm overflow-auto bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-4"
    ></div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

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
      .d2h-code-line ins,
      .d2h-code-side-line ins {
        background-color: #064e3b !important;
        color: #d1fae5 !important;
        text-decoration: none !important;
        padding: 1px 4px;
        border-radius: 4px;
      }
      .d2h-code-line del,
      .d2h-code-side-line del {
        background-color: #7f1d1d !important;
        color: #fee2e2 !important;
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
          loadScript("./vendor/diff2html.min.js"),
        ]).then(callback);
      } else {
        callback();
      }
    };

    const readFile = (input) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(input.files[0]);
      });

    document
      .getElementById("diffCompareBtnV3")
      .addEventListener("click", async () => {
        const fileA = document.getElementById("fileOriginalV3");
        const fileB = document.getElementById("fileModifiedV3");

        if (!fileA.files.length || !fileB.files.length) {
          alert(t("alertMissingFiles"));
          return;
        }

        const [textA, textB] = await Promise.all([
          readFile(fileA),
          readFile(fileB),
        ]);

        loadDiffLibs(() => {
          const diffStr = window.Diff.createTwoFilesPatch(
            fileA.files[0].name,
            fileB.files[0].name,
            textA,
            textB,
            "",
            ""
          );

          const html = window.Diff2Html.html(diffStr, {
            drawFileList: false,
            matching: "lines",
            outputFormat: "side-by-side",
          });

          document.getElementById("diffHtmlOutputV3").innerHTML = html;
        });
      });
  },
};

export default file_diff_side_by_side;
