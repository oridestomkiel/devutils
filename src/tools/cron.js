const cron = {
  title: "Construtor de Expressões CRON",
  description:
    "Crie expressões CRON de forma simples e intuitiva. Ideal para agendar tarefas em servidores, aplicações backend e automações.",
  tags: [
    "expressão cron",
    "cron builder",
    "agendamento de tarefas",
    "cronjob",
    "gerador de cron",
    "cron linux",
    "agendar comandos",
    "cron expression",
  ],
  category: "Geradores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.0",
  render: () => `
    <input
      id="cronInput"
      type="text"
      placeholder="Ex: */5 * * * *"
      class="w-full p-2 bg-gray-700 rounded mb-2 text-white"
    />
    <button
      id="cronExplainBtn"
      class="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded"
    >
      Explicar
    </button>

    <div class="mt-2 flex gap-2">
      <textarea
        id="cronOutput"
        rows="5"
        readonly
        class="p-2 bg-gray-700 text-green-400 rounded w-full"
        placeholder="Explicação será exibida aqui"
      ></textarea>
      <button
        id="cronCopyBtn"
        class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        Copiar
      </button>
    </div>

    <small class="text-gray-400 block mt-4">
      Formato: minuto hora dia-do-mês mês dia-da-semana
    </small>
  `,
  init: () => {
    const cronInput = document.getElementById("cronInput");
    const cronExplainBtn = document.getElementById("cronExplainBtn");
    const cronOutput = document.getElementById("cronOutput");
    const cronCopyBtn = document.getElementById("cronCopyBtn");

    const labels = [
      "Minuto (0-59)",
      "Hora (0-23)",
      "Dia do Mês (1-31)",
      "Mês (1-12)",
      "Dia da Semana (0=Domingo até 6=Sábado)",
    ];

    cronExplainBtn.addEventListener("click", () => {
      const expr = cronInput.value.trim();
      const parts = expr.split(" ");

      if (parts.length !== 5) {
        cronOutput.value = "Expressão inválida. Deve ter 5 campos.";
        return;
      }

      const explanation = parts
        .map((val, i) => `${labels[i]}: ${val}`)
        .join("\n");

      cronOutput.value = explanation;
    });

    cronCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(cronOutput.value).then(() => {
        const originalText = cronCopyBtn.innerText;
        cronCopyBtn.innerText = "Copiado!";
        setTimeout(() => {
          cronCopyBtn.innerText = originalText;
        }, 1500);
      });
    });
  },
};

export default cron;
