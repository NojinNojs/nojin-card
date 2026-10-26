<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { profile: p, channels } = $derived(data);
	const themeBackground = __THEME_BACKGROUND__;
	const site = $derived(`https://${p.domain}/`);
	const structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Person',
					'@id': `${site}#person`,
					name: `${p.name.given} ${p.name.family}`,
					givenName: p.name.given,
					familyName: p.name.family,
					alternateName: [p.name.display, p.handle],
					url: site,
					description: p.copy.description,
					sameAs: channels.map((channel) => channel.url)
				},
				{
					'@type': 'WebSite',
					'@id': `${site}#website`,
					url: site,
					name: p.name.display,
					description: p.copy.description,
					about: { '@id': `${site}#person` }
				}
			]
		}).replace(/</g, '\u003c')
	);
	import './session.css';
</script>

<svelte:head>
	<title>{p.name.display} — {p.role}</title>
	<meta name="description" content={p.copy.description} />
	<meta property="og:title" content={`${p.name.display} — ${p.role}`} />
	<meta property="og:description" content={p.copy.description} />
	<meta property="og:image" content={`https://${p.domain}${p.operator.og}`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site} />
	<meta property="og:site_name" content={p.name.display} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:alt" content={p.operator.label} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="theme-color" content={themeBackground} />
	<link rel="canonical" href={site} />
	<link
		rel="preload"
		href="/fonts/silkscreen-nojin-400.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	{@html `<script type="application/ld+json">${structuredData}</script>`}
	<script src="/app.js" defer></script>
</svelte:head>

<main class="stage">
	<div class="art">
		<picture>
			<source type="image/avif" srcset={p.operator.avif} />
			<source type="image/webp" srcset={p.operator.webp} />
			<img
				src={p.operator.image}
				alt={p.operator.label}
				width="736"
				height="977"
				loading="eager"
				fetchpriority="high"
				decoding="async"
			/>
		</picture>
	</div>
	<div class="veil" aria-hidden="true"></div>

	<header class="top">
		<div class="identity">
			<h1>{p.name.display}<span>.</span></h1>
			<p class="greeting">{p.copy.greeting}</p>
			<p class="desc">{p.copy.description}</p>
		</div>
	</header>

	<footer class="bottom">
		<div class="links-wrap">
			<nav class="links" aria-label="Social and support links">
				{#each channels as channel, index}
					<a
						data-channel={channel.id}
						data-key={index + 1}
						href={channel.url}
						rel="me"
						style:--entrance-order={index + 3}
					>
						<span class="idx">{String(index + 1).padStart(2, '0')}</span>
						<span class="label">{channel.label}</span>
						<span class="key" aria-hidden="true"><kbd>{index + 1}</kbd></span>
						<span class="arrow" aria-hidden="true">→</span>
					</a>
				{/each}
			</nav>
			<div class="link-meta">
				<p class="hint">press <kbd>1</kbd>–<kbd>4</kbd> to open</p>
				<p class="domain">{p.domain}</p>
			</div>
		</div>
	</footer>
</main>
