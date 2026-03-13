# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Akitoshi's personal portfolio website built with Astro, featuring a modern Japanese-focused design with works, awards, and personal information.

**Tech Stack:** Astro, UnoCSS, Svelte, TypeScript, Bun

## Development Commands

| Command | Action |
|---------|--------|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server at localhost:4321 |
| `bun run build` | Build production site (includes type checking) |
| `bun run preview` | Preview production build locally |
| `bun run astro check` | Run Astro type checking only |

## Architecture

### Layouts
- `Layout.astro`: Main layout with configurable props (`useHeader`, `useFooter`, `useMainWrapper`, `bodyClass`)
- `WorksDetailLayout.astro`: For work detail pages, reads frontmatter for hero section with title, author, date, thumbnail

### Content (Markdown)
Works and awards use markdown files with frontmatter:

```yaml
# Works frontmatter (src/pages/works/*.md)
layout: ../../layouts/WorksDetailLayout.astro
title: "Work Title"
author: "Author Name"
date: "DD Mon YYYY"
thumbnail: "/img/works/image.jpg"
description: "Description text"
```

### Styling (UnoCSS)
- Config: `uno.config.ts`
- Theme colors: `background`, `text`, `primary`, `secondary`, `accent`
- Shortcuts: `btn`, `btn-primary`, `btn-secondary`
- Icons via `@iconify/json` (use `i-` prefix)

### Site Configuration
Global settings in `src/settings/site-settings.ts` (site name, social links)

## Important Notes

- Japanese language default (lang="ja")
- Uses Bun exclusively (not npm/yarn/pnpm)
- CI runs on push/PR to master via GitHub Actions (`.github/workflows/build.yml`)
- Images go in `public/img/` (static) or `src/assets/img/` (optimized via Sharp)