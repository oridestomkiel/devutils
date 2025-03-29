const jsonminify = {
  title: "Minificador de JSON",
  description:
    "Remova espaços, quebras de linha e caracteres desnecessários do seu JSON. Ideal para reduzir o tamanho de arquivos e otimizar aplicações.",
  tags: [
    "minificador de json",
    "json minify",
    "reduzir json",
    "compactar json",
    "json otimizado",
    "remover espaços json",
    "json sem formatação",
  ],
  category: "Formatadores / Minificadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea id="jsonMinInput" class="w-full p-2 bg-gray-700 rounded mb-2" rows="6" placeholder="Cole seu JSON aqui..."></textarea>
    <button id="jsonMinBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Minificar</button>
    <textarea id="jsonMinOutput" class="w-full p-2 bg-gray-700 rounded mt-2" rows="4" readonly placeholder="JSON minificado aparecerá aqui"></textarea>
    <button id="jsonMinCopy" class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Copiar</button>
  `,
  init: () => {
    document.getElementById("jsonMinBtn").addEventListener("click", () => {
      const input = document.getElementById("jsonMinInput").value;
      const output = document.getElementById("jsonMinOutput");

      try {
        const obj = JSON.parse(input);
        output.value = JSON.stringify(obj);
      } catch (e) {
        output.value = "❌ JSON inválido.";
      }
    });

    document.getElementById("jsonMinCopy").addEventListener("click", () => {
      const out = document.getElementById("jsonMinOutput");
      if (out.value && out.value !== "❌ JSON inválido.") {
        out.select();
        document.execCommand("copy");
      }
    });
  },
};
export default jsonminify;
