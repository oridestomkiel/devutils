const modules = import.meta.glob("./*.js", { eager: true });

export const tools = {};

for (const path in modules) {
  const name = path.split("/").pop().replace(".js", "");
  tools[name] = modules[path].default;
}
