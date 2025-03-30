const helloworld = {
  title: "Hello World em Várias Linguagens",
  description:
    "Visualize o clássico Hello World em dezenas de linguagens de programação. Ideal para aprendizado ou curiosidade.",
  tags: [
    "hello world",
    "linguagens de programação",
    "exemplo de código",
    "educacional",
    "códigos básicos",
    "gerador de código",
  ],
  category: "Outros",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.0",

  render: () => `
      <select id="helloLangSelect" class="w-full p-2 bg-gray-700 rounded mb-2 text-white">
        <option value="" disabled selected>Escolha uma linguagem</option>
      </select>
  
      <textarea
        id="helloOutput"
        class="w-full p-2 bg-gray-700 text-green-400 rounded mb-2"
        rows="8"
        readonly
      ></textarea>
  
      <div class="flex justify-end">
        <button id="helloCopyBtn" class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">Copiar</button>
      </div>
    `,

  init: async () => {
    const select = document.getElementById("helloLangSelect");
    const output = document.getElementById("helloOutput");
    let langs = {};

    try {
      const response = await fetch("/data/helloworld.json");
      langs = await response.json();
    } catch (err) {
      console.error("Erro ao carregar JSON:", err);
      return;
    }

    for (const lang of Object.keys(langs).sort()) {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      select.appendChild(option);
    }

    select.addEventListener("change", () => {
      const lang = select.value;
      const code = langs[lang];

      if (!code) return;

      output.value = "";
      let i = 0;
      const interval = setInterval(() => {
        if (i < code.length) {
          output.value += code[i++];
        } else {
          clearInterval(interval);
        }
      }, 10);
    });

    document.getElementById("helloCopyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value).then(() => {
        const btn = document.getElementById("helloCopyBtn");
        const original = btn.innerText;
        btn.innerText = "Copiado!";
        setTimeout(() => (btn.innerText = original), 1500);
      });
    });
  },
};

export default helloworld;
