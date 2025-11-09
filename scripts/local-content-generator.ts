import ContentGenerator from "./content-generator.js";
import ScreenshotGenerator from "./screenshot-generator.js";
import ComponentEnhancer from "./component-enhancer.js";
import fs from "fs/promises";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env file
config();

interface LocalGeneratedComponent {
  title: string;
  code: string;
  slug: string;
  categories: string[];
  description: string;
  date: string;
}

class LocalContentGenerator {
  private generator: ContentGenerator;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const githubToken = process.env.GITHUB_TOKEN || "dummy-token-for-local";

    if (!accountId || !apiToken) {
      throw new Error(
        "Missing required environment variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN"
      );
    }

    this.generator = new ContentGenerator(accountId, apiToken, githubToken);
  }

  async generateAndSaveLocal(count: number = 2): Promise<void> {
    console.log(`🚀 Generating ${count} unique components locally...`);

    try {
      // Generate unique AI prompts
      const uniquePrompts = await this.generateUniquePrompts(count);
      console.log(`🤖 Generated unique prompts:`, uniquePrompts);

      // Generate components using Cloudflare AI
      const components =
        await this.generator.generateMultipleComponents(uniquePrompts);
      console.log(`🎨 Generated ${components.length} components`);

      if (components.length === 0) {
        console.log("❌ No components were generated successfully");
        return;
      }

      // Save components locally and collect the saved component info
      const savedComponents: LocalGeneratedComponent[] = [];
      for (const component of components) {
        const savedComponent = await this.saveComponentLocally(component);
        savedComponents.push(savedComponent);
      }

      // Generate screenshots for the newly created components
      console.log("📸 Generating screenshots...");
      await this.generateScreenshots(savedComponents);

      // Enhance components with advanced features
      console.log("🎨 Enhancing components with advanced features...");
      const enhancer = new ComponentEnhancer();
      await enhancer.enhanceAllNewComponents();

      console.log("✅ Local content generation completed successfully!");
    } catch (error) {
      console.error("❌ Error during local content generation:", error);
      throw error;
    }
  }

  private async saveComponentLocally(
    component: any
  ): Promise<LocalGeneratedComponent> {
    const currentYear = new Date().getFullYear();
    const timestamp = new Date().toISOString();

    // Create directory structure following current pattern: year/slug/
    const componentDir = path.join(
      process.cwd(),
      "src",
      "content",
      "tailwind-components",
      currentYear.toString(),
      component.slug
    );

    const codeDir = path.join(componentDir, "code");
    const imagesDir = path.join(componentDir, "images");

    try {
      // Create directories
      await fs.mkdir(codeDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });

      // Create MDX content
      const mdxContent = `---
title: "${component.title}"
date: ${timestamp}
categories: ${JSON.stringify(component.categories)}
language: "html"
slug: "${component.slug}"
---

${component.description}

This component was generated using Cloudflare AI for testing purposes.
`;

      // Create HTML content with full document structure
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
    ${component.code}
</body>
</html>`;

      // Write files
      await fs.writeFile(
        path.join(componentDir, "index.mdx"),
        mdxContent,
        "utf-8"
      );
      await fs.writeFile(
        path.join(codeDir, "index.html"),
        htmlContent,
        "utf-8"
      );

      console.log(`✅ Saved component: ${component.title} to ${componentDir}`);

      // Return the saved component information
      return {
        title: component.title,
        code: component.code,
        slug: component.slug,
        categories: component.categories,
        description: component.description,
        date: timestamp,
      };
    } catch (error) {
      console.error(`❌ Failed to save component ${component.title}:`, error);
      throw error;
    }
  }

  private async generateScreenshots(
    components: LocalGeneratedComponent[]
  ): Promise<void> {
    if (components.length === 0) {
      console.log("📸 No components to generate screenshots for");
      return;
    }

    try {
      console.log(
        `📸 Generating screenshots for ${components.length} newly created components...`
      );

      const screenshotGenerator = new ScreenshotGenerator();
      await screenshotGenerator.initialize();

      for (const component of components) {
        try {
          const currentYear = new Date().getFullYear();
          const htmlPath = path.join(
            process.cwd(),
            "src",
            "content",
            "tailwind-components",
            currentYear.toString(),
            component.slug,
            "code",
            "index.html"
          );

          const imagePath = path.join(
            process.cwd(),
            "src",
            "content",
            "tailwind-components",
            currentYear.toString(),
            component.slug,
            "images",
            `tailwind-component-${component.slug}.png`
          );

          console.log(`📸 Capturing screenshot for: ${component.title}`);
          await screenshotGenerator.captureComponentScreenshot(
            htmlPath,
            imagePath,
            component.title
          );
        } catch (error) {
          console.error(
            `❌ Failed to generate screenshot for ${component.title}:`,
            error
          );
          // Continue with other components even if one fails
        }
      }

      await screenshotGenerator.cleanup();
      console.log(`✅ Screenshots generated successfully for new components`);
    } catch (error) {
      console.error("❌ Screenshot generation failed:", error);
      console.log(
        "⚠️  You can run `npm run generate:screenshots` manually later"
      );
    }
  }

  private async generateUniquePrompts(count: number): Promise<string[]> {
    const prompts: string[] = [];

    const promptCategories = [
      "dashboard",
      "card",
      "form",
      "navigation",
      "button",
      "modal",
      "table",
      "notification",
      "calendar",
      "chat",
      "social media",
      "e-commerce",
      "blog",
      "portfolio",
      "landing page",
      "admin panel",
      "pricing",
      "testimonial",
    ];

    const componentTypes = [
      "component",
      "widget",
      "section",
      "layout",
      "element",
      "module",
      "block",
    ];

    const styles = [
      "modern",
      "minimalist",
      "colorful",
      "dark theme",
      "gradient",
      "glass morphism",
      "neumorphism",
      "retro",
      "futuristic",
      "clean",
      "elegant",
      "playful",
    ];

    for (let i = 0; i < count; i++) {
      const category =
        promptCategories[Math.floor(Math.random() * promptCategories.length)];
      const type =
        componentTypes[Math.floor(Math.random() * componentTypes.length)];
      const style = styles[Math.floor(Math.random() * styles.length)];

      const prompt = `Create a ${style} ${category} ${type} with interactive features and responsive design using Tailwind CSS`;
      prompts.push(prompt);
    }

    return prompts;
  }
}

// Check if this file is being run directly
async function main() {
  try {
    const generator = new LocalContentGenerator();
    const count = parseInt(process.argv[2]) || 2;
    await generator.generateAndSaveLocal(count);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default LocalContentGenerator;
