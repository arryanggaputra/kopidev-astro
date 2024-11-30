import { defineCollection, reference, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    language: z.string(),
    title: z.string(),
    date: z.date(),
    categories: z.array(reference("categories")).optional(),
    // slug: z.string(),
    coverImage: z.string().optional(),
  }),
});

const categoryCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
  categories: categoryCollection,
};
