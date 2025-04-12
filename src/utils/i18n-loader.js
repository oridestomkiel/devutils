export async function loadToolI18n(tool, lang = "pt") {
  try {
    const slug = tool.slug || tool.name || "unknown";
    if (!tool.slug) {
      console.warn(`⚠️ tool.slug está indefinido! Usando fallback "${slug}"`);
    }

    const response = await fetch(`/i18n/tools/${slug}/${lang}.json`);
    const data = await response.json();
    tool.i18n = data;
    tool.lang = lang;
  } catch (e) {
    console.warn(
      `⚠️ Tradução não encontrada para ${tool.slug || "undefined"}/${lang}`
    );
    tool.i18n = {};
  }
}
