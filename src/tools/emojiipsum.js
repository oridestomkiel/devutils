const emojiipsum = {
  title: "Gerador de Texto Aleatório com Emojis",
  description:
    "Crie textos divertidos e aleatórios recheados de emojis. Ideal para testes visuais, placeholders criativos e conteúdo de exemplo.",
  tags: [
    "texto aleatório",
    "gerador de emojis",
    "texto com emojis",
    "placeholder divertido",
    "emoji generator",
    "lorem ipsum com emoji",
    "gerar texto criativo",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="block text-sm text-gray-300 mb-1">Parágrafos</label>
        <input
          type="number"
          id="emojiIpsumCount"
          value="2"
          class="w-full p-2 bg-gray-700 rounded text-white"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-300 mb-1">Estilo</label>
        <select
          id="emojiIpsumStyle"
          class="w-full p-2 bg-gray-700 rounded text-white"
        >
          <option value="casual">Casual</option>
          <option value="tech">Tech</option>
          <option value="funny">Zoado</option>
          <option value="mix">Misturado</option>
        </select>
      </div>
    </div>

    <button
      id="emojiIpsumGen"
      class="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded"
    >
      Gerar Texto
    </button>
    <div class="mt-4 flex gap-2">
      <textarea
        id="emojiIpsumOutput"
        rows="6"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full text-sm"
        placeholder="Resultado aparecerá aqui"
      ></textarea>
      <button
        id="emojiIpsumCopy"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded self-start"
      >
        Copiar
      </button>
    </div>
  `,
  init: () => {
    const presets = {
      casual: [
        "Lorem ipsum 😎 dolor sit amet, consectetur ✨ adipiscing elit 🥐.",
        "Pellentesque 🍕 habitant morbi 🍟 tristique senectus 😴.",
        "Vivamus commodo 🚀 massa ut ultricies 💼 fermentum 🛴.",
        "Aenean 🎯 sed nisi 🥲 sed justo 🔥 fringilla dapibus.",
      ],
      tech: [
        "Deploy 🚀 na main sem testar, sucesso garantido 🧨.",
        "Meu bug, minhas regras 🐞🧑‍💻.",
        "Refatorando o caos em TypeScript 🤯.",
        "Stack overflow salvou mais uma vez 🙏.",
        "const vida = { dev: true } 😵‍💫",
      ],
      funny: [
        "Café ☕ é o compilador da alma 🧠.",
        "Já dizia Confúcio: 'console.log ou nada' 🧘‍♂️.",
        "JS é tipo feitiçaria moderna 🧙‍♀️.",
        "function namoral() { return '🔥' }",
        "While(true) → burnout garantido 😬",
      ],
      mix: [],
    };
    presets.mix = [...presets.casual, ...presets.tech, ...presets.funny];

    const genBtn = document.getElementById("emojiIpsumGen");
    const countEl = document.getElementById("emojiIpsumCount");
    const styleEl = document.getElementById("emojiIpsumStyle");
    const outputEl = document.getElementById("emojiIpsumOutput");
    const copyBtn = document.getElementById("emojiIpsumCopy");

    genBtn.addEventListener("click", () => {
      const count = parseInt(countEl.value, 10);
      const style = styleEl.value;
      const source = presets[style] || presets.mix;
      let result = "";
      for (let i = 0; i < count; i++) {
        const shuffled = [...source].sort(() => 0.5 - Math.random());
        const p = shuffled.slice(0, Math.ceil(Math.random() * 3 + 2)).join(" ");
        result += p + "\n\n";
      }
      outputEl.value = result.trim();
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(outputEl.value).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copiado!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default emojiipsum;
