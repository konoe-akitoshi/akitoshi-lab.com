# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Akitoshi's personal portfolio website built with Astro, featuring a modern Japanese-focused design with works, awards, and personal information.

**Tech Stack:**
- Framework: Astro (Static Site Generator)
- Styling: UnoCSS (Utility-first CSS)
- Interactive Components: Svelte
- Package Manager: pnpm
- Language: TypeScript

## Development Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm run dev` | Start dev server at localhost:4321 |
| `pnpm run build` | Build production site (includes type checking) |
| `pnpm run preview` | Preview production build locally |
| `pnpm run astro check` | Run Astro type checking |

## Architecture & Key Concepts

### Page Routing
- Static pages in `src/pages/` (index, about, works, gallery, 404)
- Markdown content pages for works (`src/pages/works/*.md`) and awards (`src/pages/awards/*.md`)
- All pages use either `Layout.astro` or `WorksDetailLayout.astro`

### Content Structure
- **Works**: Markdown files with frontmatter using `WorksDetailLayout.astro`
- **Awards**: Markdown files with frontmatter
- **Assets**: Images organized in `src/assets/img/` and `public/img/`

### Layout Architecture
- `Layout.astro`: Main layout with configurable header/footer/wrapper
- `WorksDetailLayout.astro`: Specialized layout for work detail pages with hero section, metadata display, and prose styling

### Component Organization
- Astro components in `src/components/` for UI elements
- Svelte components in `src/components/svelte/` for interactive features
- Reusable components: Head, Header, Footer, Card, etc.

### Styling System
- UnoCSS with Wind preset and custom icons
- Custom theme colors (background, text, primary, secondary, accent)
- Custom shortcuts for buttons and common patterns
- Typography rules for headings and paragraphs
- Japanese font stack with fallbacks

### Site Configuration
- Global settings in `src/settings/site-settings.ts`
- Site metadata, social links, and configuration centralized
- Japanese language default with localized content

## Important Notes

- Site is Japanese-focused with Japanese text as default
- Uses pnpm as package manager (not npm/yarn)
- Build process includes automatic type checking via `astro check`
- Images are optimized with Sharp integration
- All markdown content supports frontmatter metadata
- UnoCSS shortcuts are available for consistent styling