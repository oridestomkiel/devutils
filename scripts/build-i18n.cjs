// build-i18n.cjs
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const toolsDir = path.join(rootDir, "src", "tools");
const outputDir = path.join(rootDir, "src", "i18n");
const publicToolsDir = path.join(rootDir, "public", "tools");

const languages = {};

// 1. Ler todas as pastas de ferramentas
fs.readdirSync(toolsDir).forEach((toolSlug) => {
  const toolPath = path.join(toolsDir, toolSlug);
  const i18nPath = path.join(toolPath, "i18n");

  if (fs.existsSync(i18nPath)) {
    fs.readdirSync(i18nPath).forEach((file) => {
      if (file.endsWith(".json")) {
        const lang = path.basename(file, ".json");
        const filePath = path.join(i18nPath, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (!languages[lang]) languages[lang] = {};
        languages[lang][toolSlug] = content;
      }
    });
  }
});

// 2. Criar src/i18n para arquivos mesclados por idioma
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

Object.entries(languages).forEach(([lang, data]) => {
  const outFile = path.join(outputDir, `${lang}.json`);
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Gerado: src/i18n/${lang}.json`);
});

// 3. Copiar arquivos individuais para public/tools/<slug>/<lang>.json
Object.keys(languages).forEach((lang) => {
  Object.keys(languages[lang]).forEach((slug) => {
    const srcFile = path.join(toolsDir, slug, "i18n", `${lang}.json`);
    const destDir = path.join(publicToolsDir, slug);
    const destFile = path.join(destDir, `${lang}.json`);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(srcFile, destFile);
    console.log(`📁 Copiado: public/tools/${slug}/${lang}.json`);
  });
});
