import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { profileSchema } from './src/lib/schema';

const profile = profileSchema.parse(
	parse(
		readFileSync(new URL('./src/lib/profile.yaml', import.meta.url), 'utf8')
	)
);
export default defineConfig({
	define: {
		__THEME_BACKGROUND__: JSON.stringify(profile.theme.background)
	},
	plugins: [
		{
			name: 'profile-theme-tokens',
			enforce: 'pre',
			transform(source, id) {
				if (!id.endsWith('/session.css')) return;
				return source.replace(
					'/* @profile-theme */',
					Object.entries(profile.theme)
						.map(([name, value]) => `--${name}: ${value};`)
						.join('\n')
				);
			}
		},
		sveltekit()
	]
});
