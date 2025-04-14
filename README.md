# 🛠️ **DevUtils** // everyday tools

Fast, useful, and tracker-free tools for developers. Fully open-source, with no heavy dependencies, no ads, and focused on productivity.

---

## ✨ Overview

**DevUtils** is a collection of utility tools built with HTML, Vanilla JS, and Tailwind CSS — optimized for speed and designed to run directly in your browser. Perfect for devs who prefer lightweight and effective solutions.

🔗 [Access the online version of DevUtils](https://devutils.tools/)

---

## 🚀 Features

- ✅ Independent tools, each modular and loaded on demand
- 🌍 Multilingual support (per-tool `i18n` system)
- 📁 Simple structure, easy to contribute
- 💾 Preferences stored locally (`localStorage`)
- 🔒 No tracking, no data collection, works offline
- 📱 Responsive interface with dark mode support

---

## 📦 Tech stack

- HTML + Vanilla JS
- Tailwind CSS
- Vite.js

---

## 🧠 How it works

Tools are located at `src/tools/{tool_name}` and follow this structure:

```
src/
├── tools/
│   └── tool_name/
│       ├── i18n/
│       │   ├── en.json
│       │   ├── pt.json
│       │   └── ...
│       └── tool_name.js
```

Each tool is loaded via:

```
/tool.html?slug=tool_name
```

---

## 🧩 Tool module format

```js
import { loadToolI18n } from "../../utils/i18n-loader.js";
import { tGlobal } from "../../utils/i18n-global.js";

const tool_name = {
  i18n: {},
  async loadI18n() {
    await loadToolI18n(this, window.getDevutilsLang?.() || "en");
  },
  author: "DevUtils",
  hasApi: true,
  license: "MIT",
  version: "1.0.0",

  render() {
    const t = (key) => this.i18n?.[key] ?? key;
    return `<div>...${t("key")}</div>`;
  },

  init() {
    // JavaScript logic here
  },
};

export default tool_name;
```

---

## 🧪 Run locally

```bash
npm install
npm run dev
```

Open: http://localhost:5173/tool.html?slug=address_generator

---

## 📦 Build for production

```bash
npm run build
```

---

## 🤝 Contributing

1. Fork this repo
2. Create a new feature branch:

```bash
git checkout -b my-feature
```

3. Commit your changes:

```bash
git commit -m 'feat: new feature'
```

4. Push the branch:

```bash
git push origin my-feature
```

5. Open a Pull Request 🚀

---

## 📄 License

MIT © Orides Tomkiel

---

## 📥 Downloads

Looking for offline access? You can download the standalone desktop version for your OS:

- 🪟 [Windows (.exe)](https://github.com/oridestomkiel/devutils/releases/latest/download/DevUtils-1.0.1-win-x64.exe)
- 🐧 [Linux (.deb)](https://github.com/oridestomkiel/devutils/releases/latest/download/DevUtils-linux-amd64.deb)
- 🐧 [Linux (AppImage)](https://github.com/oridestomkiel/devutils/releases/latest/download/DevUtils-linux-x86_64.AppImage)
- 🍎 [macOS (.dmg)](https://github.com/oridestomkiel/devutils/releases/latest/download/DevUtils-1.0.1-arm64.dmg)

Or just use the **Chrome Extension** for quick access inside your browser:  
👉 [DevUtils Tools on Chrome Web Store](https://chromewebstore.google.com/detail/devutils-tools/mfikjfhpmaifkfkgnpkcaddhccblfpea)

Source code is also available as [ZIP](https://github.com/oridestomkiel/devutils/archive/refs/tags/v1.0.1.zip) or [TAR.GZ](https://github.com/oridestomkiel/devutils/archive/refs/tags/v1.0.1.tar.gz).

---

## 📬 Contact

Have questions or suggestions?  
Feel free to open an issue: https://github.com/oridestomkiel/devutils/issues

---

## 💜 Support the project

This is an independent project, maintained by a single person.  
Your support helps keep DevUtils free, accessible, and growing with new tools.

**PIX (Brazil):** 20b16bb2-d827-48a6-9e2c-924cd11a1a79
