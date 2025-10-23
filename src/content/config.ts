import { defineCollection, z } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  slug: z
    .string()
    .optional()
    .describe('Kebab-case slug; defaults to file name when omitted'),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  author: z.string().default('Editorial Team'),
  section: z.enum(['healthy-eating', 'clean-eating', 'meal-prep', 'healthy-recipes', 'resources']),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  readingTime: z.number().optional(),
  toc: z.boolean().default(true),
  featured: z.boolean().default(false),
  canonical: z.string().url().optional(),
  ads: z
    .object({
      top: z.boolean().default(false),
      mid: z.boolean().default(false),
      bottom: z.boolean().default(false)
    })
    .default({ top: false, mid: false, bottom: false }),
  schemaType: z.enum(['Article', 'Recipe', 'Product', 'HowTo']).default('Article'),
  faq: z
    .array(
      z.object({
        q: z.string(),
        a: z.string()
      })
    )
    .default([]),
  recipe: z
    .object({
      cuisine: z.string().optional(),
      type: z.string().optional(),
      calories: z.number().optional(),
      prepTime: z.string().optional(),
      cookTime: z.string().optional(),
      totalTime: z.string().optional(),
      servings: z.union([z.number(), z.string()]).optional(),
      ingredients: z.array(z.string()).default([]),
      instructions: z.array(z.string()).default([]),
      nutrition: z
        .object({
          calories: z.union([z.number(), z.string()]).optional(),
          protein: z.string().optional(),
          carbs: z.string().optional(),
          fat: z.string().optional()
        })
        .partial()
        .optional()
    })
    .partial()
    .optional(),
  products: z
    .array(
      z.object({
        name: z.string(),
        brand: z.string().optional(),
        affiliateUrl: z.string().url().optional(),
        image: z.string().optional(),
        pros: z.array(z.string()).default([]),
        cons: z.array(z.string()).default([]),
        price: z.string().optional()
      })
    )
    .default([])
});

const articleCollection = defineCollection({
  type: 'content',
  schema: baseSchema
});

export const collections = {
  'healthy-eating': articleCollection,
  'clean-eating': articleCollection,
  'meal-prep': articleCollection,
  'healthy-recipes': articleCollection,
  resources: articleCollection
};
