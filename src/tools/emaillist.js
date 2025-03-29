const emaillist = {
  title: "Gerador de lista de emails aleatórios",
  description:
    "Gere endereços de email fictícios para testes, cadastros simulados e validação de formulários. Perfeito para ambientes de desenvolvimento.",
  tags: [
    "gerador de email",
    "emails aleatórios",
    "email fake",
    "lista de emails",
    "emails para teste",
    "email fictício",
    "email para desenvolvimento",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="grid grid-cols-2 gap-2 mb-2">
      <input id="emailCount" type="number" min="1" value="10" class="p-2 bg-gray-700 rounded" placeholder="Qtd de emails" />
      <input id="emailDomain" type="text" value="example.com" class="p-2 bg-gray-700 rounded" placeholder="Domínio (ex: gmail.com)" />
    </div>
    <button id="emailGenBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Gerar</button>
    <textarea id="emailOutput" class="w-full p-2 bg-gray-700 rounded mt-2" rows="6" readonly placeholder="Emails gerados aparecerão aqui"></textarea>
    <button id="emailCopyBtn" class="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Copiar</button>
  `,
  init: () => {
    const genNome = () => {
      const nomes = [
        "joao",
        "maria",
        "ana",
        "carlos",
        "lucas",
        "paula",
        "rafa",
        "leo",
        "isa",
        "duda",
      ];
      const sobrenomes = [
        "silva",
        "souza",
        "oliveira",
        "costa",
        "pereira",
        "ferreira",
        "santos",
      ];
      const n = nomes[Math.floor(Math.random() * nomes.length)];
      const s = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${n}.${s}${Math.floor(Math.random() * 1000)}`;
    };

    const emailGenBtn = document.getElementById("emailGenBtn");
    const emailCountEl = document.getElementById("emailCount");
    const emailDomainEl = document.getElementById("emailDomain");
    const emailOutput = document.getElementById("emailOutput");
    const emailCopyBtn = document.getElementById("emailCopyBtn");

    emailGenBtn.addEventListener("click", () => {
      const qtd = parseInt(emailCountEl.value, 10);
      const dominio = emailDomainEl.value.trim();
      if (!dominio || qtd <= 0) {
        emailOutput.value = "❌ Verifique a quantidade e o domínio.";
        return;
      }
      const lista = Array.from(
        { length: qtd },
        () => `${genNome()}@${dominio}`
      );
      emailOutput.value = lista.join("\n");
    });

    emailCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(emailOutput.value).then(() => {
        const original = emailCopyBtn.innerText;
        emailCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          emailCopyBtn.innerText = original;
        }, 1500);
      });
    });
  },
};

export default emaillist;
