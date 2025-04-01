const htmlPreviewTool = {
  title: "Visualizador de HTML",
  description:
    "Visualize, edite e formate códigos HTML com pré-visualização ao vivo. Inclui autocomplete, fechamento automático de tags e placeholder inteligente.",
  tags: ["html", "visualização", "preview", "web", "frontend"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.2",

  render: () => `
      <div class="p-4 bg-gray-800 text-white text-sm space-y-4 rounded">
        <div class="flex flex-wrap gap-2">
          <button id="btnSample" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Exemplo</button>
          <button id="btnClear" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Limpar</button>
          <button id="btnFormat" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Formatar</button>
          <button id="btnCopiarHTML" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Copiar</button>
        </div>
  
        <div class="relative border border-gray-700 rounded overflow-hidden">
          <div id="editor" class="min-h-[200px]"></div>
          <div id="editorPlaceholder" class="absolute top-0 left-8 p-2 text-gray-500 pointer-events-none select-none">
            &lt;!-- Digite ou cole o seu HTML aqui --&gt;
          </div>
        </div>
  
        <iframe id="previewHTML" class="w-full h-96 border border-gray-700 rounded bg-white hidden"></iframe>
      </div>
    `,

  init: async () => {
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

    loadCSS(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.css"
    );
    loadCSS(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/material-darker.css"
    );

    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/htmlmixed/htmlmixed.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/xml/xml.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/javascript/javascript.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/css/css.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/edit/closetag.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify-html.min.js"
    );

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
      const formatado = window.html_beautify(cm.getValue(), {
        indent_size: 2,
        max_preserve_newlines: 0,
      });
      cm.setValue(formatado.trim());
    };

    document.getElementById("btnCopiarHTML").onclick = () => {
      navigator.clipboard.writeText(cm.getValue()).then(() => {
        const btn = document.getElementById("btnCopiarHTML");
        btn.textContent = "Copiado!";
        setTimeout(() => (btn.textContent = "Copiar"), 1500);
      });
    };
  },
};

export default htmlPreviewTool;
