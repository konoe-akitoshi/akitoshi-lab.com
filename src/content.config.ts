import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),
  }),
});

export const collections = { works, awards };
