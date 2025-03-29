const base64hex = {
  title: "Conversor Base64 ↔ Hexadecimal",
  description:
    "Converta facilmente entre Base64 e hexadecimal para inspecionar, codificar ou depurar dados binários em formatos legíveis.",
  tags: [
    "base64",
    "hexadecimal",
    "conversor base64 para hex",
    "converter hex para base64",
    "base64 hex online",
    "base64 hex decoder",
    "base64 ↔ hex",
  ],
  category: "Codificadores / Decodificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="b64HexInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="4"
      placeholder="Digite Base64 ou Hexadecimal"
    ></textarea>

    <div class="flex gap-2">
      <button
        id="b64ToHexBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
      >
        Base64 → Hex
      </button>
      <button
        id="hexToB64Btn"
        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
      >
        Hex → Base64
      </button>
    </div>

    <div class="mt-2 flex gap-2">
      <input
        id="b64HexOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button
        id="b64HexCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const b64HexInput = document.getElementById("b64HexInput");
    const b64HexOutput = document.getElementById("b64HexOutput");
    const b64ToHexBtn = document.getElementById("b64ToHexBtn");
    const hexToB64Btn = document.getElementById("hexToB64Btn");
    const b64HexCopyBtn = document.getElementById("b64HexCopyBtn");

    const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const hexToBytes = (hex) =>
      hex.match(/.{1,2}/g).map((b) => parseInt(b, 16));
    const bytesToHex = (bytes) =>
      bytes.map((b) => b.toString(16).padStart(2, "0")).join("");

    b64ToHexBtn.addEventListener("click", () => {
      try {
        const b64 = b64HexInput.value.trim();
        const binary = atob(b64);
        const bytes = [...binary].map((c) => c.charCodeAt(0));
        b64HexOutput.value = bytesToHex(bytes);
      } catch (e) {
        b64HexOutput.value = "Erro: " + e.message;
      }
    });

    hexToB64Btn.addEventListener("click", () => {
      try {
        const hex = b64HexInput.value.replace(/\s+/g, "");
        const bytes = hexToBytes(hex);
        const binary = String.fromCharCode(...bytes);
        b64HexOutput.value = btoa(binary);
      } catch (e) {
        b64HexOutput.value = "Erro: " + e.message;
      }
    });

    b64HexCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(b64HexOutput.value).then(() => {
        const original = b64HexCopyBtn.innerText;
        b64HexCopyBtn.innerText = "Copiado!";
        setTimeout(() => (b64HexCopyBtn.innerText = original), 1500);
      });
    });
  },
};

export default base64hex;
