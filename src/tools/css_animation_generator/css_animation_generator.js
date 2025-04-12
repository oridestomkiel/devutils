import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const css_animation_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },

  render() {
    const t = (key) => this.i18n?.[key] ?? key;
    const g = tGlobal;

    const opt = this.i18n.options || {};
    const cat = this.i18n.categories || {};

    return `
  <div class="grid grid-cols-2 gap-2 mb-3 text-gray-900 dark:text-white">
    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${t(
        "animationType"
      )}</label>
      <select id="animType" class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <optgroup label="${cat.basic}">
          <option value="fade">${opt["fade"]}</option>
          <option value="scale">${opt["scale"]}</option>
          <option value="rotate">${opt["rotate"]}</option>
        </optgroup>
        <optgroup label="${cat.slides}">
          <option value="slide-left">${opt["slide-left"]}</option>
          <option value="slide-right">${opt["slide-right"]}</option>
          <option value="slide-up">${opt["slide-up"]}</option>
          <option value="slide-down">${opt["slide-down"]}</option>
        </optgroup>
        <optgroup label="${cat.dynamic}">
          <option value="bounce">${opt["bounce"]}</option>
          <option value="shake">${opt["shake"]}</option>
          <option value="flip">${opt["flip"]}</option>
          <option value="flip-x">${opt["flip-x"]}</option>
        </optgroup>
        <optgroup label="${cat.visual}">
          <option value="blur-in">${opt["blur-in"]}</option>
          <option value="opacity-pulse">${opt["opacity-pulse"]}</option>
          <option value="zoom-in">${opt["zoom-in"]}</option>
          <option value="zoom-out">${opt["zoom-out"]}</option>
        </optgroup>
        <optgroup label="${cat.loop}">
          <option value="float">${opt["float"]}</option>
          <option value="wave">${opt["wave"]}</option>
          <option value="pulse">${opt["pulse"]}</option>
        </optgroup>
      </select>
    </div>

    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${g(
        "duration"
      )}</label>
      <input type="number" id="animDuration"
        class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        value="1" step="0.1" />
    </div>

    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${g(
        "delay"
      )}</label>
      <input type="number" id="animDelay"
        class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        value="0" step="0.1" />
    </div>

    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${g(
        "easing"
      )}</label>
      <select id="animEase"
        class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="ease">${g("ease")}</option>
        <option value="ease-in">${g("ease-in")}</option>
        <option value="ease-out">${g("ease-out")}</option>
        <option value="ease-in-out">${g("ease-in-out")}</option>
        <option value="linear">${g("linear")}</option>
      </select>
    </div>

    <div>
      <label class="text-sm text-gray-700 dark:text-gray-300">${g(
        "repeat"
      )}</label>
      <select id="animRepeat"
        class="w-full p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="infinite">${g("infinite")}</option>
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="3">3x</option>
      </select>
    </div>
  </div>

  <button id="animGenBtn"
    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">${g(
      "generate"
    )}</button>
  <button id="animCopyBtn"
    class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded ml-2">${g(
      "copyCss"
    )}</button>

  <div id="animPreview"
    class="mt-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center rounded">
    <div id="animBox"
      class="w-32 h-20 bg-blue-500 text-white font-bold flex items-center justify-center rounded">
      ${g("previewLabel")}
    </div>
  </div>

  <pre id="animCSS"
    class="mt-2 text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-3 rounded whitespace-pre-wrap break-words text-sm"
    placeholder="${g("placeholder")}"></pre>
  `;
  },

  init() {
    const getKeyframes = (type) => {
      const transforms = {
        fade: `0% { opacity: 0; } 100% { opacity: 1; }`,
        scale: `0% { transform: scale(1); } 100% { transform: scale(1.2); }`,
        rotate: `0% { transform: rotate(0); } 100% { transform: rotate(360deg); }`,
        "slide-left": `0% { transform: translateX(-100%); } 100% { transform: translateX(0); }`,
        "slide-right": `0% { transform: translateX(100%); } 100% { transform: translateX(0); }`,
        "slide-up": `0% { transform: translateY(100%); } 100% { transform: translateY(0); }`,
        "slide-down": `0% { transform: translateY(-100%); } 100% { transform: translateY(0); }`,
        bounce: `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30%); }`,
        shake: `0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }`,
        flip: `0% { transform: rotateY(0); } 100% { transform: rotateY(180deg); }`,
        "flip-x": `0% { transform: rotateX(0); } 100% { transform: rotateX(180deg); }`,
        "blur-in": `0% { filter: blur(8px); opacity: 0; } 100% { filter: blur(0); opacity: 1; }`,
        "opacity-pulse": `0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`,
        "zoom-in": `0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; }`,
        "zoom-out": `0% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.6); opacity: 0; }`,
        float: `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`,
        wave: `0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); }`,
        pulse: `0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); }`,
      };
      return transforms[type] || "";
    };

    document.getElementById("animGenBtn").addEventListener("click", () => {
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
}`.trim();

      const box = document.getElementById("animBox");
      const output = document.getElementById("animCSS");

      box.style.animation = "none";
      void box.offsetWidth;
      box.style.animation = `${animName} ${duration}s ${easing} ${delay}s ${repeat}`;
      box.style.transformOrigin = "center";

      const old = document.getElementById("__anim_style_block");
      if (old) old.remove();

      const style = document.createElement("style");
      style.id = "__anim_style_block";
      style.innerHTML = `@keyframes ${animName} { ${keyframes} }`;
      document.head.appendChild(style);

      output.innerText = css;
    });

    document.getElementById("animCopyBtn").addEventListener("click", () => {
      const css = document.getElementById("animCSS").innerText;
      if (!css) return;
      navigator.clipboard.writeText(css).then(() => {
        const g = tGlobal;
        const btn = document.getElementById("animCopyBtn");
        const original = btn.innerText;
        btn.innerText = g("copied");
        setTimeout(() => (btn.innerText = original), 1500);
      });
    });
  },
};

export default css_animation_generator;
