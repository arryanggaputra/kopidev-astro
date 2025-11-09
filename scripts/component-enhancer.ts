import fs from "fs/promises";
import path from "path";

interface ComponentEnhancement {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class ComponentEnhancer {
  private enhancements: ComponentEnhancement[] = [
    {
      pattern: /(<div[^>]*class="[^"]*)(">)/g,
      replacement: "$1 hover:shadow-lg transition-all duration-300$2",
      description: "Add hover effects and transitions",
    },
    {
      pattern: /(<button[^>]*class="[^"]*)(">)/g,
      replacement:
        "$1 transform hover:scale-105 active:scale-95 transition-all duration-200$2",
      description: "Add interactive button effects",
    },
    {
      pattern: /(bg-)(blue|green|purple|red|yellow)(-500)/g,
      replacement: "bg-gradient-to-r from-$2-400 to-$2-600",
      description: "Convert solid colors to gradients",
    },
    {
      pattern: /(<div[^>]*class="[^"]*p-4[^"]*)(">)/g,
      replacement: "$1 rounded-xl shadow-lg border border-gray-200$2",
      description: "Add modern styling to containers",
    },
  ];

  async enhanceComponent(htmlContent: string): Promise<string> {
    let enhanced = htmlContent;

    // Apply basic enhancements
    for (const enhancement of this.enhancements) {
      enhanced = enhanced.replace(enhancement.pattern, enhancement.replacement);
    }

    // Add custom CSS for animations
    const customCSS = `
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
      }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    </style>`;

    // Insert custom CSS before closing head tag
    enhanced = enhanced.replace("</head>", `${customCSS}</head>`);

    // Add Google Fonts if not present
    if (!enhanced.includes("fonts.googleapis.com")) {
      const googleFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
      enhanced = enhanced.replace("</head>", `${googleFonts}</head>`);

      // Update body font
      enhanced = enhanced.replace(
        "<body",
        "<body style=\"font-family: 'Inter', sans-serif;\""
      );
    }

    return enhanced;
  }

  async enhanceAllNewComponents(): Promise<void> {
    const baseContentPath = path.join(
      process.cwd(),
      "src",
      "content",
      "tailwind-components",
      "2025"
    );

    try {
      const componentDirs = await fs.readdir(baseContentPath);

      for (const componentDir of componentDirs) {
        const htmlPath = path.join(
          baseContentPath,
          componentDir,
          "code",
          "index.html"
        );

        try {
          // Check if file exists and was created recently (last 5 minutes)
          const stats = await fs.stat(htmlPath);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

          if (stats.mtime > fiveMinutesAgo) {
            console.log(`🎨 Enhancing component: ${componentDir}`);

            const htmlContent = await fs.readFile(htmlPath, "utf-8");
            const enhanced = await this.enhanceComponent(htmlContent);

            await fs.writeFile(htmlPath, enhanced, "utf-8");
            console.log(`✅ Enhanced: ${componentDir}`);
          }
        } catch (error) {
          // Skip if file doesn't exist
        }
      }
    } catch (error) {
      console.log("⚠️  Components directory not found");
    }
  }
}

// Export for use in other scripts
export default ComponentEnhancer;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const enhancer = new ComponentEnhancer();
  enhancer.enhanceAllNewComponents();
}
