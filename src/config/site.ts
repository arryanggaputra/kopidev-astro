// Site configuration
export const SITE_CONFIG = {
  title: "Kopidev",
  description: "Berbagi tentang programming dan teknologi",
  url: "https://kopi.dev",
  author: "Arryangga Aliev Pratamaputra",
  locale: "id-ID",

  // Social links
  social: {
    twitter: "@arryangga",
    github: "arryangga",
    youtube: "UC...", // Add your YouTube channel ID if needed
  },

  // Development settings
  dev: {
    port: 4321,
    host: "localhost",
  },
} as const;

// Helper function to get the base URL
export function getBaseUrl(isDev = false) {
  if (isDev || import.meta.env.DEV) {
    return `http://${SITE_CONFIG.dev.host}:${SITE_CONFIG.dev.port}`;
  }
  return SITE_CONFIG.url;
}

// Helper function to create full URLs
export function createUrl(path: string, isDev = false) {
  const baseUrl = getBaseUrl(isDev);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
