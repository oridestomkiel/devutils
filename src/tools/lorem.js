const lorem = {
  title: "Gerador de Lorem Ipsum",
  description:
    "Gere textos fictícios padrão Lorem Ipsum para usar como placeholder em designs, layouts e testes de conteúdo.",
  tags: [
    "lorem ipsum",
    "texto fictício",
    "gerador de texto",
    "texto para layout",
    "placeholder de conteúdo",
    "texto simulado",
    "conteúdo de teste",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",
  render: () => `
    <div class="flex flex-col gap-2 mb-2">
      <input id="loremCount" type="number" min="1" max="100" value="5" class="w-full p-2 bg-gray-700 rounded text-white" />
      <select id="loremType" class="w-full p-2 bg-gray-700 rounded text-white">
        <option value="paragraphs">Parágrafos</option>
        <option value="words">Palavras</option>
        <option value="bytes">Bytes</option>
        <option value="lists">Listas</option>
      </select>
      <div id="loremStartContainer" class="text-sm text-white flex gap-2 items-center">
        <input type="checkbox" id="loremStart" checked />
        <label for="loremStart">Começar com "Lorem ipsum dolor sit amet..."</label>
      </div>
    </div>
    <button id="loremBtn" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">Gerar</button>
    <div class="relative mt-2">
      <pre id="loremOutput" class="text-green-400 whitespace-pre-wrap break-words pr-16"> </pre>
      <button id="copyLoremBtn" class="absolute top-0 right-0 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedLoremMsg" class="absolute top-0 right-0 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: async () => {
    const output = document.getElementById("loremOutput");
    const copyBtn = document.getElementById("copyLoremBtn");
    const copiedMsg = document.getElementById("copiedLoremMsg");
    const btn = document.getElementById("loremBtn");

    let fullText = "";

    try {
      const res = await fetch(
        "https://devutils.zmohouse.com.br/data/lorem.json"
      );
      const json = await res.json();
      fullText = json.text || "";
    } catch (err) {
      output.innerText = "Erro ao carregar texto Lorem Ipsum.";
      btn.disabled = true;
      return;
    }

    const typeSelect = document.getElementById("loremType");
    const startContainer = document.getElementById("loremStartContainer");

    typeSelect.addEventListener("change", () => {
      const isParagraph = typeSelect.value === "paragraphs";
      startContainer.style.display = isParagraph ? "flex" : "none";

      output.innerText = "";

      if (!isParagraph) {
        document.getElementById("loremStart").checked = false;
      }
    });

    startContainer.style.display =
      typeSelect.value === "paragraphs" ? "flex" : "none";

    btn.addEventListener("click", () => {
      const count = parseInt(document.getElementById("loremCount").value, 10);
      const type = document.getElementById("loremType").value;
      const start = document.getElementById("loremStart").checked;
      const loremStart =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nunc purus, gravida non dignissim iaculis, pretium sed metus. Quisque faucibus, lacus a vulputate fermentum, lacus erat feugiat risus, non fringilla ligula eros eu sem. Integer consectetur, sem suscipit pellentesque auctor, neque velit fermentum mi, id elementum eros felis at nisi. Aenean consectetur gravida dui, vel porta diam aliquam et. Aliquam volutpat, lectus ut convallis vestibulum, ligula leo fringilla neque, non fringilla justo tortor non purus. Proin consequat erat vitae tellus pharetra, in malesuada eros rutrum. Integer sed massa dignissim, efficitur eros vitae, rhoncus nisi. Sed gravida rutrum est at venenatis.";

      const cleanText = fullText.replace(/\s+/g, " ").trim();
      const paragraphs = fullText.split(/\n+/).filter(Boolean);
      const words = cleanText.split(" ");

      let result = "";

      const randomPick = (arr, n) => {
        const copy = [...arr];
        const res = [];
        while (res.length < n && copy.length) {
          const i = Math.floor(Math.random() * copy.length);
          res.push(copy.splice(i, 1)[0]);
        }
        return res;
      };

      switch (type) {
        case "paragraphs":
          result = randomPick(paragraphs, count).join("\n\n");
          break;
        case "words":
          result = randomPick(words, count).join(" ");
          break;
        case "bytes":
          const startIndex = Math.floor(
            Math.random() * Math.max(1, cleanText.length - count)
          );
          result = cleanText.slice(startIndex, startIndex + count);
          break;
        case "lists":
          result = randomPick(words, count)
            .map((w) => `• ${w}`)
            .join("\n");
          break;
      }

      if (start && !result.startsWith("Lorem ipsum")) {
        result = `${loremStart}\n\n${result}`;
      }

      output.innerText = result;
    });

    copyBtn.addEventListener("click", () => {
      const text = output.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
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

export default lorem;
