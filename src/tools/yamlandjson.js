const yamlandjson = {
  title: "Conversor YAML ↔ JSON",
  description:
    "Converta arquivos YAML para o formato JSON e vice-versa de forma simples e eficiente. Ideal para desenvolvedores que trabalham com configuração e manipulação de dados.",
  tags: [
    "yaml para json",
    "json para yaml",
    "conversor yaml json",
    "converter dados",
    "estrutura de configuração",
    "yaml json",
    "api conf",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",
  render: () => `
    <textarea id="yamlJsonInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="Cole YAML ou JSON aqui..."></textarea>
    
    <div class="flex gap-2 mb-2">
      <button id="yamlToJson" class="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded">YAML → JSON</button>
      <button id="jsonToYaml" class="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded">JSON → YAML</button>
    </div>
    
    <div class="relative">
      <textarea id="yamlJsonOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-24" rows="6" readonly placeholder="Resultado..."></textarea>
      <button id="copyYamlJsonBtn" class="absolute top-2 right-20 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <button id="downloadYamlJsonBtn" class="absolute top-2 right-6 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Baixar</button>
      <span id="copiedYamlJsonMsg" class="absolute top-2 right-20 text-green-400 px-2 py-1 hidden">Copiado!</span>
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
      const input = document.getElementById("yamlJsonInput");
      const output = document.getElementById("yamlJsonOutput");
      const copyBtn = document.getElementById("copyYamlJsonBtn");
      const copiedMsg = document.getElementById("copiedYamlJsonMsg");
      const downloadBtn = document.getElementById("downloadYamlJsonBtn");

      let lastFormat = "json";

      document.getElementById("yamlToJson").addEventListener("click", () => {
        try {
          const parsed = jsyaml.load(input.value.trim());
          output.value = JSON.stringify(parsed, null, 2);
          lastFormat = "json";
        } catch (e) {
          output.value = "Erro: " + e.message;
        }
      });

      document.getElementById("jsonToYaml").addEventListener("click", () => {
        try {
          const parsed = JSON.parse(input.value.trim());
          output.value = jsyaml.dump(parsed);
          lastFormat = "yaml";
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

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `convertido.${lastFormat}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    });
  },
};

export default yamlandjson;
