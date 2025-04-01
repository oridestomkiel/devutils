const validacc = {
  title: "Validador de Cartão de Crédito",
  description:
    "Digite um número de cartão e descubra se ele é válido usando o algoritmo de Luhn. Detecta a bandeira automaticamente.",
  tags: ["cartão", "validador", "luhn", "número", "crédito", "bandeira"],
  category: "Utilitários",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",

  render: () => `
    <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
      <div>
        <label class="block mb-1">Número do Cartão:</label>
        <input type="text" id="cardNumber" placeholder="Ex: 4111 1111 1111 1111" class="w-full p-2 rounded bg-gray-700 text-white" />
      </div>

      <button id="btnValidar" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm">
        Validar Cartão
      </button>

      <div id="resultado" class="text-sm font-semibold mt-2"></div>
    </div>
  `,

  init: () => {
    const cardInput = document.getElementById("cardNumber");
    const resultado = document.getElementById("resultado");

    const validarLuhn = (numero) => {
      const limpo = numero.replace(/\D/g, "");
      let soma = 0;
      let par = false;
      for (let i = limpo.length - 1; i >= 0; i--) {
        let digito = parseInt(limpo[i]);
        if (par) {
          digito *= 2;
          if (digito > 9) digito -= 9;
        }
        soma += digito;
        par = !par;
      }
      return soma % 10 === 0;
    };

    const detectarBandeira = (num) => {
      const re = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
      };
      for (const [bandeira, regex] of Object.entries(re)) {
        if (regex.test(num)) return bandeira.toUpperCase();
      }
      return "Desconhecida";
    };

    document.getElementById("btnValidar").addEventListener("click", () => {
      const numero = cardInput.value.replace(/\s+/g, "");
      if (!numero.match(/^\d{12,19}$/)) {
        resultado.textContent = "❌ Número inválido ou incompleto.";
        resultado.className = "text-sm font-semibold text-yellow-400 mt-2";
        return;
      }

      const bandeira = detectarBandeira(numero);

      if (validarLuhn(numero)) {
        resultado.textContent = `✅ Válido (${bandeira})`;
        resultado.className = "text-sm font-semibold text-green-400 mt-2";
      } else {
        resultado.textContent = `❌ Inválido (${bandeira})`;
        resultado.className = "text-sm font-semibold text-red-400 mt-2";
      }
    });
  },
};

export default validacc;
