import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const ascii_art_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.2.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    const fontList = [
      "1Row",
      "3-D",
      "3D Diagonal",
      "3D-ASCII",
      "3x5",
      "4Max",
      "5 Line Oblique",
      "AMC 3 Line",
      "AMC 3 Liv1",
      "AMC AAA01",
      "AMC Neko",
      "AMC Razor",
      "AMC Razor2",
      "AMC Slash",
      "AMC Slider",
      "AMC Thin",
      "AMC Tubes",
      "AMC Untitled",
      "ANSI Regular",
      "ANSI Shadow",
      "ASCII New Roman",
      "Acrobatic",
      "Alligator",
      "Alligator2",
      "Alpha",
      "Alphabet",
      "Arrows",
      "Avatar",
      "B1FF",
      "Banner",
      "Banner3-D",
      "Banner3",
      "Banner4",
      "Barbwire",
      "Basic",
      "Bear",
      "Bell",
      "Benjamin",
      "Big Chief",
      "Big Money-ne",
      "Big Money-nw",
      "Big Money-se",
      "Big Money-sw",
      "Big",
      "Bigfig",
      "Binary",
      "Block",
      "Blocks",
      "Bloody",
      "Bolger",
      "Braced",
      "Bright",
      "Broadway KB",
      "Broadway",
      "Bubble",
      "Bulbhead",
      "Caligraphy",
      "Caligraphy2",
      "Calvin S",
      "Cards",
      "Catwalk",
      "Chiseled",
      "Chunky",
      "Coinstak",
      "Cola",
      "Colossal",
      "Computer",
      "Contessa",
      "Contrast",
      "Cosmike",
      "Crawford",
      "Crawford2",
      "Crazy",
      "Cricket",
      "Cursive",
      "Cyberlarge",
      "Cybermedium",
      "Cybersmall",
      "Cygnet",
      "DANC4",
      "DOS Rebel",
      "DWhistled",
      "Dancing Font",
      "Decimal",
      "Def Leppard",
      "Delta Corps Priest 1",
      "Diamond",
      "Diet Cola",
      "Digital",
      "Doh",
      "Doom",
      "Dot Matrix",
      "Double Shorts",
      "Double",
      "Dr Pepper",
      "Efti Chess",
      "Efti Font",
      "Efti Italic",
      "Efti Piti",
      "Efti Robot",
      "Efti Wall",
      "Efti Water",
      "Electronic",
      "Elite",
      "Epic",
      "Fender",
      "Filter",
      "Fire Font-k",
      "Fire Font-s",
      "Flipped",
      "Flower Power",
      "Four Tops",
      "Fraktur",
      "Fun Face",
      "Fun Faces",
      "Fuzzy",
      "Georgi16",
      "Georgia11",
      "Ghost",
      "Ghoulish",
      "Glenyn",
      "Goofy",
      "Gothic",
      "Graceful",
      "Gradient",
      "Graffiti",
      "Greek",
      "Heart Left",
      "Heart Right",
      "Henry 3D",
      "Hex",
      "Hieroglyphs",
      "Hollywood",
      "Horizontal Left",
      "Horizontal Right",
      "ICL-1900",
      "Impossible",
      "Invita",
      "Isometric1",
      "Isometric2",
      "Isometric3",
      "Isometric4",
      "Italic",
      "Ivrit",
      "JS Block Letters",
      "JS Bracket Letters",
      "JS Capital Curves",
      "JS Cursive",
      "JS Stick Letters",
      "Jacky",
      "Jazmine",
      "Jerusalem",
      "Katakana",
      "Kban",
      "Keyboard",
      "Knob",
      "Konto Slant",
      "Konto",
      "LCD",
      "Larry 3D 2",
      "Larry 3D",
      "Lean",
      "Letters",
      "Lil Devil",
      "Line Blocks",
      "Linux",
      "Lockergnome",
      "Madrid",
      "Marquee",
      "Maxfour",
      "Merlin1",
      "Merlin2",
      "Mike",
      "Mini",
      "Mirror",
      "Mnemonic",
      "Modular",
      "Morse",
      "Morse2",
      "Moscow",
      "Mshebrew210",
      "Muzzle",
      "NScript",
      "NT Greek",
      "NV Script",
      "Nancyj-Fancy",
      "Nancyj-Improved",
      "Nancyj-Underlined",
      "Nancyj",
      "Nipples",
      "O8",
      "OS2",
      "Octal",
      "Ogre",
      "Old Banner",
      "Pagga",
      "Patorjk's Cheese",
      "Patorjk-HeX",
      "Pawp",
      "Peaks Slant",
      "Peaks",
      "Pebbles",
      "Pepper",
      "Poison",
      "Puffy",
      "Puzzle",
      "Pyramid",
      "Rammstein",
      "Rectangles",
      "Red Phoenix",
      "Relief",
      "Relief2",
      "Reverse",
      "Roman",
      "Rot13",
      "Rotated",
      "Rounded",
      "Rowan Cap",
      "Rozzo",
      "Runic",
      "Runyc",
      "S Blood",
      "SL Script",
      "Santa Clara",
      "Script",
      "Serifcap",
      "Shadow",
      "Shimrod",
      "Short",
      "Slant Relief",
      "Slant",
      "Slide",
      "Small Caps",
      "Small Isometric1",
      "Small Keyboard",
      "Small Poison",
      "Small Script",
      "Small Shadow",
      "Small Slant",
      "Small Tengwar",
      "Small",
      "Soft",
      "Speed",
      "Spliff",
      "Stacey",
      "Stampate",
      "Stampatello",
      "Standard",
      "Star Strips",
      "Star Wars",
      "Stellar",
      "Stforek",
      "Stick Letters",
      "Stop",
      "Straight",
      "Stronger Than All",
      "Sub-Zero",
      "Swamp Land",
      "Swan",
      "Sweet",
      "THIS",
      "Tanja",
      "Tengwar",
      "Term",
      "Test1",
      "The Edge",
      "Thick",
      "Thin",
      "Thorned",
      "Three Point",
      "Ticks Slant",
      "Ticks",
      "Tiles",
      "Tinker-Toy",
      "Tombstone",
      "Train",
      "Trek",
      "Tsalagi",
      "Tubular",
      "Twisted",
      "Two Point",
      "USA Flag",
      "Univers",
      "Varsity",
      "Wavy",
      "Weird",
      "Wet Letter",
      "Whimsy",
      "Wow",
    ];

    const fontOptions = fontList
      .map((font) => `<option value="${font}">${font}</option>`)
      .join("");

    const selectHTML = `
  <select id="asciiFont" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white">
    ${fontOptions}
  </select>`;

    return `
<div class="p-4 space-y-4 text-sm text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded">
  <p>${t("intro")}</p>

  <div>
    <label class="block text-sm mb-1">${t("label.text")}</label>
    <input id="asciiInput" type="text" placeholder="DevUtils" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
  </div>

  <div>
    <label class="block text-sm mb-1">${t("label.font")}</label>
    ${selectHTML}
  </div>

  <button id="asciiGenerate" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
    ${t("generate")}
  </button>

  <div id="asciiOutputWrapper" class="mt-4 hidden">
    <label class="block text-sm mb-1">${t("label.output")}</label>
    <pre id="asciiOutput" class="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-green-700 dark:text-green-400 overflow-auto text-xs whitespace-pre"></pre>

    <div class="flex gap-2 mt-2">
      <button id="asciiCopy" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded">${tGlobal(
        "copy"
      )}</button>
      <button id="asciiDownload" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">${t(
        "download"
      )}</button>
    </div>
  </div>
</div>
    `;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const input = document.getElementById("asciiInput");
    const fontSelect = document.getElementById("asciiFont");
    const btn = document.getElementById("asciiGenerate");
    const outputWrapper = document.getElementById("asciiOutputWrapper");
    const output = document.getElementById("asciiOutput");
    const copyBtn = document.getElementById("asciiCopy");
    const downloadBtn = document.getElementById("asciiDownload");

    const loadFiglet = () =>
      new Promise((resolve, reject) => {
        if (window.figlet && typeof window.figlet.text === "function") {
          return resolve(window.figlet);
        }

        const script = document.createElement("script");
        script.src = "./vendor/figlet.js";
        script.onload = () => {
          if (window.figlet) {
            window.figlet.defaults({
              fontPath: "https://cdn.jsdelivr.net/npm/figlet@1.5.2/fonts",
            });
            resolve(window.figlet);
          } else {
            reject(new Error("figlet not available after load"));
          }
        };
        script.onerror = () => reject(new Error("Failed to load figlet.js"));
        document.head.appendChild(script);
      });

    btn.addEventListener("click", () => {
      const text = input.value.trim();
      const font = fontSelect.value;
      if (!text) return alert(t("error.empty"));

      loadFiglet()
        .then((figlet) => {
          figlet.loadFont(font, (err) => {
            if (err) {
              output.textContent = t("error.fontLoad");
              return;
            }

            figlet.text(text, { font }, (err, result) => {
              if (err) {
                output.textContent = t("error.generate");
                return;
              }

              output.textContent = result;
              outputWrapper.classList.remove("hidden");
            });
          });
        })
        .catch((err) => {
          console.error("Erro ao carregar Figlet:", err);
          output.textContent = t("error.generate");
        });
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(output.textContent).then(() => {
        copyBtn.textContent = tGlobal("copied");
        setTimeout(() => (copyBtn.textContent = tGlobal("copy")), 1500);
      });
    });

    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([output.textContent], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "ascii-art.txt";
      a.click();
    });
  },
};

export default ascii_art_generator;
