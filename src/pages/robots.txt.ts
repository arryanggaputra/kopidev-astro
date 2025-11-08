import type { APIRoute } from "astro";
import { SITE_CONFIG } from "../config/site";

export const GET: APIRoute = () => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# Block access to admin areas if any exist
Disallow: /admin/
Disallow: /private/

# Allow all crawlers access to CSS and JS files
Allow: /css/
Allow: /js/
Allow: /images/
Allow: /_astro/

# Crawl delay (optional)
Crawl-delay: 1
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
