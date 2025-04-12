import "./style.css";
import "./utils/lang.js";
import "./utils/theme.js";
import { loadGlobalI18n, tGlobal } from "./utils/i18n-global.js";
import { includeAndTranslate } from "./utils/include-partial.js";

window.addEventListener("DOMContentLoaded", async () => {
  const lang = window.getDevutilsLang?.() || "en";
  await loadGlobalI18n(lang);

  await includeAndTranslate("header-placeholder", "/partials/header.html");
  await includeAndTranslate("footer-placeholder", "/partials/footer.html");
  await includeAndTranslate("mobileMenu", "/partials/mobile-menu.html");

  translateTermosPage();
});

function translateTermosPage() {
  const t = window.tGlobal;

  document.title = t("terms.head.title");

  const headDescription = document.querySelector('meta[name="description"]');
  if (headDescription)
    headDescription.setAttribute("content", t("terms.head.description"));

  const termosContent = document.getElementById("termosContent");
  if (!termosContent) return;

  termosContent.innerHTML = `
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">${t(
    "terms.title"
  )}</h1>

  <section class="space-y-4 p-4 text-gray-800 dark:text-gray-300">
    <p>${t("terms.intro")}</p>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${t(
      "terms.privacyTitle"
    )}</h2>
    <ul class="list-disc list-inside space-y-2">
      <li>${t("terms.noCookies")}</li>
      <li>${t("terms.noPersonalData")}</li>
      <li>${t("terms.noTracking")}</li>
      <li>${t("terms.noAds")}</li>
    </ul>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${t(
      "terms.storageTitle"
    )}</h2>
    <p>${t("terms.storageDesc")}</p>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${t(
      "terms.opensourceTitle"
    )}</h2>
    <p>
      ${t("terms.opensourceDesc")}
      <a
        href="https://github.com/oridestomkiel/devutils"
        target="_blank"
        rel="noopener"
        class="text-blue-600 dark:text-blue-400 hover:underline"
      >GitHub</a>.
    </p>

    <p>${t("terms.finalNote")}</p>
  </section>
`;
}
