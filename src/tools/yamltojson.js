const yamltojson = {
  title: "Conversor YAML → JSON",
  description:
    "Converta arquivos YAML para o formato JSON de maneira simples e eficiente. Ideal para configurações, APIs e manipulação de dados estruturados.",
  tags: [
    "yaml para json",
    "converter yaml",
    "conversor de dados",
    "yaml json",
    "formato json",
    "transformar yaml em json",
    "dados estruturados",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",
  render: () => `
    <textarea id="yamlInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="Cole o YAML aqui..."></textarea>
    <button id="yamlToJsonBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded mb-2">Converter</button>
    
    <div class="relative">
      <textarea id="yamlOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-24" rows="6" readonly placeholder="Resultado JSON aqui..."></textarea>
      <button id="copyYamlJsonBtn" class="absolute top-2 right-20 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <button id="downloadYamlJsonBtn" class="absolute top-2 right-6 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Baixar</button>
      <span id="copiedYamlJsonMsg" class="absolute top-2 right-20 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const ensureYamlReady = (callback) => {
      if (window.jsyaml) return callback();
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    };

    ensureYamlReady(() => {
      const input = document.getElementById("yamlInput");
      const output = document.getElementById("yamlOutput");
      const convertBtn = document.getElementById("yamlToJsonBtn");
      const copyBtn = document.getElementById("copyYamlJsonBtn");
      const copiedMsg = document.getElementById("copiedYamlJsonMsg");
      const downloadBtn = document.getElementById("downloadYamlJsonBtn");

      convertBtn.addEventListener("click", () => {
        try {
          const parsed = jsyaml.load(input.value.trim());
          output.value = JSON.stringify(parsed, null, 2);
        } catch (e) {
          output.value = "Erro: " + e.message;
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
        const text = output.value.trim();
        if (!text) return;

        const blob = new Blob([text], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "convertido.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    });
  },
};

export default yamltojson;
