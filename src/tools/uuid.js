const uuid = {
  title: "Gerador de UUID",
  description:
    "Gere UUIDs únicos (v4 ou v1) com opção de múltiplos resultados. Ideal para testes, registros e identificação global de objetos.",
  tags: [
    "uuid",
    "gerador de uuid",
    "uuid v4",
    "uuid v1",
    "identificador único",
    "uuid em lote",
  ],
  category: "Identificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",
  render: () => `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
      <select id="uuidVersion" class="w-full p-2 bg-gray-700 text-white rounded">
        <option value="v4" selected>UUID v4 (aleatório)</option>
        <option value="v1">UUID v1 (timestamp)</option>
      </select>
      <input id="uuidCount" type="number" min="1" max="100" value="1" class="w-full p-2 bg-gray-700 text-white rounded" placeholder="Quantidade" />
    </div>

    <button id="uuidBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-2 w-full">Gerar UUID(s)</button>

    <div class="relative mb-2">
      <textarea id="uuidOutput" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-24" rows="6" readonly placeholder="UUIDs gerados aparecerão aqui..."></textarea>
      <button id="copyUuidBtn" class="absolute top-2 right-20 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <button id="downloadUuidBtn" class="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Baixar</button>
      <span id="copiedUuidMsg" class="absolute top-2 right-2 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const output = document.getElementById("uuidOutput");
    const version = document.getElementById("uuidVersion");
    const countInput = document.getElementById("uuidCount");
    const copyBtn = document.getElementById("copyUuidBtn");
    const copiedMsg = document.getElementById("copiedUuidMsg");
    const downloadBtn = document.getElementById("downloadUuidBtn");

    const generateV4 = () => {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    };

    const generateV1 = () => {
      const hex = (n, p) => Math.floor(n).toString(16).padStart(p, "0");
      const time = Date.now();
      const rand = crypto.getRandomValues(new Uint8Array(8));

      return [
        hex(time, 8),
        hex((time / 0x100000000) & 0xffff, 4),
        "1" + hex(rand[0] & 0xfff, 3),
        hex((rand[1] & 0x3f) | 0x80, 2) + hex(rand[2], 2),
        Array.from(rand.slice(3))
          .map((b) => hex(b, 2))
          .join(""),
      ].join("-");
    };

    document.getElementById("uuidBtn").addEventListener("click", () => {
      const type = version.value;
      const count = Math.min(parseInt(countInput.value, 10) || 1, 100);
      const gen = type === "v1" ? generateV1 : generateV4;
      const uuids = Array.from({ length: count }, gen).join("\n");
      output.value = uuids;
    });

    copyBtn.addEventListener("click", () => {
      const text = output.value.trim();
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
      link.download = `uuids-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },
};

export default uuid;
