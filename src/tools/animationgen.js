const animationgen = {
  title: "Gerador de Animações CSS",
  description:
    "Monte animações CSS com diferentes tipos de movimento, controle de duração, easing, delay e repetição. Veja o preview e copie o CSS.",
  tags: [
    "css animation",
    "keyframes",
    "animação web",
    "easing",
    "loop",
    "design interativo",
  ],
  category: "Design / Cores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "2.0.0",

  render: () => `
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label class="text-sm text-gray-300">Tipo de animação</label>
            <select id="animType" class="w-full p-1 bg-gray-700 text-white rounded">
            <optgroup label="🎯 Básicas">
                <option value="fade">Fade In</option>
                <option value="scale">Scale (Zoom)</option>
                <option value="rotate">Rotate</option>
            </optgroup>

            <optgroup label="📦 Slides">
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-down">Slide Down</option>
            </optgroup>

            <optgroup label="🤸 Dinâmicas">
                <option value="bounce">Bounce</option>
                <option value="shake">Shake</option>
                <option value="flip">Flip Y</option>
                <option value="flip-x">Flip X</option>
            </optgroup>

            <optgroup label="🧼 Visuais">
                <option value="blur-in">Blur In</option>
                <option value="opacity-pulse">Opacity Pulse</option>
                <option value="zoom-in">Zoom In</option>
                <option value="zoom-out">Zoom Out</option>
            </optgroup>

            <optgroup label="🔁 Loop / Idle">
                <option value="float">Float</option>
                <option value="wave">Wave</option>
                <option value="pulse">Pulse</option>
            </optgroup>
            </select>

        </div>
        <div>
          <label class="text-sm text-gray-300">Duração (s)</label>
          <input type="number" id="animDuration" class="w-full p-1 bg-gray-700 text-white rounded" value="1" step="0.1" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Delay (s)</label>
          <input type="number" id="animDelay" class="w-full p-1 bg-gray-700 text-white rounded" value="0" step="0.1" />
        </div>
        <div>
          <label class="text-sm text-gray-300">Easing</label>
          <select id="animEase" class="w-full p-1 bg-gray-700 text-white rounded">
            <option value="ease">ease</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="linear">linear</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-300">Repetição</label>
          <select id="animRepeat" class="w-full p-1 bg-gray-700 text-white rounded">
            <option value="infinite">Infinita</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
          </select>
        </div>
      </div>
  
      <button id="animGenBtn" class="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Gerar Animação</button>
      <button id="animCopyBtn" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded ml-2">Copiar CSS</button>
  
      <div id="animPreview" class="mt-4 bg-white border border-gray-600 p-10 flex items-center justify-center rounded">
        <div id="animBox" class="w-32 h-20 bg-blue-500 text-white font-bold flex items-center justify-center rounded">
          Preview
        </div>
      </div>
  
      <pre id="animCSS" class="mt-2 text-green-400 bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `,

  init: () => {
    const genBtn = document.getElementById("animGenBtn");
    const copyBtn = document.getElementById("animCopyBtn");

    const getKeyframes = (type) => {
      switch (type) {
        case "fade":
          return `0% { opacity: 0; } 100% { opacity: 1; }`;
        case "scale":
          return `0% { transform: scale(1); } 100% { transform: scale(1.2); }`;
        case "rotate":
          return `0% { transform: rotate(0); } 100% { transform: rotate(360deg); }`;
        case "slide-left":
          return `0% { transform: translateX(-100%); } 100% { transform: translateX(0); }`;
        case "slide-right":
          return `0% { transform: translateX(100%); } 100% { transform: translateX(0); }`;
        case "slide-up":
          return `0% { transform: translateY(100%); } 100% { transform: translateY(0); }`;
        case "slide-down":
          return `0% { transform: translateY(-100%); } 100% { transform: translateY(0); }`;
        case "bounce":
          return `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30%); }`;
        case "shake":
          return `0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }`;
        case "flip":
          return `0% { transform: rotateY(0); } 100% { transform: rotateY(180deg); }`;
        case "flip-x":
          return `0% { transform: rotateX(0); } 100% { transform: rotateX(180deg); }`;
        case "blur-in":
          return `0% { filter: blur(8px); opacity: 0; } 100% { filter: blur(0); opacity: 1; }`;
        case "opacity-pulse":
          return `0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`;
        case "zoom-in":
          return `0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; }`;
        case "zoom-out":
          return `0% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.6); opacity: 0; }`;
        case "float":
          return `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`;
        case "wave":
          return `0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); }`;
        case "pulse":
          return `0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); }`;
        default:
          return "";
      }
    };

    genBtn.addEventListener("click", () => {
      const type = document.getElementById("animType").value;
      const duration = document.getElementById("animDuration").value;
      const delay = document.getElementById("animDelay").value;
      const easing = document.getElementById("animEase").value;
      const repeat = document.getElementById("animRepeat").value;

      const animName = `anim_${type}`;
      const keyframes = getKeyframes(type);
      const css = `
  @keyframes ${animName} {
    ${keyframes}
  }
  
  .element {
    animation: ${animName} ${duration}s ${easing} ${delay}s ${repeat};
  }
        `.trim();

      const box = document.getElementById("animBox");
      const output = document.getElementById("animCSS");

      // Reinicia a animação
      box.style.animation = "none";
      void box.offsetWidth;

      box.style.animation = `${animName} ${duration}s ${easing} ${delay}s ${repeat}`;
      box.style.transformOrigin = "center";

      // Remove keyframe antigo se existir
      const existing = document.getElementById("__anim_style_block");
      if (existing) existing.remove();

      const style = document.createElement("style");
      style.id = "__anim_style_block";
      style.innerHTML = `@keyframes ${animName} { ${keyframes} }`;
      document.head.appendChild(style);

      output.innerText = css;
    });

    copyBtn.addEventListener("click", () => {
      const css = document.getElementById("animCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerText = "Copiado!";
        setTimeout(() => (copyBtn.innerText = "Copiar CSS"), 1500);
      });
    });
  },
};

export default animationgen;
