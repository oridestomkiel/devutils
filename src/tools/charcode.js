const charcode = {
  title: "Charcode ↔ Texto",
  description:
    "Converta texto em códigos Unicode e vice-versa. Útil para análise, codificação e depuração de dados.",
  tags: [
    "unicode",
    "charcode",
    "conversor",
    "texto para código",
    "from charcode",
    "to charcode",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <select id="charcodeMode" class="mb-2 bg-gray-700 text-white p-1 rounded">
        <option value="to">Texto → Charcode</option>
        <option value="from">Charcode → Texto</option>
      </select>
  
      <textarea
        id="charcodeInput"
        class="w-full p-2 bg-gray-700 text-white rounded mb-2"
        rows="5"
        placeholder="Digite o texto ou os códigos unicode separados por espaço"
      ></textarea>
  
      <div class="flex gap-2 mb-2">
        <button id="charcodeBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Converter</button>
        <button id="charcodeClear" class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded hidden">Limpar</button>
        <button id="charcodeCopy" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">Copiar</button>
      </div>
  
      <pre id="charcodeOutput" class="text-green-400 bg-gray-900 whitespace-pre-wrap break-words p-1 my-4 hidden"></pre>
  
      <p class="text-sm text-gray-400">
        Referência Unicode: 
        <a href="https://wikipedia.org/wiki/Plane_(Unicode)" target="_blank" class="underline text-blue-400">
          Plane (Unicode)
        </a>
      </p>
    `,

  init: () => {
    const input = document.getElementById("charcodeInput");
    const output = document.getElementById("charcodeOutput");
    const mode = document.getElementById("charcodeMode");
    const btn = document.getElementById("charcodeBtn");
    const clear = document.getElementById("charcodeClear");
    const copy = document.getElementById("charcodeCopy");

    const showOutput = (text) => {
      output.innerText = text;
      output.classList.remove("hidden");
      clear.classList.remove("hidden");
      copy.classList.remove("hidden");
    };

    btn.addEventListener("click", () => {
      const val = input.value.trim();
      if (!val) return;

      if (mode.value === "to") {
        const result = Array.from(val)
          .map((c) => c.codePointAt(0).toString(16).padStart(4, "0"))
          .join(" ");
        showOutput(result);
      } else {
        try {
          const chars = val
            .split(/\s+/)
            .map((code) => String.fromCodePoint(parseInt(code, 16)));
          showOutput(chars.join(""));
        } catch {
          showOutput("Erro ao converter códigos para texto.");
        }
      }
    });

    clear.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
      output.classList.add("hidden");
      clear.classList.add("hidden");
      copy.classList.add("hidden");
    });

    copy.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = copy.innerText;
        copy.innerText = "Copiado!";
        setTimeout(() => (copy.innerText = original), 1500);
      });
    });
  },
};

export default charcode;
