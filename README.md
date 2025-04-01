# 🛠️ **DevUtils** // everyday tools

Ferramentas rápidas, úteis e sem rastreio para o dia a dia de desenvolvedores. Totalmente open-source, sem dependências pesadas, sem propaganda, e com foco em produtividade.

---

## ✨ Visão Geral

O **DevUtils** é uma suíte de ferramentas utilitárias construídas com HTML, JavaScript Vanilla e Tailwind CSS, otimizadas para carregamento rápido e uso direto no navegador. Perfeito para desenvolvedores que preferem soluções leves e eficazes.

🔗 <a href="https://devutils.tools/" target="_blank" rel="noopener noreferrer">Acesse a versão online do DevUtils</a>

---

## 🚀 Funcionalidades

- ✅ Ferramentas independentes, cada uma modular e carregada sob demanda
- 📁 Estrutura simples, ideal para contribuir facilmente
- 💾 Salva preferências localmente (via localStorage)
- 🔒 Sem coleta de dados ou rastreamento
- 📱 Design responsivo e acessível

---

## 📦 Tecnologias

- HTML + JS Vanilla
- Tailwind CSS
- Vite.js

## 🧠 Como funciona

Os módulos são carregados dinamicamente com `import()` quando acessados via:

```
/tool.html?slug=nomedomodulo
```

Cada ferramenta é um módulo JavaScript com a seguinte estrutura:

```js
const modulo = {
  title: "Nome da ferramenta",
  description: "Descrição breve da ferramenta",
  tags: ["exemplo", "modulo"],
  category: "Utilitários",
  author: "{DEV}}",
  hasApi: false, // Se usa api externa
  license: "MIT",
  version: "1.0.0",
  render: () => `HTML`,
  init: () => {
    /* JS */
  },
};

export default modulo;
```

## 🧩 Criando uma nova ferramenta

1. Crie um novo arquivo em `src/tools/nomedomodulo.js`.
2. Siga a estrutura de módulo descrita acima.
3. Teste localmente com:

   ```bash
   npm run dev
   ```

4. Faça o build com:

   ```bash
   npm run build
   ```

## 🤝 Contribuindo

1. Fork este repositório
2. Crie uma branch com sua feature:

   ```bash
   git checkout -b minha-funcionalidade
   ```

3. Commit suas alterações:

   ```bash
   git commit -m 'feat: nova funcionalidade'
   ```

4. Push para a branch remota:

   ```bash
   git push origin minha-funcionalidade
   ```

5. Abra um Pull Request 🚀

## 📄 Licença

MIT © [Orides Tomkiel](https://github.com/oridestomkiel)

## 📬 Contato

Dúvidas, sugestões ou quer participar mais ativamente? Entre em contato ou [abra uma issue](https://github.com/oridestomkiel/devutils/issues).

---

## 💜 Ajude a manter o DevUtils no ar  

Este é um projeto independente, mantido por uma única pessoa.  
Com sua contribuição, o DevUtils continua gratuito, acessível e sempre evoluindo com novas ferramentas.

**PIX:** `20b16bb2-d827-48a6-9e2c-924cd11a1a79`
