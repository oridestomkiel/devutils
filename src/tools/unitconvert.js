const unitconvert = {
  title: "Conversor de Unidades",
  description:
    "Converta unidades de forma inteligente e prática. Ideal para medidas de tela, distância, temperatura, tempo e mais.",
  tags: [
    "conversor de unidades",
    "converter medidas",
    "px para rem",
    "km para mi",
    "celsius fahrenheit",
    "converter peso",
    "tempo",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",
  render: () => `
    <div class="grid grid-cols-1 gap-3 mb-2">
      <input id="unitInput" type="number" class="w-full p-2 bg-gray-700 rounded text-white" placeholder="Digite o valor..." />
      <select id="unitSelect" class="w-full p-2 bg-gray-700 rounded text-white"></select>
      <button id="unitConvertBtn" class="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded">Converter</button>
    </div>
    <div class="relative">
      <textarea id="unitResult" class="w-full p-2 bg-gray-700 text-green-400 rounded pr-20" rows="3" readonly placeholder="Resultado aparece aqui..."></textarea>
      <button id="copyUnitBtn" class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedUnitMsg" class="absolute top-2 right-2 text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
    const input = document.getElementById("unitInput");
    const select = document.getElementById("unitSelect");
    const result = document.getElementById("unitResult");
    const copyBtn = document.getElementById("copyUnitBtn");
    const copiedMsg = document.getElementById("copiedUnitMsg");

    const conversions = {
      "Pixels ↔ Rem (base 16)": (val) =>
        `${val}px = ${(val / 16).toFixed(4)}rem\n${val}rem = ${(
          val * 16
        ).toFixed(2)}px`,

      "Celsius ↔ Fahrenheit": (val) =>
        `${val}°C = ${((val * 9) / 5 + 32).toFixed(1)}°F\n${val}°F = ${(
          ((val - 32) * 5) /
          9
        ).toFixed(1)}°C`,

      "Km ↔ Milhas": (val) =>
        `${val}km = ${(val * 0.621371).toFixed(3)}mi\n${val}mi = ${(
          val / 0.621371
        ).toFixed(3)}km`,

      "Metros ↔ Pés": (val) =>
        `${val}m = ${(val * 3.28084).toFixed(2)}ft\n${val}ft = ${(
          val / 3.28084
        ).toFixed(2)}m`,

      "Kg ↔ Libras": (val) =>
        `${val}kg = ${(val * 2.20462).toFixed(2)}lb\n${val}lb = ${(
          val / 2.20462
        ).toFixed(2)}kg`,

      "Horas ↔ Minutos ↔ Segundos": (val) =>
        `${val}h = ${val * 60}min = ${val * 3600}s`,

      "Centímetros ↔ Polegadas": (val) =>
        `${val}cm = ${(val / 2.54).toFixed(2)}in\n${val}in = ${(
          val * 2.54
        ).toFixed(2)}cm`,

      "Minutos ↔ Segundos": (val) =>
        `${val}min = ${val * 60}s\n${val}s = ${(val / 60).toFixed(2)}min`,

      "Dias ↔ Horas": (val) =>
        `${val}d = ${val * 24}h\n${val}h = ${(val / 24).toFixed(2)}d`,

      "Litros ↔ Galões (US)": (val) =>
        `${val}L = ${(val * 0.264172).toFixed(3)}gal (US)\n${val}gal = ${(
          val / 0.264172
        ).toFixed(3)}L`,

      "Litros ↔ Mililitros": (val) =>
        `${val}L = ${val * 1000}mL\n${val}mL = ${(val / 1000).toFixed(3)}L`,

      "Joules ↔ Calorias": (val) =>
        `${val}J = ${(val / 4.184).toFixed(2)}cal\n${val}cal = ${(
          val * 4.184
        ).toFixed(2)}J`,

      "Watts ↔ Cavalos de potência": (val) =>
        `${val}W = ${(val / 745.7).toFixed(3)}HP\n${val}HP = ${(
          val * 745.7
        ).toFixed(2)}W`,

      "Bytes ↔ KB ↔ MB": (val) =>
        `${val}B = ${(val / 1024).toFixed(2)}KB = ${(val / 1048576).toFixed(
          2
        )}MB`,

      "MB ↔ GB": (val) =>
        `${val}MB = ${(val / 1024).toFixed(2)}GB\n${val}GB = ${(
          val * 1024
        ).toFixed(2)}MB`,

      "Hectares ↔ Metros²": (val) =>
        `${val}ha = ${val * 10000}m²\n${val}m² = ${(val / 10000).toFixed(2)}ha`,

      "m² ↔ pés²": (val) =>
        `${val}m² = ${(val * 10.7639).toFixed(2)}ft²\n${val}ft² = ${(
          val / 10.7639
        ).toFixed(2)}m²`,

      "Bar ↔ Pascal": (val) =>
        `${val}bar = ${(val * 100000).toFixed(0)}Pa\n${val}Pa = ${(
          val / 100000
        ).toFixed(5)}bar`,
    };

    Object.keys(conversions).forEach((label) => {
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      select.appendChild(opt);
    });

    document.getElementById("unitConvertBtn").addEventListener("click", () => {
      const val = parseFloat(input.value.trim());
      const type = select.value;

      if (isNaN(val)) return (result.value = "Digite um valor válido.");
      result.value = conversions[type](val);
    });

    copyBtn.addEventListener("click", () => {
      const text = result.value;
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

export default unitconvert;
