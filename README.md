# akitoshi-lab.com

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Uno CSS](https://unocss.dev/)
- **Hosting**: [Static Web Server](https://static-web-server.net/)

## 🚀 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── img
│   ├── components/
│   │   └── Head.astro
│   │   └── Header.astro
│   │   └── Footer.astro
│   │   └── Affiliated.astro
│   │   └── Card.astro
│   │   └── Environment.astro
│   │   └── Prizes.astro
│   │   └── WorksParsonl.astro
│   │   └── Slideshow.jsx
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
│       └── about.astro
│       └── works.astro
├── astro.config.mjs
├── uno.config.ts
├── README.md
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

© 2022 Akitoshi Saeki