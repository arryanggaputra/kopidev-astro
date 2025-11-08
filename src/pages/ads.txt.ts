import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const adsContent = `google.com, pub-9343099184243971, DIRECT, f08c47fec0942fa0`;

  return new Response(adsContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
