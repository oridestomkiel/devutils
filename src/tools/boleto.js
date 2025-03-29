const boleto = {
  title: "Validador de boletos bancários",
  description:
    "Valide rapidamente boletos bancários brasileiros, verificando dígitos e estrutura do código de barras. Ideal para testes, automações e verificação de pagamentos.",
  tags: [
    "validador de boletos",
    "validar boleto bancário",
    "verificador de boleto",
    "boleto online",
    "código de barras boleto",
    "validação boleto",
    "boleto bancário",
  ],
  category: "Validadores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea
      id="boletoInput"
      class="w-full p-2 bg-gray-700 rounded mb-2"
      rows="2"
      placeholder="Digite o número do boleto"
    ></textarea>
    <button
      id="boletoValidateBtn"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      Validar Boleto
    </button>

    <div class="mt-2 flex gap-2">
      <input
        id="boletoOutput"
        type="text"
        value=""
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button
        id="boletoCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const boletoInput = document.getElementById("boletoInput");
    const boletoOutput = document.getElementById("boletoOutput");
    const validateBtn = document.getElementById("boletoValidateBtn");
    const copyBtn = document.getElementById("boletoCopyBtn");

    const modulo10 = (num) => {
      let soma = 0,
        peso = 2;
      for (let i = num.length - 1; i >= 0; i--) {
        let calc = num[i] * peso;
        if (calc > 9) calc = Math.floor(calc / 10) + (calc % 10);
        soma += calc;
        peso = peso === 2 ? 1 : 2;
      }
      const resto = soma % 10;
      return resto === 0 ? 0 : 10 - resto;
    };

    const modulo11 = (num) => {
      let soma = 0,
        peso = 2;
      for (let i = num.length - 1; i >= 0; i--) {
        soma += parseInt(num[i]) * peso;
        peso = peso < 9 ? peso + 1 : 2;
      }
      const resto = soma % 11;
      const dv = 11 - resto;
      return dv === 0 || dv === 10 || dv === 11 ? 1 : dv;
    };

    const formatValor = (str) => {
      const val = parseInt(str, 10) / 100;
      return val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    const isBoletoValido = (num) => {
      if (num.length === 47) {
        const campos = [
          { campo: num.slice(0, 9), dv: num[9] },
          { campo: num.slice(10, 20), dv: num[20] },
          { campo: num.slice(21, 31), dv: num[31] },
        ];
        return campos.every((c) => modulo10(c.campo) === parseInt(c.dv, 10));
      } else if (num.length === 48) {
        const campos = [
          { campo: num.slice(0, 11), dv: num[11] },
          { campo: num.slice(12, 23), dv: num[23] },
          { campo: num.slice(24, 35), dv: num[35] },
          { campo: num.slice(36, 47), dv: num[47] },
        ];
        return campos.every((c) => modulo10(c.campo) === parseInt(c.dv, 10));
      }
      return false;
    };

    validateBtn.addEventListener("click", () => {
      const input = boletoInput.value.replace(/\D/g, "");
      boletoOutput.value = "";

      if (input.length !== 47 && input.length !== 48) {
        boletoOutput.value =
          "❌ Boleto inválido. Deve conter 47 ou 48 dígitos.";
        return;
      }

      const valido = isBoletoValido(input);
      if (!valido) {
        boletoOutput.value =
          "❌ Dígitos verificadores inválidos. Boleto inválido.";
        return;
      }

      let valor = "";
      if (input.length === 47) {
        valor = input.slice(37, 47);
      }
      if (input.length === 48) {
        valor = input.slice(4, 15);
      }

      boletoOutput.value = `✅ Boleto válido. Valor detectado: ${formatValor(
        valor
      )}`;
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(boletoOutput.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default boleto;
