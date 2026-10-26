# nojin-card

My personal page. One screen: a name, one sentence, four links.

Live at [nojin.is-a.dev](https://nojin.is-a.dev).

## How it's built

SvelteKit, prerendered to static HTML. There is no client runtime — the page is a document,
and the only script is a ~2 KB file for the `1`–`4` shortcuts and a small pointer parallax.
The illustration and the blue gradient are the only images.

## Editing

Everything readable lives in [`src/lib/profile.yaml`](src/lib/profile.yaml): name, greeting,
description, links, theme. It's validated by [`src/lib/schema.ts`](src/lib/schema.ts), so a typo
fails the build with the field name instead of shipping a broken page.

## Running

```sh
bun install
bun run dev          # http://localhost:5173
bun run check
bun run build        # static output in build/
```

Hosted on Vercel. The artwork in `static/art/` isn't mine to license.
