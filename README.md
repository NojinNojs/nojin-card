# nojin-card

The page at [nojin.is-a.dev](https://nojin.is-a.dev). One screen: a name, a sentence, four links. No scroll, no cookie banner, no "let's connect".

I built it because the link-page services ship a few hundred kilobytes of JavaScript to render four links.

## How it works

SvelteKit, prerendered to static HTML. There is no client runtime — the page is a document.
The only script is `static/app.js` (about 2 KB) for the `1`–`4` shortcuts and a small pointer parallax.

- Artwork served as AVIF with a WebP fallback, 736×977, never stretched.
- Silkscreen subset to the glyphs actually used: 2.6 KB.
- Whole page loads in about 40 KB, image included.
- `robots.txt` and `sitemap.xml` are static files; canonical and JSON-LD point at the real domain.
- `nojin.vercel.app` 308s to `nojin.is-a.dev` through `vercel.json`.

## Editing it

Everything readable lives in [`src/lib/profile.yaml`](src/lib/profile.yaml): name, greeting, description, links, theme. It's validated by [`src/lib/schema.ts`](src/lib/schema.ts), so a typo fails the build with the field name instead of shipping a broken page.

```sh
bun install
bun run dev      # http://localhost:5173
bun run check
bun run build    # static output in build/
```

Deployed on Vercel.

## The artwork

Not mine and not licensed for reuse — fan art of Lain Iwakura from *Serial Experiments Lain*. The code is mine; the image isn't.
