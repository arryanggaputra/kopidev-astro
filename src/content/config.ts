import { defineCollection, reference, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      language: z.string(),
      title: z.string(),
      date: z.date(),
      categories: z.array(z.string()).optional(), // Changed from reference to string array
      // slug: z.string(),
      coverImage: image().optional(),
    }),
});

const categoryCollection = defineCollection({
  type: "content",
  schema: z.object({ title: z.string(), description: z.string() }),
});

const tailwindComponentsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      language: z.string(),
      title: z.string(),
      date: z.date(),
      categories: z.array(z.string()).optional(),
      slug: z.string().optional(),
      coverImage: image().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  categories: categoryCollection,
  "tailwind-components": tailwindComponentsCollection,
};
