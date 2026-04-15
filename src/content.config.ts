import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().nullable().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			// New fields for content management
			tags: z.array(z.string()).default([]),
			category: z.string().optional(),
			series: z.string().optional(),
			seriesOrder: z.number().optional(),
			draft: z.boolean().default(false),
		}),
});

const news = defineCollection({
	loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().nullable().optional(),
		pubDate: z.coerce.date(),
	}),
});

const til = defineCollection({
	loader: glob({ base: './src/content/til', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().nullable().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		category: z.string().optional(), // e.g. 'algorithm', 'cs', 'os', 'network'
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, news, til };
