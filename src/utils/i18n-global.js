let i18nLoaded = false;

export async function loadGlobalI18n(lang = "pt") {
  if (i18nLoaded) return;
  i18nLoaded = true;

  try {
    const [commonRes, toolsRes] = await Promise.all([
      fetch(`/i18n/common/${lang}.json`),
      fetch(`/i18n/${lang}.json`),
    ]);

    window.i18nGlobal = await commonRes.json();
    window.i18nTools = await toolsRes.json();
  } catch (e) {
    console.warn(`⚠️ Failed to load translations for ${lang}`);
    window.i18nGlobal = {};
    window.i18nTools = {};
  }
}

export function tGlobal(key) {
  const val = window.i18nGlobal?.[key];
  if (val === undefined) {
    console.warn(`🚫 tGlobal: key "${key}" not found`);
  }
  return val;
}

export function tTool(slug, key) {
  const val = window.i18nTools?.[slug]?.[key];
  if (val === undefined) {
    console.warn(`🚫 tTool: key "${key}" not found in module "${slug}"`);
  }
  return val;
}

window.tGlobal = tGlobal;
window.tTool = tTool;
window.loadGlobalI18n = loadGlobalI18n;
