// Site configuration
export const SITE_CONFIG = {
  title: "Kopidev",
  description:
    "Kopidev is a leading developer community and technology media platform, featuring the latest information about technology, programming, tutorials, and developer events.",
  url: "https://kopi.dev",
  author: "Arryangga Aliev Pratamaputra",
  locale: "en-US",

  // Organization info
  organization: {
    name: "Kopidev",
    alternateName:
      "Kopidev - Developer Community, Software Development, Tech Education",
    logo: "/images/kopidev_logo.png",
    foundingDate: "2019",
    email: "hello@kopi.dev",
    phone: "+6281931520239",
  },

  // Social links
  social: {
    twitter: "@arryangga",
    github: "arryanggaputra",
    facebook: "kopidev",
    linkedin: "arryanggaputra",
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
