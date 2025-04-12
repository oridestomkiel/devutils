const modules = import.meta.glob("./*/**/*.js", { eager: true });

export const tools = {};

for (const path in modules) {
  const segments = path.split("/");
  const name = segments[1]; // nome da pasta (slug)
  const mod = modules[path].default;
  mod.slug = mod.slug || name; // garante slug no objeto
  tools[name] = mod;
}
