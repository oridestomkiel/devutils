// Aguarda até que a função de tradução global esteja disponível
async function waitForGlobalI18n() {
  while (
    typeof window.tGlobal !== "function" ||
    typeof window.loadGlobalI18n !== "function" ||
    !window.i18nGlobal
  ) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

// Carrega o HTML de um arquivo e injeta no elemento com o ID fornecido
async function includeHTML(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.warn(`❌ Falha ao carregar ${file}:`, err);
  }
}

// Aplica traduções a um elemento baseado nos atributos data-i18n*
function applyI18nToElement(el) {
  const t = window.tGlobal;
  if (typeof t !== "function") return;

  // Traduções de conteúdo textual (innerHTML)
  el.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    let value = t(key);
    if (!value) return;

    // Caso existam variáveis (como spans com IDs)
    if (node.hasAttribute("data-i18n-vars")) {
      const vars = node.getAttribute("data-i18n-vars").split(",");
      vars.forEach((v) => {
        const varName = v.trim();
        const span = node.querySelector(`#${varName}`);
        if (span) {
          value = value.replace(
            `{${varName.replace("count", "")}}`,
            span.outerHTML
          );
        }
      });
      node.innerHTML = value;
    } else {
      node.innerHTML = value;
    }
  });

  // Traduções de atributos (placeholder, title, etc.)
  const attributeMap = {
    "data-i18n-placeholder": "placeholder",
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-alt": "alt",
    "data-i18n-label": "label",
    "data-i18n-value": "value",
    "data-i18n-href": "href",
  };

  Object.entries(attributeMap).forEach(([dataAttr, realAttr]) => {
    el.querySelectorAll(`[${dataAttr}]`).forEach((node) => {
      const key = node.getAttribute(dataAttr);
      const value = t(key);
      if (value !== undefined) {
        node.setAttribute(realAttr, value);
      }
    });
  });
}

// Inclui um partial e aplica tradução após carregar
async function includeAndTranslate(id, file) {
  await waitForGlobalI18n();
  await includeHTML(id, file);

  const el = document.getElementById(id);
  if (el) applyI18nToElement(el);
}

export { includeAndTranslate, applyI18nToElement };
