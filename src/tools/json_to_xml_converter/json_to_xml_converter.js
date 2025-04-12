import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const json_to_xml_converter = {
  i18n: {},

  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    return `
      <textarea 
        id="jsonXmlInput" 
        class="w-full p-2 bg-white border border-gray-300 rounded mb-2 text-gray-800 dark:bg-gray-700 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
        rows="6" 
        placeholder="${t("placeholder")}"
      ></textarea>

      <div class="flex gap-2 mb-2">
        <button 
          id="jsonToXmlBtn" 
          class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          ${t("jsonToXml")}
        </button>

        <button 
          id="xmlToJsonBtn" 
          class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white dark:bg-yellow-500 dark:hover:bg-yellow-600"
        >
          ${t("xmlToJson")}
        </button>
      </div>

      <div class="relative">
        <pre 
          id="jsonXmlOutput" 
          class="mt-2 bg-white border border-gray-300 text-green-600 whitespace-pre-wrap break-words pr-16 p-2 rounded dark:bg-gray-700 dark:border-gray-700 dark:text-green-400 p-6"
        ></pre>

        <button 
          id="copyJsonXmlBtn" 
          class="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white dark:bg-gray-500 dark:hover:bg-gray-400"
        >
          ${tGlobal("copy")}
        </button>

        <span 
          id="copiedJsonXmlMsg" 
          class="absolute top-2 right-2 text-green-600 dark:text-green-400 px-2 py-1 hidden"
        >
          ${tGlobal("copied")}
        </span>
      </div>
    `;
  },

  init() {
    const t = (key) => json_to_xml_converter.i18n?.[key] ?? key;

    const inputEl = document.getElementById("jsonXmlInput");
    const outputEl = document.getElementById("jsonXmlOutput");
    const copyBtn = document.getElementById("copyJsonXmlBtn");
    const copiedMsg = document.getElementById("copiedJsonXmlMsg");

    const parser = new DOMParser();

    document.getElementById("jsonToXmlBtn").addEventListener("click", () => {
      try {
        const json = JSON.parse(inputEl.value);
        const xml = jsonToXml(json);
        outputEl.innerText = xml;
      } catch (e) {
        outputEl.innerText = `${t("error")}: ${e.message}`;
      }
    });

    document.getElementById("xmlToJsonBtn").addEventListener("click", () => {
      try {
        const xmlString = inputEl.value;
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const json = xmlToJson(xmlDoc);
        outputEl.innerText = JSON.stringify(json, null, 2);
      } catch (e) {
        outputEl.innerText = `${t("error")}: ${e.message}`;
      }
    });

    copyBtn.addEventListener("click", () => {
      const text = outputEl.innerText;
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

    function jsonToXml(obj, indent = "") {
      let xml = "";
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((val) => {
            xml += `${indent}<${key}>${
              typeof val === "object"
                ? "\n" + jsonToXml(val, indent + "  ") + indent
                : val
            }</${key}>\n`;
          });
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          xml += `${indent}<${key}>\n${jsonToXml(
            obj[key],
            indent + "  "
          )}${indent}</${key}>\n`;
        } else {
          xml += `${indent}<${key}>${obj[key]}</${key}>\n`;
        }
      }
      return xml;
    }

    function xmlToJson(xml) {
      let obj = {};
      if (xml.nodeType === 1 && xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attr = xml.attributes.item(j);
          obj["@attributes"][attr.nodeName] = attr.nodeValue;
        }
      }

      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes.item(i);
          const nodeName = item.nodeName;

          if (item.nodeType === 3 && item.nodeValue.trim()) {
            return item.nodeValue;
          } else if (item.nodeType === 1) {
            const content = xmlToJson(item);
            if (obj[nodeName] === undefined) {
              obj[nodeName] = content;
            } else {
              if (!Array.isArray(obj[nodeName])) {
                obj[nodeName] = [obj[nodeName]];
              }
              obj[nodeName].push(content);
            }
          }
        }
      }

      return obj;
    }
  },
};

export default json_to_xml_converter;
