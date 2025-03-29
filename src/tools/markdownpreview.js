const markdownpreview = {
  title: "Preview de Markdown → HTML",
  description:
    "Visualize a renderização de textos em Markdown convertidos para HTML em tempo real. Ideal para redatores, desenvolvedores e criadores de conteúdo.",
  tags: [
    "markdown para html",
    "preview de markdown",
    "renderizar markdown",
    "markdown viewer",
    "markdown live preview",
    "converter markdown",
    "html a partir de markdown",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <textarea id="mdInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="# Título\n\nAlgum texto *markdown*."></textarea>
    <button id="mdRenderBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mb-2">Converter</button>
    <div class="relative">
      <div id="mdOutput" class="markdown-preview bg-gray-800 text-white rounded p-4 max-h-96 overflow-y-auto text-sm"></div>
      <button id="copyMdBtn" class="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedMdMsg" class="absolute top-2 right-2 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const input = document.getElementById("mdInput");
    const output = document.getElementById("mdOutput");
    const btn = document.getElementById("mdRenderBtn");
    const copyBtn = document.getElementById("copyMdBtn");
    const copiedMsg = document.getElementById("copiedMdMsg");

    function renderMarkdown() {
      const md = input.value;
      const html = window.marked.parse(md);
      output.innerHTML = html;
    }

    function setupCopy() {
      copyBtn.addEventListener("click", () => {
        const html = output.innerHTML;
        if (!html) return;

        navigator.clipboard.writeText(html).then(() => {
          copyBtn.classList.add("hidden");
          copiedMsg.classList.remove("hidden");

          setTimeout(() => {
            copiedMsg.classList.add("hidden");
            copyBtn.classList.remove("hidden");
          }, 2000);
        });
      });
    }

    function injectMarkdownStyles() {
      if (document.getElementById("markdownPreviewStyles")) return;

      const style = document.createElement("style");
      style.id = "markdownPreviewStyles";
      style.innerHTML = `
        .markdown-preview h1 { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; }
        .markdown-preview h2 { font-size: 1.25rem; font-weight: bold; margin-top: 1rem; }
        .markdown-preview p { margin: 0.5rem 0; }
        .markdown-preview ul, .markdown-preview ol { margin: 0.5rem 0 0.5rem 1.5rem; list-style-type: disc; }
        .markdown-preview code { background-color: #1f2937; padding: 2px 4px; border-radius: 4px; color: #93c5fd; font-family: monospace; }
        .markdown-preview pre { background-color: #1f2937; padding: 1rem; border-radius: 8px; overflow-x: auto; color: #93c5fd; }
        .markdown-preview blockquote { border-left: 4px solid #6b7280; padding-left: 1rem; color: #9ca3af; font-style: italic; }
        .markdown-preview table { border-collapse: collapse; margin: 1rem 0; }
        .markdown-preview th, .markdown-preview td { border: 1px solid #4b5563; padding: 0.5rem; }
        .markdown-preview th { background-color: #374151; color: white; }
        .markdown-preview img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
        .markdown-preview a { color: #60a5fa; text-decoration: underline; }
      `;
      document.head.appendChild(style);
    }

    function setup() {
      injectMarkdownStyles();
      btn.addEventListener("click", renderMarkdown);
      setupCopy();
    }

    if (typeof marked === "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      script.onload = setup;
      document.head.appendChild(script);
    } else {
      setup();
    }
  },
};

export default markdownpreview;
