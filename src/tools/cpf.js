const cpf = {
  title: "Gerador de CPF",
  description:
    "Gere números de CPF válidos para testes e desenvolvimento. Agora com suporte a múltiplos CPFs e formatação opcional.",
  tags: [
    "gerador de cpf",
    "cpf válido",
    "cpf para teste",
    "cpf fake",
    "número de cpf",
    "simulador de cpf",
    "teste de formulários",
    "múltiplos",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render: () => `
    <div class="space-y-3">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="formatCheck" checked />
          <span>Formatar com máscara</span>
        </label>

        <label class="text-sm flex items-center gap-2">
          <input type="checkbox" id="multiCheck" />
          <span>Gerar múltiplos</span>
        </label>

        <input type="number" id="cpfQtd" class="bg-gray-700 p-1 rounded w-20 text-sm" value="10" min="1" max="1000" />
      </div>

      <button id="cpfBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Gerar CPF</button>

      <div class="mt-2 flex gap-2">
        <textarea id="cpfOutput" readonly class="p-2 bg-gray-700 text-green-400 rounded w-full h-40 font-mono resize-none" placeholder="CPFs gerados aparecerão aqui"></textarea>
      </div>
      <button id="cpfCopyBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Copiar</button>
    </div>
  `,

  init: () => {
    const $ = (id) => document.getElementById(id);
    const output = $("cpfOutput");

    const limpar = (str) => str.replace(/\D/g, "");

    const calcDv = (base, peso) => {
      const soma = base
        .split("")
        .reduce((acc, val, idx) => acc + parseInt(val) * (peso - idx), 0);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const generateCPFValido = () => {
      let digitos = "";
      for (let i = 0; i < 9; i++) {
        digitos += Math.floor(Math.random() * 9).toString();
      }
      const dv1 = calcDv(digitos, 10);
      const dv2 = calcDv(digitos + dv1, 11);
      return digitos + dv1 + dv2;
    };

    const formatCPF = (rawCPF) =>
      rawCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

    const gerarCPFs = () => {
      const formatar = $("formatCheck").checked;
      const multiplo = $("multiCheck").checked;
      const qtd = parseInt($("cpfQtd").value) || 1;

      let lista = [];

      for (let i = 0; i < (multiplo ? qtd : 1); i++) {
        const raw = generateCPFValido();
        lista.push(formatar ? formatCPF(raw) : raw);
      }

      output.value = lista.join("\n");
    };

    $("cpfBtn").addEventListener("click", gerarCPFs);
    $("multiCheck").addEventListener("change", gerarCPFs);
    $("formatCheck").addEventListener("change", gerarCPFs);
    $("cpfQtd").addEventListener("input", gerarCPFs);

    $("cpfCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const original = $("cpfCopyBtn").innerText;
        $("cpfCopyBtn").innerText = "Copiado!";
        setTimeout(() => ($("cpfCopyBtn").innerText = original), 1500);
      });
    });

    gerarCPFs();
  },
};

export default cpf;
