const httpsim = {
  title: "Simulador de erro HTTP",
  description:
    "Simule códigos de erro HTTP como 404, 500, 403 e outros para testar comportamentos de aplicações e respostas de front-end.",
  tags: [
    "simulador de http",
    "erro http",
    "testar erro 404",
    "simular erro 500",
    "códigos http",
    "resposta http falsa",
    "debug de api",
    "http status code",
  ],
  category: "Redes / HTTP",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <label class="block text-sm text-gray-300 mb-1">Código HTTP para simular</label>
    <input id="httpCode" type="number" min="100" max="599" placeholder="Ex: 404" class="w-full p-2 bg-gray-700 rounded mb-2" />
    <button id="httpSimBtn" class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded w-full">Simular</button>
    <div id="httpSimOutput" class="mt-4 text-sm text-center break-words"></div>
  `,
  init: () => {
    document.getElementById("httpSimBtn").addEventListener("click", () => {
      const code = document.getElementById("httpCode").value.trim();
      const output = document.getElementById("httpSimOutput");

      if (!code || isNaN(code)) {
        output.innerHTML = "❌ Código inválido.";
        return;
      }

      fetch(`https://httpstat.us/${code}`)
        .then((res) => {
          output.innerHTML = `
            🧾 <strong>Status:</strong> ${res.status} ${res.statusText}<br/>
            🔗 <a href="https://httpstat.us/${code}" target="_blank" class="underline text-blue-400">Ver resposta completa</a>
          `;
        })
        .catch((err) => {
          output.innerHTML = `❌ Erro ao simular: ${err.message}`;
        });
    });
  },
};
export default httpsim;
