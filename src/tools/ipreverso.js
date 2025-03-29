const ipreverso = {
  title: "Qual é o meu IP",
  description:
    "Descubra seu endereço de IP atual e o DNS reverso correspondente. Ideal para diagnósticos de rede, segurança e verificação de conexão.",
  tags: [
    "meu ip",
    "descobrir ip",
    "qual é meu ip",
    "ip público",
    "dns reverso",
    "ip externo",
    "meu endereço ip",
  ],
  category: "Informações",
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",
  render: () => `
      <div class="p-4 rounded bg-gray-800 text-white text-sm space-y-4">
        <p>
          IP (Internet Protocol) é um endereço único atribuído a cada dispositivo conectado à internet.
        </p>
  
        <div>
          <p><strong>O meu endereço IP neste momento é:</strong></p>
          <div class="flex gap-2 mt-1">
            <input
              id="ipOutput"
              type="text"
              readonly
              value="Carregando..."
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
            <button
              id="copyIpBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Copiar
            </button>
          </div>
        </div>
  
        <div>
          <p><strong>DNS Reverso:</strong></p>
          <div class="flex gap-2 mt-1">
            <input
              id="dnsOutput"
              type="text"
              readonly
              value="Carregando..."
              class="p-2 bg-gray-700 text-green-400 rounded w-full"
            />
            <button
              id="copyDnsBtn"
              class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Copiar
            </button>
          </div>
        </div>
  
        <div>
          <p class="text-gray-300">Existem dois tipos principais de endereços IP:</p>
          <ul class="list-disc pl-5 text-gray-400">
            <li><strong>IPv4:</strong> 4 grupos de números (ex: 192.168.0.1)</li>
            <li><strong>IPv6:</strong> mais longo, com letras e números (ex: 2001:0db8:85a3::8a2e:0370:7334)</li>
          </ul>
        </div>
      </div>
    `,
  init: () => {
    fetch("https://devutils.zmohouse.com.br/api/ipinfo.json")
      .then((res) => res.json())
      .then((data) => {
        const ip = data.ip;
        const hostname = data.hostname || "Não disponível";

        const ipEl = document.getElementById("ipOutput");
        const dnsEl = document.getElementById("dnsOutput");
        const copyIpBtn = document.getElementById("copyIpBtn");
        const copyDnsBtn = document.getElementById("copyDnsBtn");

        ipEl.value = ip;
        dnsEl.value = hostname;

        copyIpBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(ip).then(() => {
            copyIpBtn.textContent = "Copiado!";
            setTimeout(() => (copyIpBtn.textContent = "Copiar"), 1500);
          });
        });

        copyDnsBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(hostname).then(() => {
            copyDnsBtn.textContent = "Copiado!";
            setTimeout(() => (copyDnsBtn.textContent = "Copiar"), 1500);
          });
        });
      })
      .catch(() => {
        document.getElementById("ipOutput").value = "Erro ao obter IP";
        document.getElementById("dnsOutput").value = "Erro ao obter DNS";
      });
  },
};

export default ipreverso;
