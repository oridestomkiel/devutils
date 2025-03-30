const base64toimg = {
  title: "Base64 → Imagem",
  description:
    "Cole um código Base64 e visualize instantaneamente a imagem correspondente. Útil para testar data URIs ou debug de embutidos.",
  tags: [
    "base64",
    "imagem",
    "decodificar imagem",
    "converter base64",
    "data URI",
    "ver imagem",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render: () => `
    <textarea
      id="base64ImgInput"
      class="w-full p-2 bg-gray-700 text-green-400 rounded mb-2"
      rows="6"
      placeholder="Cole aqui o código Base64 completo da imagem (data:image/png;base64,...)"
    ></textarea>

    <div
      id="base64ImgPreview"
      class="flex justify-center items-center min-h-[200px] bg-gray-900 border border-gray-700 rounded mb-2"
    >
      <span class="text-sm text-gray-500">Pré-visualização</span>
    </div>

    <div class="flex justify-end">
      <button
        id="base64DownloadBtn"
        class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded hidden"
      >
        Baixar imagem
      </button>
    </div>
  `,

  init: () => {
    const input = document.getElementById("base64ImgInput");
    const preview = document.getElementById("base64ImgPreview");
    const downloadBtn = document.getElementById("base64DownloadBtn");

    input.addEventListener("input", () => {
      const val = input.value.trim();

      if (!val.startsWith("data:image")) {
        preview.innerHTML = `<span class="text-sm text-red-400">Base64 inválido ou incompleto</span>`;
        downloadBtn.classList.add("hidden");
        return;
      }

      const img = document.createElement("img");
      img.src = val;
      img.alt = "Imagem Base64";
      img.className = "max-w-full max-h-96 rounded";
      preview.innerHTML = "";
      preview.appendChild(img);

      // Ativa o botão de download
      downloadBtn.classList.remove("hidden");
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = val;
        a.download = "imagem-base64.png";
        a.click();
      };
    });
  },
};

export default base64toimg;
