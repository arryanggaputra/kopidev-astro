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
4. Generate screenshot using `screenshot_generator.py` (see Screenshot Generation section)

### Creating New Tailwind Components

When asked to create a new Tailwind component, follow this workflow:

**1. Create Component Files:**

```
src/content/tailwind-components/YYYY/[component-slug]/
  ├── index.mdx              # Metadata and description
  └── code/
      └── index.html         # Full HTML with Tailwind CDN
```

**2. MDX File Template (`index.mdx`):**

```yaml
---
language: "en"
title: "Component Title"
date: YYYY-MM-DD (use current date)
categories:
  - "category1"
  - "category2"
slug: "component-slug"
coverImage: "./images/tailwind-component-[slug].png"
---
Brief description of the component, its features, and use cases.
```

**3. HTML File Template (`code/index.html`):**

Always create FULL HTML documents (not fragments):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component Title</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center p-6">
    <!-- Component HTML here -->
  </body>
</html>
```

**4. Generate Screenshot:**

Run the screenshot generator to automatically create the preview image:

```bash
# Activate virtual environment (if not already activated)
source venv/bin/activate

# Generate screenshot for specific component
python3 screenshot_generator.py 2025 component-slug

# Or generate for all components in a year
python3 screenshot_generator.py 2025
```

The screenshot will be automatically saved to `images/tailwind-component-[slug].png`

### Screenshot Generation System

The project includes an automated screenshot generator (`screenshot_generator.py`) that uses Selenium WebDriver.

**Setup (first time only):**

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install selenium pillow webdriver-manager
```

**Usage:**

```bash
# Generate for ALL components in a year (auto-discovery)
python3 screenshot_generator.py 2025

# Generate for specific component(s)
python3 screenshot_generator.py 2025 component-slug another-component

# Different year
python3 screenshot_generator.py 2024
```

**Features:**

- **Auto-discovery**: Automatically finds all component folders in the year directory
- **Smart skipping**: Skips components that already have screenshots (no duplicate work)
- **High quality**: Generates Retina-quality screenshots (1920x1080, 2x scale factor)
- **Year-based**: Works with any year folder structure (2021, 2022, 2023, etc.)
- **No manual updates needed**: Never edit the component list in the script

**How it works:**

1. Scans `src/content/tailwind-components/YYYY/` for component folders
2. Loads `code/index.html` for each component
3. Captures full-page screenshot with proper rendering
4. Saves to `images/tailwind-component-[slug].png`
5. Skips if screenshot already exists

**Common Issues:**

- If ChromeDriver fails, it auto-downloads via `webdriver-manager`
- Screenshots are saved as PNG with optimization for web
- Full HTML documents render better than fragments

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
6. **HTML in JSON-LD**: Never include raw HTML code in JSON-LD structured data - it causes HTML escaping issues that break rendering
7. **Full HTML Documents**: Always create complete HTML documents for components (with DOCTYPE, head, body), not fragments

## Component Design Guidelines

When creating Tailwind components:

**Best Practices:**

- Use semantic HTML elements
- Include hover states and transitions for better UX
- Make components responsive (mobile-first approach)
- Use Tailwind's utility classes consistently
- Add proper ARIA labels for accessibility
- Include SVG icons from Heroicons when needed
- Keep color schemes consistent with brand

**Common Component Types:**

- **Cards**: Feature cards, pricing cards, profile cards, testimonial cards
- **Forms**: Contact forms, login forms, newsletter signup, search forms
- **Navigation**: Navbars, sidebars, breadcrumbs, pagination
- **Content**: Blog post layouts, article cards, media objects
- **Interactive**: Tabs, accordions, modals, dropdowns, tooltips
- **Data Display**: Tables, lists, grids, stats, charts
- **Marketing**: Hero sections, CTAs, testimonials, pricing tables

**Component Naming Convention:**

- Use descriptive, kebab-case names: `feature-card-with-icon`
- Include component type in name: `modern-contact-form`, `simple-pricing-card`
- Add descriptive modifiers: `animated-`, `gradient-`, `minimal-`, `advanced-`

**Categories to Use:**
Common categories: `card`, `form`, `navigation`, `button`, `modal`, `table`, `grid`, `animation`, `pricing`, `testimonials`, `hero`, `footer`, `header`, `sidebar`, `dashboard`, `feature`, `icon`, `list-view`

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
