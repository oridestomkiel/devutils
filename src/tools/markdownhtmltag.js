const markdownhtmltag = {
  title: "Markdown → HTML (Tags)",
  description:
    "Converta Markdown para HTML bruto exibindo apenas as tags HTML geradas. Ideal para desenvolvedores e integração de conteúdo.",
  tags: [
    "markdown para html",
    "markdown to html",
    "converter markdown",
    "html tag output",
    "markdown bruto",
    "visualizar html de markdown",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
      <textarea id="mdRawInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="# Título\n\nAlgum texto *markdown*."></textarea>
      <button id="mdRawRenderBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mb-2">Converter</button>
      <div class="relative">
        <pre id="mdRawOutput" class="bg-gray-800 text-green-400 rounded p-4 max-h-96 overflow-y-auto text-sm whitespace-pre-wrap break-words pr-16"></pre>
        <button id="copyMdRawBtn" class="absolute top-0 right-4 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
        <span id="copiedMdRawMsg" class="absolute top-0 right-4 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
      </div>
    `,
  init: () => {
    const input = document.getElementById("mdRawInput");
    const output = document.getElementById("mdRawOutput");
    const btn = document.getElementById("mdRawRenderBtn");
    const copyBtn = document.getElementById("copyMdRawBtn");
    const copiedMsg = document.getElementById("copiedMdRawMsg");

    const renderMarkdownToHtml = () => {
      const md = input.value;
      const html = window.marked.parse(md);
      output.innerText = html;
    };

    const setupCopy = () => {
      copyBtn.addEventListener("click", () => {
        const text = output.innerText;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
          copyBtn.classList.add("hidden");
          copiedMsg.classList.remove("hidden");
          setTimeout(() => {
            copiedMsg.classList.add("hidden");
            copyBtn.classList.remove("hidden");
          }, 2000);
        });
      });
    };

    const setup = () => {
      btn.addEventListener("click", renderMarkdownToHtml);
      setupCopy();
    };

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

export default markdownhtmltag;
