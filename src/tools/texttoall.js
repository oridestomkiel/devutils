const texttoall = {
  title: "Conversor de Texto para Vários Formatos",
  description:
    "Digite qualquer texto e veja sua conversão automática para representações BINARIO, DECIMAL, OCTAL, HEX, BASE64, ASCII, UTF8, URL, UNICODE, MORSE e HTML",
  tags: ["conversão", "texto", "binário", "base64", "unicode", "morse"],
  category: "Texto",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.1",

  render: () => `
    <textarea
      id="multiTextInput"
      class="w-full p-2 bg-gray-700 text-white rounded mb-3"
      rows="4"
      placeholder="Digite ou cole um texto para converter..."
    ></textarea>

    <div id="multiTextOptions" class="flex flex-wrap gap-3 mb-3 text-sm text-gray-300">
      ${[
        "binario",
        "decimal",
        "octal",
        "hex",
        "base64",
        "ascii",
        "utf8",
        "url",
        "unicode",
        "morse",
        "html",
      ]
        .map(
          (id) => `
        <label class="flex items-center gap-1">
          <input type="checkbox" value="${id}" class="accent-blue-500" checked />
          ${id.toUpperCase()}
        </label>`
        )
        .join("")}
    </div>

    <button id="multiTextClearBtn" class="mb-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded hidden">
      Limpar
    </button>

    <div id="multiTextResults" class="space-y-3"></div>
  `,

  init: () => {
    const input = document.getElementById("multiTextInput");
    const results = document.getElementById("multiTextResults");
    const checkboxes = [
      ...document.querySelectorAll("#multiTextOptions input"),
    ];
    const clearBtn = document.getElementById("multiTextClearBtn");

    const morseMap = {
      a: ".-",
      b: "-...",
      c: "-.-.",
      d: "-..",
      e: ".",
      f: "..-.",
      g: "--.",
      h: "....",
      i: "..",
      j: ".---",
      k: "-.-",
      l: ".-..",
      m: "--",
      n: "-.",
      o: "---",
      p: ".--.",
      q: "--.-",
      r: ".-.",
      s: "...",
      t: "-",
      u: "..-",
      v: "...-",
      w: ".--",
      x: "-..-",
      y: "-.--",
      z: "--..",
      0: "-----",
      1: ".----",
      2: "..---",
      3: "...--",
      4: "....-",
      5: ".....",
      6: "-....",
      7: "--...",
      8: "---..",
      9: "----.",
      " ": "/",
      ".": ".-.-.-",
      ",": "--..--",
      "?": "..--..",
      "!": "-.-.--",
    };

    const conversions = {
      binario: (txt) =>
        [...txt]
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" "),
      decimal: (txt) => [...txt].map((c) => c.charCodeAt(0)).join(" "),
      octal: (txt) =>
        [...txt].map((c) => c.charCodeAt(0).toString(8)).join(" "),
      hex: (txt) =>
        [...txt]
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" "),
      base64: (txt) => btoa(unescape(encodeURIComponent(txt))),
      ascii: (txt) => [...txt].map((c) => c.charCodeAt(0)).join(" "),
      utf8: (txt) =>
        [...unescape(encodeURIComponent(txt))]
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" "),
      url: (txt) => encodeURIComponent(txt),
      unicode: (txt) =>
        [...txt]
          .map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"))
          .join(" "),
      morse: (txt) =>
        [...txt.toLowerCase()].map((c) => morseMap[c] || c).join(" "),
      html: (txt) => [...txt].map((c) => `&#${c.charCodeAt(0)};`).join(""),
    };

    const render = () => {
      const val = input.value;
      const active = checkboxes
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
      results.innerHTML = "";

      if (val.trim() === "") {
        clearBtn.classList.add("hidden");
        return;
      }

      clearBtn.classList.remove("hidden");

      active.forEach((type) => {
        let output = "";
        try {
          output = conversions[type](val);
        } catch {
          output = "[erro na conversão]";
        }

        const block = document.createElement("div");
        block.className = "flex flex-col gap-1";

        const label = document.createElement("div");
        label.textContent = type.toUpperCase();
        label.className = "text-sm text-gray-400";

        const field = document.createElement("textarea");
        field.value = output;
        field.readOnly = true;
        field.rows = 2;
        field.className =
          "w-full bg-gray-900 text-gray-300 text-sm px-2 py-1 rounded border border-gray-700 resize-y";

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copiar";
        copyBtn.className =
          "self-start mt-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm";
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(field.value).then(() => {
            copyBtn.textContent = "Copiado!";
            setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
          });
        });

        block.appendChild(label);
        block.appendChild(field);
        block.appendChild(copyBtn);
        results.appendChild(block);
      });
    };

    input.addEventListener("input", render);
    clearBtn.addEventListener("click", () => {
      input.value = "";
      results.innerHTML = "";
      clearBtn.classList.add("hidden");
    });
    checkboxes.forEach((cb) => cb.addEventListener("change", render));
  },
};

export default texttoall;
