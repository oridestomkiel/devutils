const unicodeescape = {
  title: "Conversor Unicode ↔ Texto",
  description:
    "Converta caracteres Unicode para texto legível e vice-versa. Ideal para internacionalização, codificação e manipulação de strings.",
  tags: [
    "unicode",
    "texto para unicode",
    "unicode para texto",
    "utf-8",
    "hexadecimal",
    "acentos",
    "ç",
    "codificação unicode",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.1.0",
  render: () => `
    <textarea id="unicodeInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="4" placeholder="Digite texto ou Unicode escapado (\\uXXXX, \\xXX)"></textarea>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
      <select id="unicodeMode" class="w-full p-2 bg-gray-700 text-white rounded">
        <option value="unicode">\\uXXXX</option>
        <option value="utf8">\\xXX</option>
        <option value="hex">Somente Hex</option>
      </select>
      <select id="unicodeFilter" class="w-full p-2 bg-gray-700 text-white rounded">
        <option value="all">Converter tudo</option>
        <option value="accents">Somente acentos</option>
        <option value="specials">Apenas caracteres especiais</option>
        <option value="cedilla">Somente ç</option>
      </select>
    </div>

    <div class="flex gap-2 mb-2">
      <button id="textToUnicodeBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Texto → Unicode</button>
      <button id="unicodeToTextBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Unicode → Texto</button>
    </div>

    <div class="relative">
      <textarea id="unicodeOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-20" rows="4" readonly placeholder="Resultado aparece aqui..."></textarea>
      <button id="copyUnicodeBtn" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedUnicodeMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const input = document.getElementById("unicodeInput");
    const output = document.getElementById("unicodeOutput");
    const mode = document.getElementById("unicodeMode");
    const filter = document.getElementById("unicodeFilter");
    const copyBtn = document.getElementById("copyUnicodeBtn");
    const copiedMsg = document.getElementById("copiedUnicodeMsg");

    const encodeChar = (char, type) => {
      const code = char.charCodeAt(0);
      if (type === "unicode") return "\\u" + code.toString(16).padStart(4, "0");
      if (type === "utf8") return "\\x" + code.toString(16).padStart(2, "0");
      return code.toString(16);
    };

    const shouldConvert = (char, rule) => {
      const isAccent = /[\u0300-\u036f\u00C0-\u00FF]/.test(
        char.normalize("NFD")
      );
      const isSpecial = /[^\w\s]/.test(char);
      const isCedilla = /[çÇ]/.test(char);

      switch (rule) {
        case "all":
          return true;
        case "accents":
          return isAccent;
        case "specials":
          return isSpecial;
        case "cedilla":
          return isCedilla;
      }
    };

    const convertTextToUnicode = () => {
      const val = input.value.trim();
      const selectedMode = mode.value;
      const selectedFilter = filter.value;

      const result = [...val]
        .map((c) =>
          shouldConvert(c, selectedFilter) ? encodeChar(c, selectedMode) : c
        )
        .join("");

      output.value = result;
    };

    const convertUnicodeToText = () => {
      const val = input.value.trim();
      try {
        const decoded = val
          .replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
          )
          .replace(/\\x([\dA-Fa-f]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
          );
        output.value = decoded;
      } catch (e) {
        output.value = "Erro: " + e.message;
      }
    };

    document
      .getElementById("textToUnicodeBtn")
      .addEventListener("click", convertTextToUnicode);
    document
      .getElementById("unicodeToTextBtn")
      .addEventListener("click", convertUnicodeToText);

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
  },
};

export default unicodeescape;
