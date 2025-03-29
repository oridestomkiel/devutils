const passwordgen = {
  title: "Gerador de Senha aleatória",
  description:
    "Crie senhas fortes e seguras aleatoriamente. Ideal para proteger contas e dados sensíveis.",
  tags: [
    "senha aleatória",
    "gerador de senha",
    "senha forte",
    "password generator",
    "segurança de dados",
    "gerar senhas",
    "proteção de contas",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="flex items-center gap-2 mb-2">
      <label for="pwLength" class="text-sm">Tamanho</label>
      <input id="pwLength" type="number" min="4" max="64" value="16" class="p-2 bg-gray-700 rounded w-24 text-white" />
    </div>

    <div class="grid grid-cols-2 gap-2 mb-4">
      <label class="flex items-center gap-2">
        <input type="checkbox" id="pwSymbols" checked />
        <span class="text-sm">Incluir símbolos</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" id="pwNumbers" checked />
        <span class="text-sm">Incluir números</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" id="pwUppercase" checked />
        <span class="text-sm">Incluir maiúsculas</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" id="pwLowercase" checked />
        <span class="text-sm">Incluir minúsculas</span>
      </label>
    </div>
    <button id="pwGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Gerar Senha</button>
    <div class="mt-2 flex gap-2">
      <input
        id="pwOutput"
        type="text"
        value="Clique em gerar"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
      />
      <button id="pwCopyBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%&*-=+_?<>",
    };

    const generatePassword = (length, useSymbols, useNumbers, useUpper) => {
      let base = charset.lowercase;
      if (useUpper) base += charset.uppercase;
      if (useNumbers) base += charset.numbers;
      if (useSymbols) base += charset.symbols;

      if (!base) return "❌ Selecione pelo menos um tipo de caractere.";

      return Array.from(
        { length },
        () => base[Math.floor(Math.random() * base.length)]
      ).join("");
    };

    document.getElementById("pwGenBtn").addEventListener("click", () => {
      const length = parseInt(document.getElementById("pwLength").value);
      const useSymbols = document.getElementById("pwSymbols").checked;
      const useNumbers = document.getElementById("pwNumbers").checked;
      const useUpper = document.getElementById("pwUppercase").checked;

      const senha = generatePassword(length, useSymbols, useNumbers, useUpper);
      document.getElementById("pwOutput").value = senha;
    });

    document.getElementById("pwCopyBtn").addEventListener("click", () => {
      const senha = document.getElementById("pwOutput").value;
      navigator.clipboard.writeText(senha).then(() => {
        const btn = document.getElementById("pwCopyBtn");
        const original = btn.innerText;
        btn.innerText = "Copiado!";
        setTimeout(() => (btn.innerText = original), 1500);
      });
    });
  },
};

export default passwordgen;
