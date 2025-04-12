const image_to_base64_converter = {
  title: "Imagem → Base64",
  description:
    "Converta arquivos de imagem em strings Base64 rapidamente. Ideal para embutir em HTML, CSS ou JSON.",
  tags: [
    "base64",
    "converter imagem",
    "imagem para base64",
    "img to base64",
    "data URI",
    "embed image",
    "inline image",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
  <input
    type="file"
    accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
    id="imgInput"
    class="mb-2 text-sm text-gray-800 dark:text-white"
  />

  <div class="mt-2 flex gap-2">
    <textarea
      id="imgBase64Output"
      class="w-full p-2 bg-white border border-gray-300 rounded text-green-600 dark:bg-gray-700 dark:border-gray-700 dark:text-green-400"
      rows="6"
      readonly
    ></textarea>

    <button
      id="imgCopyBtn"
      class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded h-fit text-white dark:bg-gray-600 dark:hover:bg-gray-500"
    >
      Copiar
    </button>
  </div>
  `,
  init: () => {
    const input = document.getElementById("imgInput");
    const output = document.getElementById("imgBase64Output");
    const copyBtn = document.getElementById("imgCopyBtn");

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        output.value = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });
  },
};

export default image_to_base64_converter;
