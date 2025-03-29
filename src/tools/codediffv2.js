const codediffv2 = {
  title: "Diff de Código (Unificado)",
  description:
    "Visualize diferenças entre blocos de código em formato unificado, semelhante ao terminal Git.",
  tags: ["diff", "unificado", "git", "linha a linha", "comparação de código"],
  category: "Análise / Comparação",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          id="diffOriginalV2"
          rows="12"
          placeholder="Código original..."
          class="w-full p-2 bg-gray-700 rounded text-white text-sm font-mono"
        ></textarea>
        <textarea
          id="diffModifiedV2"
          rows="12"
          placeholder="Código modificado..."
          class="w-full p-2 bg-gray-700 rounded text-white text-sm font-mono"
        ></textarea>
      </div>
      <button
        id="diffCompareBtnV2"
        class="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Comparar
      </button>
      <div id="diffHtmlOutputV2" class="mt-4 text-sm overflow-auto"></div>
    `,
  init: () => {
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
        loadCSS(
          "https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css"
        );

        Promise.all([
          loadScript(
            "https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js"
          ),
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

export default codediffv2;
