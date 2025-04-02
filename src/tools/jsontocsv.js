const jsontocsv = {
  title: "Conversor JSON → CSV",
  description:
    "Converta dados JSON para o formato CSV com facilidade. Ideal para exportações, planilhas e manipulação de dados estruturados.",
  tags: [
    "json para csv",
    "converter json",
    "conversor de dados",
    "json csv",
    "exportar json",
    "transformar json em csv",
    "dados estruturados",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <textarea id="jsonToCsvInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder='Cole o JSON (array de objetos)'></textarea>
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
      <label class="text-sm">Delimitador:
        <input id="csvDelimiter" type="text" value="," maxlength="1" class="ml-1 px-2 py-1 bg-gray-700 text-white rounded w-10 text-center" />
      </label>
      <label class="text-sm mt-2 sm:mt-0">Usar aspas:
        <input id="csvQuote" type="checkbox" checked class="ml-1" />
      </label>
    </div>
    <div class="flex gap-2 mb-2">
      <button id="jsonToCsvBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Converter</button>
      <button id="downloadCsvBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded hidden">Baixar CSV</button>
    </div>
    <div class="relative">
      <pre id="jsonToCsvOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-16"></pre>
      <button id="copyJsonCsvBtn" class="absolute top-0 right-0 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedJsonCsvMsg" class="absolute top-0 right-0 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const output = document.getElementById("jsonToCsvOutput");
    const copyBtn = document.getElementById("copyJsonCsvBtn");
    const copiedMsg = document.getElementById("copiedJsonCsvMsg");
    const downloadBtn = document.getElementById("downloadCsvBtn");

    function flatten(obj, prefix = "", res = {}) {
      for (const key in obj) {
        const val = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          flatten(val, newKey, res);
        } else {
          res[newKey] = val;
        }
      }
      return res;
    }

    let lastCsv = "";

    document.getElementById("jsonToCsvBtn").addEventListener("click", () => {
      const input = document.getElementById("jsonToCsvInput").value;
      const delimiter = document.getElementById("csvDelimiter").value || ",";
      const useQuotes = document.getElementById("csvQuote").checked;

      try {
        const raw = JSON.parse(input);
        if (!Array.isArray(raw)) {
          throw new Error("JSON deve ser um array de objetos.");
        }

        const flatArray = raw.map((item) => flatten(item));
        const headers = Array.from(
          new Set(flatArray.flatMap((obj) => Object.keys(obj)))
        );

        const escapeValue = (value) => {
          const str = JSON.stringify(value ?? "");
          return useQuotes
            ? `"${str.replace(/^"|"$/g, "").replace(/"/g, '""')}"`
            : str.replace(/^"|"$/g, "");
        };

        const csv = [
          headers.map(escapeValue).join(delimiter),
          ...flatArray.map((obj) =>
            headers.map((h) => escapeValue(obj[h])).join(delimiter)
          ),
        ].join("\n");

        lastCsv = csv;
        output.innerText = csv;
        downloadBtn.classList.remove("hidden");
      } catch (e) {
        output.innerText = "Erro: " + e.message;
        downloadBtn.classList.add("hidden");
        lastCsv = "";
      }
    });

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

    downloadBtn.addEventListener("click", () => {
      if (!lastCsv) return;
      const blob = new Blob([lastCsv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  },
};

export default jsontocsv;
