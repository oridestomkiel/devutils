const urlencode = {
  title: "Encoder/Decoder de URL",
  description:
    "Codifique e decodifique URLs de forma simples e rápida. Ideal para garantir compatibilidade de caracteres em requisições HTTP e links.",
  tags: [
    "url encoder",
    "url decoder",
    "codificar url",
    "decodificar url",
    "url encode",
    "url decode",
    "urls em http",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.4.0",
  render: () => `
    <textarea id="urlInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="3" placeholder="Texto ou URL"></textarea>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
      <select id="urlEncodeMode" class="w-full p-2 bg-gray-700 text-white rounded">
        <option value="component">encodeURIComponent</option>
        <option value="uri">encodeURI</option>
      </select>
      <div class="flex gap-2">
        <button id="urlEncodeBtn" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Encode</button>
        <button id="urlDecodeBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Decode</button>
      </div>
    </div>

    <div class="relative mb-2">
      <textarea id="urlOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-24" rows="3" readonly placeholder="Resultado aqui..."></textarea>
      <button id="copyUrlBtn" class="absolute top-2 right-20 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <button id="downloadUrlBtn" class="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Baixar</button>
      <span id="copiedUrlMsg" class="absolute top-2 right-20 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>

    <div id="urlPreview" class="mt-1 text-sm text-blue-400 underline hidden">
      <a id="urlPreviewLink" href="#" target="_blank" rel="noopener noreferrer"></a>
    </div>
  `,
  init: () => {
    const input = document.getElementById("urlInput");
    const output = document.getElementById("urlOutput");
    const mode = document.getElementById("urlEncodeMode");
    const copyBtn = document.getElementById("copyUrlBtn");
    const copiedMsg = document.getElementById("copiedUrlMsg");
    const downloadBtn = document.getElementById("downloadUrlBtn");
    const preview = document.getElementById("urlPreview");
    const previewLink = document.getElementById("urlPreviewLink");

    const isValidUrl = (str) => {
      try {
        const url = new URL(str);
        return url.protocol.startsWith("http");
      } catch {
        return false;
      }
    };

    const updatePreview = (val) => {
      if (isValidUrl(val)) {
        preview.classList.remove("hidden");
        previewLink.href = val;
        previewLink.textContent =
          val.length > 60 ? val.slice(0, 60) + "..." : val;
      } else {
        preview.classList.add("hidden");
        previewLink.href = "";
        previewLink.textContent = "";
      }
    };

    document.getElementById("urlEncodeBtn").addEventListener("click", () => {
      const val = input.value.trim();
      const encoded =
        mode.value === "uri" ? encodeURI(val) : encodeURIComponent(val);
      output.value = encoded;
      updatePreview(encoded);
    });

    document.getElementById("urlDecodeBtn").addEventListener("click", () => {
      try {
        const decoded = decodeURIComponent(input.value.trim());
        output.value = decoded;
        updatePreview(decoded);
      } catch {
        output.value = "URL inválida para decodificação";
        preview.classList.add("hidden");
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value;
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

    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([output.value], {
        type: "text/plain;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "url-convertido.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },
};

export default urlencode;
