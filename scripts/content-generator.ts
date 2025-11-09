import { Octokit } from "@octokit/rest";

export interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface GeneratedComponent {
  title: string;
  code: string;
  slug: string;
  categories: string[];
  description: string;
}

export class ContentGenerator {
  private accountId: string;
  private apiToken: string;
  private octokit: Octokit;

  constructor(accountId: string, apiToken: string, githubToken: string) {
    this.accountId = accountId;
    this.apiToken = apiToken;
    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  async generateComponent(prompt: string): Promise<GeneratedComponent> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/meta/llama-3.1-70b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an expert frontend engineer. Create sophisticated Tailwind CSS components.
              
              REQUIREMENTS:
              - Return ONLY valid JSON, no explanations
              - Do NOT use template literals or backticks
              - Create complete, professional components
              - Include interactive features (hover effects, animations, JavaScript when needed)
              - Use advanced Tailwind features (gradients, transforms, shadows)
              - Make components responsive and modern
              - Include external libraries when appropriate (Chart.js, Google Fonts)
              - Create production-ready, premium-quality components
              
              JSON format:
              {
                "title": "Component Name",
                "code": "Complete HTML with head, styles, scripts, and sophisticated design",
                "categories": ["category"],
                "description": "Detailed description of features"
              }`,
            },
            {
              role: "user",
              content: `${prompt}. Create a sophisticated component with multiple interactive elements, modern design, and professional quality.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare AI API error: ${response.statusText}`);
    }

    const data: CloudflareAIResponse = await response.json();

    if (!data.success) {
      throw new Error(`AI generation failed: ${JSON.stringify(data.errors)}`);
    }

    // Parse the AI response
    let aiResponse = data.result.response.trim();
    console.log(`📝 AI Response length: ${aiResponse.length} characters`);
    console.log(`📄 AI Response preview: ${aiResponse.substring(0, 200)}...`);

    // Clean up the response - remove thinking tags and markdown code blocks
    aiResponse = aiResponse
      .replace(/<think>[\s\S]*?<\/think>/g, "") // Remove thinking tags
      .replace(/```json\s*\n?/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    // If the response starts with thinking content, try to find JSON after it
    if (
      data.result.response.includes("<think>") ||
      !aiResponse.startsWith("{")
    ) {
      console.log("🧠 Detected reasoning model, extracting final answer...");

      // Look for the final JSON after all the thinking
      const thinkEndIndex = data.result.response.lastIndexOf("</think>");
      if (thinkEndIndex !== -1) {
        aiResponse = data.result.response.substring(thinkEndIndex + 8).trim();

        // Clean up again after extraction
        aiResponse = aiResponse
          .replace(/```json\s*\n?/g, "")
          .replace(/```\s*$/g, "")
          .trim();
      }

      // If still no JSON start, look for any JSON pattern
      if (!aiResponse.startsWith("{")) {
        const jsonStart = aiResponse.indexOf("{");
        if (jsonStart !== -1) {
          aiResponse = aiResponse.substring(jsonStart);
        }
      }
    }

    // Try to find and fix the JSON
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find incomplete JSON and complete it
      const startBrace = aiResponse.indexOf("{");
      if (startBrace !== -1) {
        let jsonStr = aiResponse.substring(startBrace);
        // Count braces to try to find where JSON should end
        let braceCount = 0;
        let endPos = -1;
        for (let i = 0; i < jsonStr.length; i++) {
          if (jsonStr[i] === "{") braceCount++;
          if (jsonStr[i] === "}") braceCount--;
          if (braceCount === 0) {
            endPos = i + 1;
            break;
          }
        }
        if (endPos > 0) {
          jsonStr = jsonStr.substring(0, endPos);
          jsonMatch = [jsonStr];
        }
      }
    }

    if (!jsonMatch) {
      console.warn("Could not find JSON in AI response:", aiResponse);

      // Check if response contains thinking tags
      if (data.result.response.includes("<think>")) {
        console.error("❌ AI response contains <think> tags instead of JSON");
        console.log(
          "💡 This indicates the AI model is doing reasoning instead of direct output"
        );
      }

      // Try to reconstruct from truncated response
      if (aiResponse.includes('"title"') || aiResponse.includes('"code"')) {
        console.log("🔧 Attempting to reconstruct truncated JSON...");

        const titleMatch = aiResponse.match(/"title"\s*:\s*"([^"]+)"/);
        const codeMatch = aiResponse.match(
          /"code"\s*:\s*"([^"]*(?:\\.[^"]*)*)/
        );
        const categoriesMatch = aiResponse.match(
          /"categories"\s*:\s*\[([^\]]*)/
        );
        const descMatch = aiResponse.match(/"description"\s*:\s*"([^"]*)/);

        // Try to extract more complete code from the raw response
        let extractedCode = codeMatch?.[1] || "";
        if (!extractedCode || extractedCode.length < 50) {
          // Look for code pattern in the full response
          const codePatternMatch = data.result.response.match(
            /"code"\s*:\s*"([^"]*(?:\\.[^"]*)*)/
          );
          if (codePatternMatch) {
            extractedCode = codePatternMatch[1];
          }
        }

        if (titleMatch && extractedCode) {
          const reconstructed = {
            title: titleMatch[1],
            code:
              extractedCode.replace(/\\"/g, '"').replace(/\\n/g, "\n") ||
              '<div class="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"><h2 class="text-2xl font-bold mb-2">Generated Component</h2><p class="opacity-90">Interactive component with modern design</p></div>',
            categories: categoriesMatch
              ? [categoriesMatch[1].replace(/"/g, "").split(",")[0].trim()]
              : ["widget"],
            description:
              descMatch?.[1] ||
              "Modern component with interactive features and responsive design",
          };

          console.log(
            "✅ Successfully reconstructed component from truncated response"
          );

          // Generate slug from title
          const slug = this.generateSlug(reconstructed.title);

          return {
            title: reconstructed.title,
            code: reconstructed.code,
            slug,
            categories: reconstructed.categories,
            description: reconstructed.description,
          };
        }
      }

      throw new Error("Could not extract JSON from AI response");
    }

    let parsedResponse;
    try {
      // Clean the JSON string more carefully
      let cleanJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
        .replace(/\\n/g, " ") // Convert newlines to spaces for HTML
        .replace(/\\t/g, " ") // Convert tabs to spaces
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      parsedResponse = JSON.parse(cleanJson);
    } catch (error) {
      console.error("Failed to parse JSON:", jsonMatch[0]);
      console.log("🔧 Attempting manual JSON extraction...");

      // Manual extraction for better reliability
      const rawResponse = jsonMatch[0];

      // Extract fields manually with better regex patterns that handle backticks
      const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]+)"/);
      const codeMatch = rawResponse.match(
        /"code"\s*:\s*(?:`([^`]*)`|"((?:[^"\\]|\\.)*)\")/
      );
      const categoriesMatch = rawResponse.match(
        /"categories"\s*:\s*\[([^\]]*)\]/
      );
      const descriptionMatch = rawResponse.match(
        /"description"\s*:\s*"([^"]+)"/
      );

      parsedResponse = {
        title: titleMatch?.[1] || "Generated Component",
        code:
          (codeMatch?.[1] || codeMatch?.[2])
            ?.replace(/\\"/g, '"')
            .replace(/\\n/g, "\n") ||
          '<div class="p-4">Generated content</div>',
        categories: categoriesMatch
          ? JSON.parse(`[${categoriesMatch[1]}]`)
          : ["widget"],
        description: descriptionMatch?.[1] || "Auto-generated component",
      };

      console.warn("Using manual parsing for:", parsedResponse.title);
    }

    // Generate slug from title
    const slug = this.generateSlug(parsedResponse.title);

    return {
      title: parsedResponse.title,
      code: parsedResponse.code,
      slug,
      categories: parsedResponse.categories || ["widget"],
      description: parsedResponse.description || "",
    };
  }

  async generateMultipleComponents(
    prompts: string[]
  ): Promise<GeneratedComponent[]> {
    const components: GeneratedComponent[] = [];

    for (const prompt of prompts) {
      try {
        console.log(`🤖 Generating component: ${prompt}`);
        const component = await this.generateComponent(prompt);
        components.push(component);

        // Rate limiting - wait between requests
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `❌ Failed to generate component for prompt "${prompt}":`,
          error
        );
      }
    }

    return components;
  }

  async checkIfComponentExists(slug: string): Promise<boolean> {
    try {
      await this.octokit.rest.repos.getContent({
        owner: "arryanggaputra",
        repo: "kopidev-astro",
        path: `src/content/tailwind-components/auto-generated/${slug}/index.mdx`,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async saveComponentToRepo(component: GeneratedComponent): Promise<void> {
    const basePath = `src/content/tailwind-components/auto-generated/${component.slug}`;
    const timestamp = new Date().toISOString();

    // Check if component already exists
    const exists = await this.checkIfComponentExists(component.slug);
    if (exists) {
      console.log(`⏭️  Component ${component.slug} already exists, skipping`);
      return;
    }

    // Create MDX content
    const mdxContent = `---
title: "${component.title}"
date: ${timestamp}
categories: ${JSON.stringify(component.categories)}
language: "html"
slug: "${component.slug}"
generated: true
---

${component.description}

This component was automatically generated using Cloudflare AI.
`;

    // Create HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100 p-8">
    ${component.code}
</body>
</html>`;

    try {
      // Create MDX file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: "arryanggaputra",
        repo: "kopidev-astro",
        path: `${basePath}/index.mdx`,
        message: `🤖 Add auto-generated component: ${component.title}`,
        content: Buffer.from(mdxContent).toString("base64"),
      });

      // Create HTML file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: "arryanggaputra",
        repo: "kopidev-astro",
        path: `${basePath}/code/index.html`,
        message: `🤖 Add HTML code for: ${component.title}`,
        content: Buffer.from(htmlContent).toString("base64"),
      });

      console.log(`✅ Saved component: ${component.title}`);
    } catch (error) {
      console.error(`❌ Failed to save component ${component.title}:`, error);
      throw error;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .substring(0, 50);
  }
}

export default ContentGenerator;
