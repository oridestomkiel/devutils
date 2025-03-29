const httpheaders = {
  title: "Viewer de Headers HTTP (Raw Request)",
  description:
    "Visualize o conteúdo bruto de headers HTTP em requisições. Ideal para debug, análise de tráfego e desenvolvimento web.",
  tags: [
    "headers http",
    "visualizar headers",
    "raw request",
    "análise http",
    "requisição http",
    "http request viewer",
    "debug de requisição",
    "inspecionar headers",
  ],
  category: "Redes / HTTP",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <textarea id="httpRawInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="Cole aqui uma requisição HTTP (raw)"></textarea>
    <button id="httpParseBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded">Analisar</button>
    <pre id="httpHeadersOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words"></pre>
  `,
  init: () => {
    document.getElementById("httpParseBtn").addEventListener("click", () => {
      const input = document.getElementById("httpRawInput").value.trim();
      const lines = input.split(/\r?\n/);
      const output = document.getElementById("httpHeadersOutput");

      if (!lines.length) {
        output.innerText = "Nada para analisar.";
        return;
      }

      let parsed = "";

      parsed += `🔹 Método e Rota:\n${lines[0]}\n\n🔹 Cabeçalhos:\n`;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) break;
        const [key, ...rest] = line.split(":");
        const value = rest.join(":").trim();
        parsed += `• ${key.trim()}: ${value}\n`;
      }

      output.innerText = parsed;
    });
  },
};
export default httpheaders;
