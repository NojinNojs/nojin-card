import { z } from 'zod';

const text = z.string().min(1);
const https = z.url({ protocol: /^https$/ });
const timestamp = z.iso.datetime().nullable();
const color = z
	.string()
	.regex(/^#[0-9a-fA-F]{6}$/, 'Expected a six-digit hex color');
const localImage = z
	.string()
	.regex(/^\/art\/[a-z0-9-]+\.(?:png|webp|avif|jpg)$/, 'Expected a local /art/ image');
export const repositorySchema = z.object({
	name: text,
	language: z.string(),
	pushed_at: timestamp,
	description: z.string(),
	url: https
});
export const profileSchema = z.object({
	name: z.object({
		given: z
			.string({ error: 'name.given must be a non-empty string' })
			.trim()
			.min(1, 'name.given must be a non-empty string'),
		family: z
			.string({ error: 'name.family must be a non-empty string' })
			.trim()
			.min(1, 'name.family must be a non-empty string'),
		display: z
			.string({ error: 'name.display must be a non-empty string' })
			.trim()
			.min(1, 'name.display must be a non-empty string')
	}),
	handle: text,
	role: text,
	domain: text,
	stack: z.array(text),
	channels: z
		.array(
			z
				.object({
					id: text,
					label: text,
					url: https.optional(),
					hidden: z.boolean()
				})
				.refine((c) => c.hidden || Boolean(c.url), {
					path: ['url'],
					message: 'Visible channels require an HTTPS URL'
				})
		)
		.superRefine((items, context) => {
			const ids = new Set<string>();
			items.forEach((item, i) => {
				if (ids.has(item.id))
					context.addIssue({
						code: 'custom',
						path: [i, 'id'],
						message: 'Duplicate channel ID'
					});
				ids.add(item.id);
			});
			for (const id of ['github', 'x', 'discord', 'trakteer']) {
				if (!items.some((c) => c.id === id && !c.hidden))
					context.addIssue({
						code: 'custom',
						path: [id],
						message: 'Required visible channel missing'
					});
			}
		}),
	operator: z.object({
		image: localImage,
		avif: localImage,
		webp: localImage,
		og: localImage,
		label: text,
		prompt: text
	}),
	theme: z.object({
		background: color,
		surface: color,
		text: color,
		muted: color,
		line: color,
		accent: color,
		texture: color,
		scrim: color
	}),
	copy: z.object({
		title: text,
		greeting: text,
		description: text
	}),
	repositories: z.object({
		capturedAt: timestamp,
		source: text,
		items: z.array(repositorySchema).superRefine((items, context) => {
			const names = new Set<string>();
			items.forEach((item, i) => {
				if (names.has(item.name))
					context.addIssue({
						code: 'custom',
						path: [i, 'name'],
						message: 'Duplicate repository ID (name)'
					});
				names.add(item.name);
			});
		})
	})
});
export type Repository = z.infer<typeof repositorySchema>;
