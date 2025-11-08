# KopiAstro 🚀

> A modern blog and Tailwind CSS component library built with Astro v5

**KopiAstro** is a comprehensive platform that combines a programming blog with an interactive Tailwind CSS component library. It features a modern code playground experience for exploring and testing Tailwind components.

🌐 **Live Site**: [https://kopi.dev](https://kopi.dev)

## ✨ Features

### 📝 **Blog Platform**

- **Content Collections**: Organized blog posts with metadata and categories
- **MDX Support**: Rich content with React components in Markdown
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter Cards
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Sitemap**: Auto-generated sitemap with all content

### 🎨 **Tailwind Component Library**

- **600+ Components**: Extensive collection of ready-to-use Tailwind components
- **Interactive Playground**: CodePen-style preview with live editing
- **Responsive Testing**: Desktop, tablet, and mobile view switcher
- **Code Highlighting**: Syntax-highlighted code with copy functionality
- **Fullscreen Preview**: Distraction-free component testing
- **Category Filtering**: Organized components with search functionality
- **Pagination**: Optimized performance with 24 components per page

### � **Technical Stack**

- **Astro v5.15.4**: Modern static site generator
- **TypeScript**: Type-safe development
- **Tailwind CSS v3.4.18**: Utility-first CSS framework
- **Content Collections**: Type-safe content management
- **Responsive Images**: Optimized image handling
- **AdSense Integration**: Monetization ready

## 🚀 Project Structure

```text
├── public/                     # Static assets
│   └── clients/               # Client logos and images
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── Ads/              # Advertisement components
│   │   ├── BlogList.astro    # Blog listing component
│   │   ├── Footer.astro      # Site footer
│   │   ├── Navbar.astro      # Navigation bar
│   │   └── TailwindComponentsLayout.astro  # Component library layout
│   ├── config/
│   │   └── site.ts           # Site configuration and constants
│   ├── content/              # Content collections
│   │   ├── blog/             # Blog posts in MDX format
│   │   ├── categories/       # Blog categories
│   │   └── tailwind-components/  # Component library content
│   ├── layouts/
│   │   ├── Layout.astro      # Main site layout
│   │   └── LayoutSinglePage.astro  # Single page layout
│   ├── lib/                  # Utility functions
│   │   ├── generateToc.ts    # Table of contents generator
│   │   └── index.ts          # Shared utilities
│   └── pages/                # Route pages
│       ├── blog.astro        # Blog listing page
│       ├── tailwind/         # Component library routes
│       ├── category/         # Category pages
│       ├── sitemap.xml.ts    # Dynamic sitemap
│       ├── robots.txt.ts     # SEO robots file
│       └── ads.txt.ts        # AdSense verification
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/arryangga/kopiastro.git
   cd kopiastro
   ```

2. **Install dependencies**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:4321
   ```

## 📋 Available Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run dev`     | Start development server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview production build locally             |
| `npm run astro`   | Run Astro CLI commands                       |

## 🎯 Key Features in Detail

### Component Playground

- **Tabbed Interface**: Switch between Preview and Code views
- **Responsive Testing**: Test components across different screen sizes
- **Syntax Highlighting**: Beautiful code presentation with Prism.js
- **Copy to Clipboard**: One-click code copying
- **Fullscreen Mode**: Focus on components without distractions

### Content Management

- **Type-Safe Collections**: Structured content with TypeScript schemas
- **MDX Integration**: Rich content with React component support
- **Category System**: Organized content with filtering capabilities
- **SEO Optimization**: Automatic meta tags and structured data

### Performance

- **Static Generation**: Pre-built pages for optimal performance
- **Image Optimization**: Automatic image processing and optimization
- **Code Splitting**: Efficient JavaScript bundling
- **CDN Ready**: Optimized for global content delivery

## 🔧 Configuration

### Site Settings

Update `src/config/site.ts` to customize:

```typescript
export const SITE_CONFIG = {
  title: "Your Site Title",
  description: "Your site description",
  url: "https://yourdomain.com",
  author: "Your Name",
  // ... other settings
};
```

### Content Collections

Add new blog posts in `src/content/blog/` or components in `src/content/tailwind-components/`.

## 🚢 Deployment

### Build for Production

```sh
npm run build
```

The built site will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Platforms

- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop or Git integration
- **GitHub Pages**: Free static hosting
- **Cloudflare Pages**: Global edge network

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Arryangga Aliev Pratamaputra**

- Website: [https://kopi.dev](https://kopi.dev)
- Twitter: [@arryangga](https://twitter.com/arryangga)
- GitHub: [@arryangga](https://github.com/arryangga)

## 🙏 Acknowledgments

- [Astro](https://astro.build) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types
- [Prism.js](https://prismjs.com) - Syntax highlighting library

---

Built with ❤️ using [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
