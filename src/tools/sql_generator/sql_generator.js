import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const sql_generator = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "pt");
  },

  author: "DevUtils",
  hasApi: false,
  license: "MIT",
  version: "1.3.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;

    const optionTypes = t("option.types") || [];
    const engineOptions = t("option.engines") || [];
    const charsetOptions = t("option.charsets") || [];

    return `
<div class="space-y-4 text-sm text-gray-800 dark:text-white">
  <p>${t("intro")}</p>

  <div>
    <label class="block font-medium mb-1">${t("label.tableName")}</label>
    <input id="tableName" type="text" placeholder="users"
      class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white" />
  </div>

  <table class="w-full text-xs border border-gray-300 dark:border-gray-600">
    <thead class="bg-gray-100 dark:bg-gray-700">
      <tr>
        <th class="p-1">${t("label.field")}</th>
        <th class="p-1">${t("label.type")}</th>
        <th class="p-1">${t("label.size")}</th>
        <th class="p-1">${t("label.null")}</th>
        <th class="p-1">${t("label.pk")}</th>
        <th class="p-1">${t("label.ai")}</th>
        <th class="p-1">${t("label.default")}</th>
        <th class="p-1"></th>
      </tr>
    </thead>
    <tbody id="fieldRows"></tbody>
  </table>

  <datalist id="fieldNameSuggestions">
    <option value="id">
    <option value="name">
    <option value="email">
    <option value="username">
    <option value="password">
    <option value="phone">
    <option value="birthdate">
    <option value="created_at">
    <option value="updated_at">
    <option value="deleted_at">
  </datalist>

  <button id="addFieldBtn" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
    + ${t("btn.addField")}
  </button>

  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block font-medium mb-1">${t("label.engine")}</label>
      <select id="engineSelect" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white">
        ${engineOptions
          .map((e) => `<option value="${e}">${e}</option>`)
          .join("")}
      </select>
    </div>
    <div>
      <label class="block font-medium mb-1">${t("label.charset")}</label>
      <select id="charsetSelect" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white">
        ${charsetOptions
          .map((c) => `<option value="${c}">${c}</option>`)
          .join("")}
      </select>
    </div>
  </div>

  <div class="mt-4">
    <label class="block font-medium mb-1">${t("label.output")}</label>
    <pre id="sqlOutput" class="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-xs whitespace-pre-wrap overflow-auto"></pre>
  </div>

  <div class="flex gap-2 mt-2">
    <button id="exportSqlBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
      💾 ${t("label.export")}
    </button>
  </div>
</div>`;
  },

  init() {
    const $ = (id) => document.getElementById(id);
    const t = (key) => this.i18n?.[key] ?? key;

    const fieldRows = $("fieldRows");
    const tableName = $("tableName");
    const sqlOutput = $("sqlOutput");
    const addFieldBtn = $("addFieldBtn");
    const engineSelect = $("engineSelect");
    const charsetSelect = $("charsetSelect");
    const exportBtn = $("exportSqlBtn");

    const optionTypes = t("option.types") || [];

    const suggestionsMap = {
      email: { type: "VARCHAR", size: "255" },
      created_at: { type: "DATETIME", size: "" },
      updated_at: { type: "DATETIME", size: "" },
      deleted_at: { type: "DATETIME", size: "" },
      id: { type: "INT", size: "11" },
      password: { type: "VARCHAR", size: "255" },
    };

    const addRow = () => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <input type="text" class="w-full p-1 bg-white dark:bg-gray-600 text-black dark:text-white border dark:border-gray-600"
                 placeholder="${t(
                   "option.placeholder"
                 )}" list="fieldNameSuggestions" />
        </td>
        <td>
          <select class="w-full p-1 bg-white dark:bg-gray-600 text-black dark:text-white border dark:border-gray-600">
            ${optionTypes.map((t) => `<option>${t}</option>`).join("")}
          </select>
        </td>
        <td><input type="text" class="w-full p-1 bg-white dark:bg-gray-600 text-black dark:text-white border dark:border-gray-600" /></td>
        <td class="text-center align-middle"><input type="checkbox" /></td>
        <td class="text-center align-middle"><input type="checkbox" /></td>
        <td class="text-center align-middle"><input type="checkbox" /></td>
        <td><input type="text" class="w-full p-1 bg-white dark:bg-gray-600 text-black dark:text-white border dark:border-gray-600" /></td>
        <td>
          <button class="remove-field text-red-600 hover:underline text-xs text-center">${t(
            "btn.removeField"
          )}</button>
        </td>
      `;

      const input = tr.querySelector("input[list]");
      input.addEventListener("input", () => {
        const { type, size } = suggestionsMap[input.value] || {};
        if (type) tr.querySelector("select").value = type;
        if (size !== undefined) tr.querySelectorAll("input")[1].value = size;
        generateSQL();
      });

      tr.querySelectorAll("input, select").forEach((el) =>
        el.addEventListener("input", generateSQL)
      );

      tr.querySelector(".remove-field").addEventListener("click", () => {
        tr.remove();
        generateSQL();
      });

      fieldRows.appendChild(tr);
      generateSQL();
    };

    const generateSQL = () => {
      const table = tableName.value.trim();
      const rows = [...fieldRows.querySelectorAll("tr")];
      const fields = rows.map((row) => {
        const inputs = row.querySelectorAll("input, select");
        return {
          name: inputs[0].value,
          type: inputs[1].value,
          size: inputs[2].value,
          isNull: inputs[3].checked,
          isPK: inputs[4].checked,
          isAI: inputs[5].checked,
          def: inputs[6].value,
        };
      });

      if (!table || fields.length === 0) {
        sqlOutput.textContent = "";
        return;
      }

      const engine = engineSelect.value;
      const charset = charsetSelect.value;

      const create = (() => {
        let sql = `CREATE TABLE \`${table}\` (\n`;
        sql += fields
          .map((f) => {
            const size = f.size ? `(${f.size})` : "";
            const nullText = f.isNull ? "NULL" : "NOT NULL";
            const def = f.def ? ` DEFAULT '${f.def}'` : "";
            const ai = f.isAI ? " AUTO_INCREMENT" : "";
            return `  \`${f.name}\` ${f.type}${size} ${nullText}${def}${ai}`;
          })
          .join(",\n");
        const pk = fields.find((f) => f.isPK);
        if (pk) sql += `,\n  PRIMARY KEY (\`${pk.name}\`)`;
        sql += `\n) ENGINE=${engine} DEFAULT CHARSET=${charset};`;
        return sql;
      })();

      const insert = (() => {
        const names = fields.map((f) => `\`${f.name}\``).join(", ");
        const values = fields.map(() => "?").join(", ");
        return `INSERT INTO \`${table}\` (${names}) VALUES (${values});`;
      })();

      const select = (() => {
        const names = fields.map((f) => `\`${f.name}\``).join(", ");
        return `SELECT ${names} FROM \`${table}\`;`;
      })();

      const update = (() => {
        const sets = fields.map((f) => `\`${f.name}\` = ?`).join(", ");
        return `UPDATE \`${table}\` SET ${sets} WHERE id = ?;`;
      })();

      const del = `DELETE FROM \`${table}\` WHERE id = ?;`;

      sqlOutput.textContent = [
        "-- CREATE",
        create,
        "\n-- INSERT",
        insert,
        "\n-- SELECT",
        select,
        "\n-- UPDATE",
        update,
        "\n-- DELETE",
        del,
      ].join("\n\n");
    };

    addFieldBtn.addEventListener("click", addRow);
    tableName.addEventListener("input", generateSQL);
    engineSelect.addEventListener("change", generateSQL);
    charsetSelect.addEventListener("change", generateSQL);

    exportBtn.addEventListener("click", () => {
      const blob = new Blob([sqlOutput.textContent], { type: "text/sql" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableName.value || "query"}.sql`;
      a.click();
      URL.revokeObjectURL(url);
    });

    addRow();
  },
};

export default sql_generator;
