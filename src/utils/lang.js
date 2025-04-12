window.getDevutilsLang = () => {
  return (
    localStorage.getItem("devutils_lang") ||
    navigator.language.slice(0, 2) ||
    "pt"
  );
};

window.setPreferredLang = (lang) => {
  localStorage.setItem("devutils_lang", lang);
  const sel1 = document.getElementById("langSelector");
  const sel2 = document.getElementById("langSelectorMobile");
  if (sel1) sel1.value = lang;
  if (sel2) sel2.value = lang;
  location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
  const waitForLangSelectors = setInterval(() => {
    const sel1 = document.getElementById("langSelector");
    const sel2 = document.getElementById("langSelectorMobile");

    if (sel1 && sel2) {
      const lang = getDevutilsLang();
      sel1.value = lang;
      sel2.value = lang;
      clearInterval(waitForLangSelectors);
    }
  }, 50);
});
