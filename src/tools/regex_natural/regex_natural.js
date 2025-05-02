import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const regex_natural = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.1.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
  <div class="space-y-4 text-sm text-gray-800 dark:text-white">
    <p>${t("intro")}</p>

    <div>
      <label class="block mb-1 font-medium">${t("label.presets")}</label>
      <select id="presetSelect" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white">
        <option value="">${t("preset.none")}</option>
        <option value="email">${t("preset.email")}</option>
        <option value="uuid">${t("preset.uuid")}</option>
        <option value="phoneIntl">${t("preset.phoneIntl")}</option>
        <option value="creditcard">${t("preset.creditcard")}</option>
        <option value="zipcode">${t("preset.zipcode")}</option>
        <option value="url">${t("preset.url")}</option>
        <option value="domain">${t("preset.domain")}</option>
        <option value="ipV4">${t("preset.ipV4")}</option>
        <option value="ipV6">${t("preset.ipV6")}</option>
        <option value="hexColor">${t("preset.hexColor")}</option>
        <option value="macAddress">${t("preset.macAddress")}</option>
        <option value="htmlTag">${t("preset.htmlTag")}</option>
        <option value="username">${t("preset.username")}</option>
        <option value="passwordStrong">${t("preset.passwordStrong")}</option>
        <option value="slug">${t("preset.slug")}</option>
        <option value="time24h">${t("preset.time24h")}</option>
        <option value="dateISO">${t("preset.dateISO")}</option>
        <option value="dateBr">${t("preset.dateBr")}</option>
        <option value="dateUs">${t("preset.dateUs")}</option>
        <option value="numericOnly">${t("preset.numericOnly")}</option>
        <option value="alphanumeric">${t("preset.alphanumeric")}</option>
        <option value="lettersOnly">${t("preset.lettersOnly")}</option>
        <option value="floatingNumber">${t("preset.floatingNumber")}</option>
        <option value="cpf">${t("preset.cpf")}</option>
        <option value="cnpj">${t("preset.cnpj")}</option>
      </select>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      ${[
        "startWithLetter",
        "endWithDigit",
        "containsHyphen",
        "noSpaces",
        "uppercase",
        "lowercase",
        "digit",
        "symbol",
      ]
        .map(
          (rule) => `
        <label class="flex items-center gap-2">
          <input type="checkbox" data-rule="${rule}" />
          ${t(`label.${rule}`)}
        </label>`
        )
        .join("")}
    </div>

    <div class="flex flex-wrap gap-4">
      <label class="flex flex-col">
        ${t("label.minLength")}
        <input type="number" id="minLength" min="0"
          class="p-1 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
      </label>
      <label class="flex flex-col">
        ${t("label.maxLength")}
        <input type="number" id="maxLength" min="1"
          class="p-1 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
      </label>
    </div>

    <div>
      <label class="block mb-1 font-medium">${t("label.flags")}</label>
      <div class="flex flex-wrap gap-4">
        ${["i", "g", "m"]
          .map(
            (flag) => `
          <label class="flex items-center gap-2" title="${t(
            `label.flag.${flag}.desc`
          )}">
            <input type="checkbox" data-flag="${flag}" />
            ${t(`label.flag.${flag}`)}
          </label>`
          )
          .join("")}
      </div>
    </div>

    <div>
      <label class="block font-medium mb-1">${t("label.result")}</label>
      <input type="text" id="regexOutput" readonly
        class="w-full p-2 border rounded font-mono bg-white dark:bg-gray-800 text-black dark:text-green-400" />
    </div>

    <div>
      <label class="block font-medium mb-1">${t("label.testInput")}</label>
      <input type="text" id="testInput"
        class="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
      <div id="testResult" class="mt-1 text-xs"></div>
    </div>

    <div class="flex gap-2 mt-2 flex-wrap">
      <button id="copyRegex" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
        ${t("btn.copy")}
      </button>
      <button id="exportRegex" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs">
        ${t("btn.export")}
      </button>
      <button id="resetAll" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
        ${t("btn.reset")}
      </button>
    </div>
  </div>`;
  },

  init() {
    const t = (key) => this.i18n?.[key] ?? key;

    const $ = (id) => document.getElementById(id);
    const rules = document.querySelectorAll("[data-rule]");
    const flags = document.querySelectorAll("[data-flag]");
    const output = $("regexOutput");
    const testInput = $("testInput");
    const testResult = $("testResult");
    const presetSelect = $("presetSelect");

    const presets = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      phoneIntl: /^\+\d{1,3}\s?\(?\d{1,4}\)?[\s-]?\d{4,5}-?\d{4}$/,
      creditcard: /^(\d{4}[-\s]?){4}$/,
      zipcode: /^\d{5}(-\d{4})?$/,
      url: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
      domain: /^[a-z0-9-]+(\.[a-z]{2,})+$/,
      ipV4: /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})(\.(\d{1,3})){3}$/,
      ipV6: /^(([0-9a-f]{1,4}):){7,7}[0-9a-f]{1,4}$/,
      hexColor: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
      macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      htmlTag: /^<\/?[a-z][\s\S]*>$/i,
      username: /^[a-zA-Z0-9_]{3,20}$/,
      passwordStrong:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      time24h: /^([01]\d|2[0-3]):([0-5]\d)$/,
      dateISO: /^\d{4}-\d{2}-\d{2}$/,
      dateBr: /^\d{2}\/\d{2}\/\d{4}$/,
      dateUs: /^\d{2}\/\d{2}\/\d{4}$/,
      numericOnly: /^\d+$/,
      alphanumeric: /^[a-z0-9]+$/i,
      lettersOnly: /^[a-zA-Z]+$/,
      floatingNumber: /^\d+(\.\d+)?$/,
      cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    };

    const getRegex = () => {
      const selected = presetSelect.value;
      if (selected && presets[selected]) {
        return { regex: presets[selected], raw: presets[selected].toString() };
      }

      let pattern = "";
      let body = "";
      const selectedRules = [...rules]
        .filter((r) => r.checked)
        .map((r) => r.dataset.rule);

      if (selectedRules.includes("startWithLetter")) pattern += "^[A-Za-z]";
      if (selectedRules.includes("endWithDigit")) body += ".*\\d$";
      if (selectedRules.includes("containsHyphen")) body += "(?=.*\\-)";
      if (selectedRules.includes("noSpaces")) body += "(?!.*\\s)";
      if (selectedRules.includes("uppercase")) body += "(?=.*[A-Z])";
      if (selectedRules.includes("lowercase")) body += "(?=.*[a-z])";
      if (selectedRules.includes("digit")) body += "(?=.*\\d)";
      if (selectedRules.includes("symbol")) body += "(?=.*[^\\w\\s])";

      const min = $("minLength").value;
      const max = $("maxLength").value;
      const lengthPart = min || max ? `.{${min || 0},${max || ""}}` : ".*";

      const fullPattern = pattern + body + lengthPart;
      const flagsStr = [...flags]
        .filter((f) => f.checked)
        .map((f) => f.dataset.flag)
        .join("");

      return {
        regex: new RegExp(fullPattern, flagsStr),
        raw: `/${fullPattern}/${flagsStr}`,
      };
    };

    const update = () => {
      try {
        const { regex, raw } = getRegex();
        output.value = raw;
        const value = testInput.value;
        testResult.textContent = value
          ? regex.test(value)
            ? t("msg.valid")
            : t("msg.invalid")
          : "";
      } catch (err) {
        output.value = "";
        testResult.textContent = t("msg.error");
      }
    };

    $("copyRegex").addEventListener("click", () => {
      navigator.clipboard.writeText(output.value);
    });

    $("exportRegex").addEventListener("click", () => {
      const blob = new Blob([output.value], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "regex.txt";
      a.click();
    });

    $("resetAll").addEventListener("click", () => {
      presetSelect.value = "";
      rules.forEach((r) => (r.checked = false));
      flags.forEach((f) => (f.checked = false));
      $("minLength").value = "";
      $("maxLength").value = "";
      testInput.value = "";
      update();
    });

    document
      .querySelectorAll("input, select")
      .forEach((el) => el.addEventListener("input", update));

    update();
  },
};

export default regex_natural;
