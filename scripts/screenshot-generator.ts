import { chromium, Browser, Page } from "playwright";
import fs from "fs/promises";
import path from "path";

interface ComponentInfo {
  name: string;
  title: string;
  htmlPath: string;
  imagePath: string;
}

class ScreenshotGenerator {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    console.log("🚀 Initializing browser for screenshot generation...");
    this.browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-default-apps",
        "--disable-extensions",
      ],
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async captureComponentScreenshot(
    htmlFilePath: string,
    outputPath: string,
    componentName: string
  ): Promise<void> {
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }

    const page: Page = await this.browser.newPage();

    try {
      // Set viewport for consistent screenshots
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Load the HTML file
      const fileUrl = `file://${path.resolve(htmlFilePath)}`;
      await page.goto(fileUrl, { waitUntil: "networkidle" });

      // Wait for any animations or dynamic content
      await page.waitForTimeout(3000);

      // Ensure everything is loaded
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      await page.waitForTimeout(1000);

      // Get the content dimensions
      const bodyHandle = await page.$("body");
      if (!bodyHandle) {
        throw new Error("Could not find body element");
      }

      const boundingBox = await bodyHandle.boundingBox();
      if (!boundingBox) {
        throw new Error("Could not get body bounding box");
      }

      // Ensure the output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Take screenshot with high quality
      await page.screenshot({
        path: outputPath,
        type: "png",
        fullPage: true,
        clip: {
          x: 0,
          y: 0,
          width: Math.min(boundingBox.width + 100, 1920),
          height: Math.min(boundingBox.height + 100, 3000),
        },
      });

      console.log(`✅ Screenshot saved: ${outputPath}`);
    } catch (error) {
      console.error(
        `❌ Error capturing screenshot for ${componentName}:`,
        error
      );
      throw error;
    } finally {
      await page.close();
    }
  }

  async findAllComponents(): Promise<ComponentInfo[]> {
    const components: ComponentInfo[] = [];
    const baseContentPath = path.join(
      process.cwd(),
      "src",
      "content",
      "tailwind-components"
    );

    try {
      // Check if the directory exists
      await fs.access(baseContentPath);

      // Get all year directories
      const yearDirs = await fs.readdir(baseContentPath);

      for (const yearDir of yearDirs) {
        const yearPath = path.join(baseContentPath, yearDir);
        const yearStat = await fs.stat(yearPath);

        if (yearStat.isDirectory()) {
          // Get all component directories in this year
          const componentDirs = await fs.readdir(yearPath);

          for (const componentDir of componentDirs) {
            const componentPath = path.join(yearPath, componentDir);
            const componentStat = await fs.stat(componentPath);

            if (componentStat.isDirectory()) {
              const htmlPath = path.join(componentPath, "code", "index.html");
              const imagePath = path.join(
                componentPath,
                "images",
                `tailwind-component-${componentDir}.png`
              );

              // Check if HTML file exists
              try {
                await fs.access(htmlPath);
                components.push({
                  name: componentDir,
                  title: componentDir.replace(/-/g, " "),
                  htmlPath,
                  imagePath,
                });
              } catch (error) {
                console.log(
                  `⚠️  HTML file not found for ${componentDir}, skipping...`
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Components directory not found: ${baseContentPath}`);
    }

    return components;
  }

  async generateAllScreenshots(): Promise<void> {
    console.log("🔍 Scanning for components...");
    const components = await this.findAllComponents();

    if (components.length === 0) {
      console.log("📭 No components found to generate screenshots for.");
      return;
    }

    console.log(`📸 Found ${components.length} components to process`);

    for (const component of components) {
      console.log(`📸 Generating screenshot for: ${component.title}`);
      try {
        await this.captureComponentScreenshot(
          component.htmlPath,
          component.imagePath,
          component.title
        );
      } catch (error) {
        console.error(
          `❌ Failed to generate screenshot for ${component.name}:`,
          error
        );
        // Continue with other components even if one fails
      }
    }
  }
}

// Main execution
async function main() {
  const generator = new ScreenshotGenerator();

  try {
    console.log("🚀 Starting automated screenshot generation...");
    console.log(
      "📋 This will generate high-quality screenshots for Tailwind components"
    );
    console.log("⏱️  Please wait while we capture the screenshots...");

    await generator.initialize();
    await generator.generateAllScreenshots();

    console.log("\n✨ Screenshot generation completed!");
    console.log(
      "🎯 All component images have been saved to their respective directories"
    );
  } catch (error) {
    console.error("\n❌ An error occurred:", error);
    console.log(
      "💡 Make sure you have Playwright installed: npm install playwright"
    );
    console.log("💡 Install browsers: npx playwright install chromium");
    process.exit(1);
  } finally {
    await generator.cleanup();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ScreenshotGenerator;
