# KopiDev Astro - AI Coding Agent Instructions

## Project Overview

KopiDev is a **dual-purpose platform** combining:

1. **Tech blog** with MDX content for programming tutorials
2. **Tailwind CSS component library** with 600+ interactive playground components

Built with **Astro v5**, **TypeScript**, **Tailwind CSS**, and **MDX**. Production site: https://kopi.dev

## Architecture

### Content Collections Structure

Three primary collections defined in `src/content/config.ts`:

- **`blog/`** - MDX posts organized in `/[post-slug]/index.mdx` structure
- **`categories/`** - Category definitions (title, description) for blog posts
- **`tailwind-components/`** - Components organized by year (`2021/`, `2022/`, etc.)
  - Each component: `/[component-slug]/index.mdx` + `/code/index.html`
  - `index.mdx` contains metadata and description
  - `code/index.html` contains the actual component code (may be full HTML doc or just body content)

### Routing Patterns

- **Blog posts**: `[...slug].astro` handles all `/post-slug` URLs
- **Blog listing**: `blog.astro` shows all posts (uses `BlogList.astro`)
- **Categories**: `category/[...slug].astro` filters posts by category
- **Tailwind library**:
  - `tailwind/[...page].astro` - paginated listing (24/page)
  - `tailwind/category/[category]/[...page].astro` - category-filtered view
  - `tailwind/[slug].astro` - individual component playground

### Key Layouts

- **`Layout.astro`** - Main layout with SEO meta tags, AdSense, JSON-LD structured data
  - Use `fullWidth={true}` for component library pages
  - Defaults to `max-w-3xl` container for blog content
- **`LayoutSinglePage.astro`** - Alternative single-page layout

## Component Playground System

The Tailwind component viewer (`tailwind/[slug].astro`) implements a **CodePen-style experience**:

### Features

- **Tab switching**: Preview ↔ Code views
- **Responsive testing**: Desktop (100%), Tablet (768px), Mobile (375px)
- **Fullscreen mode**: Modal overlay for distraction-free preview
- **Code copying**: One-click clipboard copy
- **Iframe rendering**: Components loaded via `srcdoc` with Tailwind CDN

### HTML Code Handling

Components support two formats (auto-detected):

1. **Full HTML** - Complete `<!DOCTYPE html>` documents (newer components)
2. **Body-only** - Fragment wrapped in template with Tailwind CDN (legacy)

Check with: `htmlCode.trim().toLowerCase().startsWith('<!doctype html>')`

### File System Convention

```
src/content/tailwind-components/
  └── 2021/
      └── list-view-action-button/
          ├── index.mdx          # Frontmatter + description
          ├── code/
          │   └── index.html     # Component source
          └── images/
              └── *.png          # Screenshots
```

## Content Management Patterns

### Blog Posts

Frontmatter schema:

```yaml
language: "en" | "id"
title: string
date: YYYY-MM-DD
categories: string[]  # Array of category slugs
coverImage: ./images/filename.webp (optional)
```

**Important**: Categories reference slug strings, NOT `reference('categories')`

### Tailwind Components

Frontmatter schema:

```yaml
language: "en"
title: string
date: YYYY-MM-DD
categories: string[]
slug: string (optional, defaults to folder name)
coverImage: ./images/filename.png (optional)
```

## Development Workflows

### Commands

```bash
npm run dev     # Start dev server (localhost:4321)
npm run build   # Production build to ./dist/
npm run preview # Preview production build
```

### Adding New Content

**Blog Post:**

1. Create folder: `src/content/blog/[slug]/`
2. Add `index.mdx` with frontmatter
3. Images go in `./images/` (relative imports)
4. Categories must exist in `src/content/categories/`

**Tailwind Component:**

1. Create: `src/content/tailwind-components/YYYY/[slug]/`
2. Add `index.mdx` with metadata
3. Create `code/index.html` with component source
4. Add screenshot to `images/` for `coverImage`
5. Generate screenshot using `screenshot_generator.py`

## Critical Patterns & Conventions

### Path Aliases

Configured in `astro.config.mjs`:

```typescript
"~/components" → "./src/components"
"~/config"     → "./src/config"
```

### Category Mapping

Use shared pattern from `BlogList.astro`:

```typescript
const categories = await getCollection("categories");
const categoryMap = new Map<string, string>();
categories.forEach((cat) => categoryMap.set(cat.slug, cat.data.title));
// Then: categoryMap.get(categorySlug)
```

### AdSense Integration

- Global `AdManager` singleton prevents duplicate initialization
- Import from `~/lib/adManager.ts`
- Horizontal ads: `<HorizontalAd />` component
- Check `data-ad-initialized` attribute before pushing to `adsbygoogle`

### Table of Contents

- Use `generateToc()` from `~/lib/generateToc.ts`
- Filters headings: `depth > 1 && depth < 4` (H2-H3 only)
- Renders nested structure via `TableOfContents.astro`

### SEO & Meta Tags

`Layout.astro` handles comprehensive SEO:

- Open Graph (Facebook)
- Twitter Cards
- JSON-LD structured data for Corporation schema
- Dynamic canonical URLs
- Social sharing images (default: `/images/default-social-sharing.jpeg`)

### Styling Conventions

- **CSS variables** for theming:
  ```css
  --frist-main-color: #dc2430 (primary red) --second-main-color: #7b4397
    (purple gradient) --background-color: #111 (dark background)
    --text-color: #fff (white text);
  ```
- **Tailwind dark theme**: Direct color classes, not dark mode utilities
- **Typography plugin**: Custom prose styles in `tailwind.config.mjs`

### Pagination

- **24 items per page** for Tailwind components
- **6 items default** for blog listings (configurable via `limit` prop)
- URL structure:
  - Page 1: `/tailwind/` or `/tailwind/category/forms/`
  - Page 2+: `/tailwind/2/` or `/tailwind/category/forms/2/`

## Common Pitfalls

1. **Category References**: Use string arrays, not `reference('categories')`
2. **Component HTML Paths**: Account for both `component.id` and `component.slug` when reading files
3. **Image Imports**: Use `import { Image } from "astro:assets"` for optimized images
4. **MDX Content**: Must call `await entry.render()` to get `<Content />` component
5. **Frontmatter Arrays**: Categories are always arrays, even with single item

## Site Configuration

Centralized in `src/config/site.ts`:

- Site metadata (title, description, URL)
- Organization info for schema.org
- Social media handles
- Helper functions: `getBaseUrl()`, `createUrl()`

## Testing New Components

After adding a Tailwind component:

1. Verify file structure matches convention
2. Check `coverImage` displays on listing page
3. Test iframe rendering in playground
4. Verify responsive views (desktop/tablet/mobile)
5. Test fullscreen modal
6. Confirm code copy functionality
