const geracc = {
  title: "Gerador de Cartão de Crédito",
  description:
    "Gere números de cartão válidos para testes e desenvolvimento. Suporta múltiplas bandeiras e gera CVV e validade aleatórios.",
  tags: ["cartão", "gerador", "luhn", "bandeira", "crédito", "testes"],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <div>
          <label class="block mb-2">Selecione a bandeira:</label>
          <select id="ccBrand" class="w-full p-2 bg-gray-700 text-white rounded">
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="amex">American Express</option>
            <option value="discover">Discover</option>
            <option value="diners">Diners Club</option>
            <option value="jcb">JCB</option>
          </select>
        </div>
  
        <button id="btnGerar" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
          Gerar Cartão
        </button>
  
        <div>
          <label class="block mt-4 mb-1">Número do Cartão:</label>
          <div class="flex gap-2 items-center">
            <input id="numCartao" class="w-full p-2 bg-gray-700 rounded text-green-400" readonly />
            <button id="copyNum" class="bg-gray-700 px-3 rounded h-[36px] flex items-center justify-center">📋</button>
            <span id="copiadoNum" class="text-xs text-green-400 hidden">Copiado!</span>
          </div>
  
          <label class="block mt-4 mb-1">Data de Validade:</label>
          <div class="flex gap-2 items-center">
            <input id="validade" class="w-full p-2 bg-gray-700 rounded text-green-400" readonly />
            <button id="copyVal" class="bg-gray-700 px-3 rounded h-[36px] flex items-center justify-center">📋</button>
            <span id="copiadoVal" class="text-xs text-green-400 hidden">Copiado!</span>
          </div>
  
          <label class="block mt-4 mb-1">CVV:</label>
          <div class="flex gap-2 items-center">
            <input id="cvv" class="w-full p-2 bg-gray-700 rounded text-green-400" readonly />
            <button id="copyCvv" class="bg-gray-700 px-3 rounded h-[36px] flex items-center justify-center">📋</button>
            <span id="copiadoCvv" class="text-xs text-green-400 hidden">Copiado!</span>
          </div>
        </div>
      </div>
    `,

  init: () => {
    const gerarLuhn = (prefix, length) => {
      let num = prefix;
      while (num.length < length - 1) {
        num += Math.floor(Math.random() * 10);
      }

      let sum = 0;
      let shouldDouble = true;
      for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num[i]);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }

      const checkDigit = (10 - (sum % 10)) % 10;
      return num + checkDigit;
    };

    const aplicarMascara = (numero) => {
      return numero.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    };

    const gerarData = () => {
      const now = new Date();
      const ano = now.getFullYear() + Math.floor(Math.random() * 5) + 1;
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      return `${mes}/${ano}`;
    };

    const gerarCvv = () => {
      return String(Math.floor(100 + Math.random() * 900));
    };

    const bandeiras = {
      visa: { prefixos: ["4"], tamanho: 16 },
      mastercard: { prefixos: ["51", "52", "53", "54", "55"], tamanho: 16 },
      amex: { prefixos: ["34", "37"], tamanho: 15 },
      discover: { prefixos: ["6011", "65"], tamanho: 16 },
      diners: { prefixos: ["300", "301", "305", "36", "38"], tamanho: 14 },
      jcb: { prefixos: ["35"], tamanho: 16 },
    };

    const gerar = () => {
      const tipo = document.getElementById("ccBrand").value;
      const config = bandeiras[tipo];
      const prefixo =
        config.prefixos[Math.floor(Math.random() * config.prefixos.length)];
      return gerarLuhn(prefixo, config.tamanho);
    };

    const copiarComAviso = (inputId, spanId) => {
      const el = document.getElementById(inputId);
      navigator.clipboard.writeText(el.value).then(() => {
        const aviso = document.getElementById(spanId);
        aviso.classList.remove("hidden");
        setTimeout(() => aviso.classList.add("hidden"), 1500);
      });
    };

    document.getElementById("btnGerar").addEventListener("click", () => {
      const numero = gerar();
      document.getElementById("numCartao").value = aplicarMascara(numero);
      document.getElementById("validade").value = gerarData();
      document.getElementById("cvv").value = gerarCvv();
    });

    document
      .getElementById("copyNum")
      .addEventListener("click", () =>
        copiarComAviso("numCartao", "copiadoNum")
      );
    document
      .getElementById("copyVal")
      .addEventListener("click", () =>
        copiarComAviso("validade", "copiadoVal")
      );
    document
      .getElementById("copyCvv")
      .addEventListener("click", () => copiarComAviso("cvv", "copiadoCvv"));
  },
};

export default geracc;
