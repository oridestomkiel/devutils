const rg = {
  title: "Gerador de RG aleatório",
  description:
    "Gere números de RG fictícios para testes e desenvolvimento. Útil para simulações de documentos e validações em ambientes de teste.",
  tags: [
    "gerador de rg",
    "rg falso",
    "rg para teste",
    "documentos fictícios",
    "simulador de rg",
    "identidade fake",
    "gerar rg",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",
  render: () => `
    <button id="rgGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2">Gerar RG</button>
    <div class="relative">
      <input id="rgOutput" type="text" readonly class="w-full p-2 bg-gray-700 text-green-400 rounded pr-20" />
      <button id="copyRgBtn" class="absolute top-1 right-1 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedRgMsg" class="absolute top-1 right-1 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const output = document.getElementById("rgOutput");
    const copyBtn = document.getElementById("copyRgBtn");
    const copiedMsg = document.getElementById("copiedRgMsg");

    const gerarRG = () => {
      const getRand = () => Math.floor(Math.random() * 10);
      const numeros = Array.from({ length: 8 }, getRand);

      let soma = 0;
      for (let i = 0; i < 8; i++) {
        soma += numeros[i] * (9 - i);
      }

      const resto = soma % 11;
      const dv = resto === 10 ? "X" : resto;

      const rg = `${numeros.join("")}${dv}`;
      return rg.replace(/(\d{2})(\d{3})(\d{3})([0-9X])/, "$1.$2.$3-$4");
    };

    document.getElementById("rgGenBtn").addEventListener("click", () => {
      output.value = gerarRG();
    });

    copyBtn.addEventListener("click", () => {
      const value = output.value;
      if (!value) return;

      navigator.clipboard.writeText(value).then(() => {
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

export default rg;
