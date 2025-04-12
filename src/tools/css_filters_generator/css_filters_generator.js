import { loadToolI18n } from "../../utils/i18n-loader.js";

const css_filters_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  render() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;

    const controls = [
      { id: "blur", min: 0, max: 20, step: 1, unit: "px", val: 0 },
      { id: "brightness", min: 0.1, max: 2, step: 0.1, unit: "", val: 1 },
      { id: "contrast", min: 0.1, max: 2, step: 0.1, unit: "", val: 1 },
      { id: "grayscale", min: 0, max: 100, step: 1, unit: "%", val: 0 },
      { id: "hue", min: 0, max: 360, step: 1, unit: "deg", val: 0 },
      { id: "invert", min: 0, max: 100, step: 1, unit: "%", val: 0 },
      { id: "sepia", min: 0, max: 100, step: 1, unit: "%", val: 0 },
      { id: "saturate", min: 0, max: 200, step: 1, unit: "%", val: 100 },
    ];

    return `
    <div class="grid grid-cols-2 gap-2 mb-4">
      ${controls
        .map(
          (f) => `
        <div>
          <label class="text-sm block">${t(f.id)}</label>
          <input type="range" id="f_${f.id}" min="${f.min}" max="${
            f.max
          }" step="${f.step}" value="${f.val}" class="w-full" />
          <span id="v_${f.id}" class="text-sm block text-center">${f.val}${
            f.unit
          }</span>
        </div>
      `
        )
        .join("")}
    </div>

    <div class="flex gap-2 mb-3">
      <button id="filterCopy" class="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white">${t(
        "copy"
      )}</button>
      <button id="filterRefresh" class="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white">${t(
        "refresh"
      )}</button>
      <label class="text-sm flex items-center gap-2">
        <input type="file" id="filterUpload" accept="image/*" class="hidden" />
        <span class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded cursor-pointer">${t(
          "upload"
        )}</span>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-4 items-center mb-4">
      <div class="h-56 overflow-hidden border rounded relative bg-white dark:bg-gray-800">
        <img id="filterImage" src="" class="w-full h-full object-cover" />
      </div>
      <div class="bg-gray-100 dark:bg-white h-56 flex items-center justify-center rounded border">
        <p id="filterText" class="text-black font-bold text-3xl">${t(
          "previewText"
        )}</p>
      </div>
    </div>

    <pre id="filterCSS" class="text-green-600 dark:text-green-400 bg-white border dark:bg-gray-900 p-3 rounded whitespace-pre-wrap break-words text-sm"></pre>
    `;
  },

  init() {
    const t = (key) => this.i18n?.labels?.[key] ?? key;
    const ACCESS_KEY = "qqX-zCJJ74tXG59lFDJOO9vk_FPejIPyfSD0R33_CXc";

    const sliders = [
      { id: "blur", unit: "px" },
      { id: "brightness", unit: "" },
      { id: "contrast", unit: "" },
      { id: "grayscale", unit: "%" },
      { id: "hue", unit: "deg" },
      { id: "invert", unit: "%" },
      { id: "sepia", unit: "%" },
      { id: "saturate", unit: "%" },
    ];

    const img = document.getElementById("filterImage");
    const text = document.getElementById("filterText");
    const cssOutput = document.getElementById("filterCSS");
    const copyBtn = document.getElementById("filterCopy");
    const refreshBtn = document.getElementById("filterRefresh");
    const uploadInput = document.getElementById("filterUpload");

    const update = () => {
      const filter = sliders
        .map((s) => {
          const val = document.getElementById("f_" + s.id).value;
          document.getElementById("v_" + s.id).innerText = `${val}${s.unit}`;
          return `${s.id === "hue" ? "hue-rotate" : s.id}(${val}${s.unit})`;
        })
        .join(" ");

      img.style.filter = filter;
      text.style.filter = filter;
      cssOutput.innerText = `filter: ${filter};`;
    };

    const fetchNewImage = () => {
      fetch(
        "https://api.unsplash.com/photos/random?query=landscape&orientation=landscape",
        {
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.urls?.regular) img.src = data.urls.regular;
        });
    };

    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => (img.src = event.target.result);
      reader.readAsDataURL(file);
    };

    sliders.forEach((s) => {
      document.getElementById("f_" + s.id).addEventListener("input", update);
    });

    uploadInput.addEventListener("change", handleUpload);
    refreshBtn.addEventListener("click", fetchNewImage);

    copyBtn.addEventListener("click", () => {
      const css = cssOutput.innerText;
      navigator.clipboard.writeText(css).then(() => {
        const original = copyBtn.innerText;
        copyBtn.innerText = t("copied");
        setTimeout(() => (copyBtn.innerText = original), 1500);
      });
    });

    update();
    fetchNewImage();
  },
};

export default css_filters_generator;
