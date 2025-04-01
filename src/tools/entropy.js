const entropy = {
  title: "Entropia de Shannon",
  description:
    "Meça a entropia de uma string com base na teoria da informação. Valores mais altos indicam maior aleatoriedade.",
  tags: [
    "entropia",
    "shannon",
    "aleatoriedade",
    "segurança",
    "compressão",
    "informação",
  ],
  category: "Análise / Comparação",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <textarea
        id="entropyInput"
        class="w-full p-2 bg-gray-700 text-white rounded mb-2"
        rows="5"
        placeholder="Digite ou cole seu conteúdo aqui..."
      ></textarea>
  
      <div class="flex gap-2 mb-2">
        <button id="entropyBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Calcular</button>
        <button id="entropyClear" class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded">Limpar</button>
        <button id="entropyCopy" class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Copiar</button>
      </div>
  
      <pre id="entropyOutput" class="text-green-400 bg-gray-900 whitespace-pre-wrap break-words p-1 my-4 hidden"></pre>
  
      <p class="text-sm text-gray-400">
        Máximo possível: <strong>8.0</strong><br>
        Texto em inglês geralmente: <strong>3.5 - 5.0</strong><br>
        Dados comprimidos/criptografados: <strong>acima de 7.5</strong><br>
        Fonte: 
        <a href="https://wikipedia.org/wiki/Entropy_(information_theory)" target="_blank" class="underline text-blue-400">
          Wikipedia
        </a>
      </p>
    `,

  init: () => {
    const input = document.getElementById("entropyInput");
    const output = document.getElementById("entropyOutput");
    const copyBtn = document.getElementById("entropyCopy");
    const clearBtn = document.getElementById("entropyClear");

    document.getElementById("entropyBtn").addEventListener("click", () => {
      const text = input.value;
      if (!text) return;

      const freq = {};
      for (const char of text) {
        freq[char] = (freq[char] || 0) + 1;
      }

      const len = text.length;
      let entropy = 0;
      for (const char in freq) {
        const p = freq[char] / len;
        entropy -= p * Math.log2(p);
      }

      output.innerText = `Entropia: ${entropy.toFixed(4)} bits por caractere`;
      output.classList.remove("hidden");
      copyBtn.classList.remove("hidden");
      clearBtn.classList.remove("hidden");
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.innerText = "";
      output.classList.add("hidden");
      copyBtn.classList.add("hidden");
      clearBtn.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default entropy;
