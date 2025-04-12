import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/",
  publicDir: "static",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/tools/*/*.js",
          dest: "assets/tools",
        },
        {
          src: "src/i18n/*",
          dest: "i18n",
        },
        {
          src: "public/vendor/**/*",
          dest: "vendor",
        },
        {
          src: "public/partials/*",
          dest: "partials",
        },
      ],
    }),
  ],
  build: {
    minify: "terser",
    rollupOptions: {
      input: {
        main: "index.html",
        tools: "tools.html",
        tool: "tool.html",
        termos: "termos.html",
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
