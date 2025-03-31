const hashgenerator = {
  title: "Gerador de Hash (MD5, SHA1, SHA224, SHA256 e SHA512)",
  description:
    "Digite qualquer texto para gerar os hashes MD5, SHA1, SHA224, SHA256 e SHA512 automaticamente. Com opção de copiar cada um.",
  tags: ["hash", "md5", "sha", "criptografia", "gerador de hash"],
  category: "Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
      <textarea
        id="hashInput"
        class="w-full p-2 bg-gray-700 text-white rounded mb-3"
        rows="4"
        placeholder="Digite ou cole um texto para gerar os hashes..."
      ></textarea>
  
      <label class="flex items-center text-sm text-gray-300 mb-3 gap-2 select-none">
        <input type="checkbox" id="hashUppercase" class="accent-blue-500" />
        Mostrar em MAIÚSCULAS
      </label>
  
      <div id="hashOutputs" class="space-y-2"></div>
  
      <button id="hashClearBtn" class="mt-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
        Limpar
      </button>
    `,

  init: () => {
    const loadCryptoLib = (callback) => {
      if (window.CryptoJS) return callback();
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    };

    loadCryptoLib(() => {
      const input = document.getElementById("hashInput");
      const outputs = document.getElementById("hashOutputs");
      const clearBtn = document.getElementById("hashClearBtn");
      const uppercaseToggle = document.getElementById("hashUppercase");

      const algorithms = [
        { name: "MD5", fn: (txt) => CryptoJS.MD5(txt).toString() },
        { name: "SHA1", fn: (txt) => CryptoJS.SHA1(txt).toString() },
        { name: "SHA224", fn: (txt) => CryptoJS.SHA224(txt).toString() },
        { name: "SHA256", fn: (txt) => CryptoJS.SHA256(txt).toString() },
        { name: "SHA512", fn: (txt) => CryptoJS.SHA512(txt).toString() },
      ];

      const renderHashes = () => {
        const text = input.value.trim();
        const isUpper = uppercaseToggle.checked;

        outputs.innerHTML = "";

        if (text.length === 0) {
          clearBtn.classList.add("hidden");
          return;
        }

        algorithms.forEach((algo) => {
          let value = algo.fn(text);
          value = isUpper ? value.toUpperCase() : value.toLowerCase();

          const row = document.createElement("div");
          row.className = "flex items-center gap-2";

          const inputEl = document.createElement("input");
          inputEl.value = value;
          inputEl.className =
            "w-full bg-gray-900 text-gray-300 text-sm px-2 py-1 rounded border border-gray-700";
          inputEl.readOnly = true;

          const btn = document.createElement("button");
          btn.textContent = algo.name;
          btn.className =
            "bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm w-[90px]";
          btn.addEventListener("click", () => {
            navigator.clipboard.writeText(value).then(() => {
              const original = btn.textContent;
              btn.textContent = "Copiado!";
              setTimeout(() => (btn.textContent = original), 1500);
            });
          });

          row.appendChild(inputEl);
          row.appendChild(btn);
          outputs.appendChild(row);
        });

        clearBtn.classList.remove("hidden");
      };

      input.addEventListener("input", renderHashes);
      uppercaseToggle.addEventListener("change", renderHashes);

      clearBtn.addEventListener("click", () => {
        input.value = "";
        outputs.innerHTML = "";
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default hashgenerator;
