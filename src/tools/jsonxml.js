const jsonxml = {
  title: "Conversor JSON ↔ XML",
  description:
    "Converta dados entre os formatos JSON e XML com precisão. Ideal para integrações entre sistemas, APIs e manipulação de dados estruturados.",
  tags: [
    "json para xml",
    "xml para json",
    "conversor json xml",
    "converter dados",
    "formato xml",
    "formato json",
    "transformar xml json",
  ],
  category: "Conversores",
  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.0.1",
  render: () => `
    <textarea id="jsonXmlInput" class="w-full p-2 bg-gray-700 rounded mb-2 text-white" rows="6" placeholder="Cole JSON ou XML aqui..."></textarea>
    <div class="flex gap-2 mb-2">
      <button id="jsonToXmlBtn" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">JSON → XML</button>
      <button id="xmlToJsonBtn" class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">XML → JSON</button>
    </div>
    <div class="relative">
      <pre id="jsonXmlOutput" class="mt-2 text-green-400 whitespace-pre-wrap break-words pr-16"> </pre>
      <button id="copyJsonXmlBtn" class="absolute top-0 right-0 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white">Copiar</button>
      <span id="copiedJsonXmlMsg" class="absolute top-0 right-0 text-xs text-green-400 px-2 py-1 hidden">Copiado!</span>
    </div>
  `,
  init: () => {
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
        outputEl.innerText = "Erro: " + e.message;
      }
    });

    document.getElementById("xmlToJsonBtn").addEventListener("click", () => {
      try {
        const xmlString = inputEl.value;
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const json = xmlToJson(xmlDoc);
        outputEl.innerText = JSON.stringify(json, null, 2);
      } catch (e) {
        outputEl.innerText = "Erro: " + e.message;
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

export default jsonxml;
