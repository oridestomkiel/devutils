const base58 = {
  title: "Codificador/Decodificador Base58",
  description:
    "Codifique e decodifique strings em Base58 — ideal para aplicações em blockchain, Bitcoin e sistemas que evitam caracteres ambíguos.",
  tags: [
    "base58",
    "decodificador base58",
    "codificador base58",
    "converter base58",
    "base58 bitcoin",
    "base58 online",
    "base58 encoder decoder",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="b58Input"
      class="w-full p-2 bg-gray-700 rounded mb-2 text-white"
      rows="3"
      placeholder="Texto para codificar ou Base58 para decodificar"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="b58Encode"
        class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
      >
        Encode
      </button>
      <button
        id="b58Decode"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Decode
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="b58Output"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button
        id="b58CopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const alphabet =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const baseMap = {};
    for (let i = 0; i < alphabet.length; i++) {
      baseMap[alphabet[i]] = i;
    }

    function encodeBase58(buffer) {
      let digits = [0];
      for (let i = 0; i < buffer.length; ++i) {
        let carry = buffer[i];
        for (let j = 0; j < digits.length; ++j) {
          carry += digits[j] << 8;
          digits[j] = carry % 58;
          carry = (carry / 58) | 0;
        }
        while (carry) {
          digits.push(carry % 58);
          carry = (carry / 58) | 0;
        }
      }

      for (let i = 0; i < buffer.length && buffer[i] === 0; ++i) {
        digits.push(0);
      }

      return digits
        .reverse()
        .map((d) => alphabet[d])
        .join("");
    }

    function decodeBase58(str) {
      if (str.length === 0) return new Uint8Array();

      let bytes = [0];
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (!(c in baseMap)) throw new Error("Caractere inválido na Base58");
        let carry = baseMap[c];
        for (let j = 0; j < bytes.length; ++j) {
          carry += bytes[j] * 58;
          bytes[j] = carry & 0xff;
          carry >>= 8;
        }
        while (carry) {
          bytes.push(carry & 0xff);
          carry >>= 8;
        }
      }

      let zeros = 0;
      while (str[zeros] === "1") {
        zeros++;
      }

      return new Uint8Array(Array(zeros).fill(0).concat(bytes.reverse()));
    }

    const encodeBtn = document.getElementById("b58Encode");
    const decodeBtn = document.getElementById("b58Decode");
    const inputEl = document.getElementById("b58Input");
    const outputEl = document.getElementById("b58Output");
    const copyBtn = document.getElementById("b58CopyBtn");

    encodeBtn.addEventListener("click", () => {
      const text = inputEl.value;
      const buffer = new TextEncoder().encode(text);
      const encoded = encodeBase58(buffer);
      outputEl.value = encoded;
    });

    decodeBtn.addEventListener("click", () => {
      try {
        const text = inputEl.value;
        const decoded = decodeBase58(text);
        const decodedStr = new TextDecoder().decode(decoded);
        outputEl.value = decodedStr;
      } catch (e) {
        outputEl.value = "Erro ao decodificar: " + e.message;
      }
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};
export default base58;
