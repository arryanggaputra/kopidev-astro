// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import path from "path";

// https://astro.build/config
export default defineConfig({
  site: "https://kopi.dev",
  integrations: [tailwind(), mdx(), sitemap()],
  vite: {
    resolve: {
      alias: {
        "~/components": path.resolve("./src/components"),
        "~/config": path.resolve("./src/config"),
      },
    },
  },
});
