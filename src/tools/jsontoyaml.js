const jsontoyaml = {
  title: "Conversor JSON → YAML",
  description:
    "Converta arquivos JSON para o formato YAML de forma simples e eficiente. Ideal para configuração de sistemas, APIs e infraestrutura como código.",
  tags: [
    "json para yaml",
    "converter json",
    "json yaml",
    "conversão de dados",
    "estrutura yaml",
    "configuração yaml",
    "transformar json em yaml",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="jsonToYamlInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder='Cole o JSON aqui...'></textarea>
    <button id="jsonToYamlBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded mb-2">Converter</button>
    <div class="relative">
      <pre id="jsonToYamlOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-16"> </pre>
      <button id="copyJsonYamlBtn" class="absolute top-0 right-0 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedJsonYamlMsg" class="absolute top-0 right-0 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const outputEl = document.getElementById("jsonToYamlOutput");
    const copyBtn = document.getElementById("copyJsonYamlBtn");
    const copiedMsg = document.getElementById("copiedJsonYamlMsg");

    const convert = () => {
      try {
        const input = document.getElementById("jsonToYamlInput").value;
        const obj = JSON.parse(input);
        const yaml = jsyaml.dump(obj);
        outputEl.innerText = yaml;
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
      }
    };

    const bindEvents = () => {
      document
        .getElementById("jsonToYamlBtn")
        .addEventListener("click", convert);

      copyBtn.addEventListener("click", () => {
        const text = outputEl.innerText;
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

    if (!window.jsyaml) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js";
      script.onload = bindEvents;
      document.head.appendChild(script);
    } else {
      bindEvents();
    }
  },
};

export default jsontoyaml;
