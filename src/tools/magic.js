const magic = {
  title: "Magic Analyzer",
  description:
    "Detecta e analisa dados automaticamente, sugerindo operações úteis como decodificação, descompressão ou interpretação com base em entropia, padrões e formato.",
  tags: ["auto", "detectar", "decodificar", "análise", "inteligente", "magic"],
  category: "Análise / Comparação",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render: () => `
        <textarea id="magicInput" class="w-full p-2 bg-gray-700 text-white rounded mb-2" rows="6"
          placeholder="Cole aqui dados suspeitos (Base64, Hex, JWT, payloads...)"></textarea>
    
        <div class="flex gap-2 mb-2">
          <button id="magicAnalyzeBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Analisar</button>
          <button id="magicClearBtn" class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded hidden">Limpar</button>
        </div>
    
        <div>
          <label for="magicCrib" class="text-white">Expressão Regular (Crib):</label>
          <input type="text" id="magicCrib" class="w-full p-2 bg-gray-700 text-white rounded mb-2" placeholder="Opcional: Insira uma regex para filtrar resultados">
        </div>
    
        <div>
          <label for="magicDepth" class="text-white">Profundidade da Análise Recursiva:</label>
          <input type="number" id="magicDepth" class="w-full p-2 bg-gray-700 text-white rounded mb-2" value="1" min="1" max="5">
        </div>
    
        <div>
          <label for="magicIntensive" class="text-white">
            <input type="checkbox" id="magicIntensive" class="mr-2">
            Modo Intensivo (brute-force leve de ROT13 e XOR)
          </label>
        </div>
    
        <div id="magicResults" class="bg-gray-800 text-sm text-green-400 whitespace-pre-wrap break-words p-3 rounded hidden my-4"></div>
      `,

  init: () => {
    const loadMagicLibs = async (callback) => {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      await loadScript(
        "https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js"
      );

      if (callback) callback();
    };

    loadMagicLibs(() => {
      const input = document.getElementById("magicInput");
      const results = document.getElementById("magicResults");
      const analyzeBtn = document.getElementById("magicAnalyzeBtn");
      const clearBtn = document.getElementById("magicClearBtn");
      const cribInput = document.getElementById("magicCrib");
      const depthInput = document.getElementById("magicDepth");
      const intensiveInput = document.getElementById("magicIntensive");

      const isBase64 = (str) => {
        try {
          return (
            btoa(atob(str.replace(/\s+/g, ""))) === str.replace(/\s+/g, "")
          );
        } catch {
          return false;
        }
      };

      const isHex = (str) => /^[\da-f\s]+$/i.test(str.replace(/\s+/g, ""));

      const tryJSON = (str) => {
        try {
          const json = JSON.parse(str);
          return typeof json === "object";
        } catch {
          return false;
        }
      };

      const getEntropy = (str) => {
        const freq = {};
        for (const c of str) freq[c] = (freq[c] || 0) + 1;
        const len = str.length;
        let entropy = 0;
        for (const c in freq) {
          const p = freq[c] / len;
          entropy -= p * Math.log2(p);
        }
        return entropy;
      };

      const decodeJWT = (token) => {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        try {
          const payload = JSON.parse(atob(parts[1]));
          return JSON.stringify(payload, null, 2);
        } catch {
          return null;
        }
      };

      const decompressGZIP = (data) => {
        try {
          const binaryData = Uint8Array.from(atob(data), (c) =>
            c.charCodeAt(0)
          );
          const decompressed = window.pako.inflate(binaryData, {
            to: "string",
          });
          return decompressed;
        } catch {
          return null;
        }
      };

      const applyROT13 = (str) => {
        return str.replace(/[a-zA-Z]/g, (char) => {
          const start = char <= "Z" ? 65 : 97;
          return String.fromCharCode(
            start + ((char.charCodeAt(0) - start + 13) % 26)
          );
        });
      };

      const applyXOR = (str, key) => {
        return str
          .split("")
          .map((char) => String.fromCharCode(char.charCodeAt(0) ^ key))
          .join("");
      };

      const detect = (data, depth, intensive, cribRegex) => {
        const output = [];
        const raw = data.trim();

        const entropy = getEntropy(raw).toFixed(4);
        output.push(`📊 Entropia: ${entropy} bits/caractere`);

        if (/^[\x00-\x7F]+$/.test(raw)) output.push("🧠 Parece texto ASCII");
        if (/^[ -~]+$/.test(raw)) output.push("🧩 Caracteres imprimíveis");
        if (isBase64(raw)) output.push("🔐 Possível Base64 válido");
        if (isHex(raw)) output.push("🔎 Possível Hexadecimal");
        if (tryJSON(raw)) output.push("📦 JSON válido");

        const jwtPayload = decodeJWT(raw);
        if (jwtPayload) {
          output.push("🔓 JWT detectado e decodificado:");
          output.push(jwtPayload);
        }

        const gzipDecoded = decompressGZIP(raw);
        if (gzipDecoded) {
          output.push("📦 GZIP decodificado com sucesso:");
          output.push(gzipDecoded);
        }

        if (cribRegex) {
          const regex = new RegExp(cribRegex, "i");
          if (regex.test(raw)) {
            output.push(`🔍 Crib encontrado com regex: ${cribRegex}`);
          } else {
            output.push(`❌ Crib não encontrado usando regex: ${cribRegex}`);
          }
        }

        if (intensive) {
          const rot13 = applyROT13(raw);
          if (tryJSON(rot13)) output.push("🔁 ROT13 aplicado → JSON válido");

          for (let k = 1; k < 10; k++) {
            const xor = applyXOR(raw, k);
            if (tryJSON(xor)) {
              output.push(`🔁 XOR com chave ${k} → JSON válido`);
              break;
            }
          }
        }

        return output.join("\n");
      };

      analyzeBtn.addEventListener("click", () => {
        const raw = input.value.trim();
        if (!raw) return;

        const crib = cribInput.value;
        const depth = parseInt(depthInput.value);
        const intensive = intensiveInput.checked;

        const report = detect(raw, depth, intensive, crib);
        results.textContent = report;
        results.classList.remove("hidden");
        clearBtn.classList.remove("hidden");
      });

      clearBtn.addEventListener("click", () => {
        input.value = "";
        results.classList.add("hidden");
        results.textContent = "";
        clearBtn.classList.add("hidden");
      });
    });
  },
};

export default magic;
