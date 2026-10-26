# nojin-card

The page at [nojin.is-a.dev](https://nojin.is-a.dev). One screen: a name, a sentence, four links. No scroll, no cookie banner, no "let's connect".

It's a small site, so most of the interesting part is what I *didn't* add. Below are the questions I get asked about it, answered properly.

## why not just use a link-in-bio service?

Because four links don't need 200–300 KB of JavaScript, a tracking pixel, and a subdomain I don't own. A page this simple should be a document.

## why SvelteKit for a single page?

I wanted components and a build step without shipping a framework runtime. SvelteKit with `adapter-static` gives me that: I write `.svelte` files, the build emits plain HTML, and nothing of the framework reaches the browser.

Alternatives I considered: Astro would also work and would be my pick if this grew a blog. Hand-written HTML would work today, but then the header, the link list and the meta tags get copy-pasted the moment a second page exists.

## why is there no client-side JavaScript framework?

The page has exactly two bits of behaviour: `1`–`4` open links, and the artwork shifts a few pixels with the pointer. A runtime for that costs ~99 KB, which is more than the entire rest of the page.

So it's prerendered HTML plus one `static/app.js` file, about 2 KB:

```js
// keys 1-4 open the matching link, pointer parallax for mouse users only
// no framework, no polyfill, no dependency
```

Everything else — layout, the entrance animation, hover states, reduced-motion — is CSS. If you disable JavaScript, the page still reads perfectly; you just lose the shortcuts.

## why Bun?

For install and script speed, honestly. There's no Bun in production: the output is static files. If you prefer npm or pnpm, `package.json` works the same.

## why no Tailwind?

One screen doesn't justify a build-time CSS pipeline. The design tokens are CSS custom properties inside `@layer`, so spacing and colour are named once:

```css
--space-3: 12px;
--accent: #FFC27A;
```

On a bigger project with a design system and multiple components, I'd reach for Tailwind or a component library without arguing. This isn't that project.

## why YAML instead of hardcoded text?

So the content is separate from the markup, and so I can edit from my phone without touching a component. `src/lib/schema.ts` validates it with Zod, which means a typo fails the build with the field name instead of shipping a page with an empty link.

The whole readable site — name, greeting, description, four links, theme — lives in [`src/lib/profile.yaml`](src/lib/profile.yaml).

## why AVIF and WebP instead of one JPEG?

The illustration is the only heavy asset, so it gets the good encoders: AVIF at ~34 KB with a WebP fallback through `<picture>`. A JPEG at the same quality was bigger and looked worse at this size.

The image is never stretched or cropped to fit a viewport. It's a 736×977 portrait, sized to itself, with a CSS mask feathering its edges into a gradient sampled from the artwork's own corners.

## why a subset font?

Silkscreen is the pixel face used for the name and labels. I subset it to the glyphs actually on the page: **2.6 KB** instead of a full family, and no request to Google Fonts. The body text uses the system UI font, which costs nothing and renders sharper.

## what about SEO and sharing?

`robots.txt` and `sitemap.xml` are static files. Canonical, `og:*` and JSON-LD `Person` all point at `nojin.is-a.dev`, so a search engine knows the name is "Nojs Nojin" and the page is the same person as the links. There's an OG image at 1200×630 for link previews.

`nojin.vercel.app` 308-redirects to the real domain through `vercel.json`, because two addresses for one page is one too many.

## what's the actual weight?

| | raw | over the wire |
|---|---|---|
| HTML | 4.8 KB | 1.6 KB |
| CSS | 9.0 KB | 2.6 KB |
| `app.js` | 2.0 KB | 0.8 KB |
| Silkscreen subset | 2.6 KB | 2.6 KB |
| Artwork (AVIF) | 34 KB | 34 KB |
| **total** | **~52 KB** | **~42 KB**, 0 third-party requests |

## what did you leave out on purpose?

Analytics, a theme toggle, a cookie banner, a "back to top" button (there's nowhere to scroll), a contact form, and any animation that isn't either an entrance or feedback for an action.

## what would you change if this had to grow?

Keep the budget. Prerender every route, keep the client runtime at zero, and only add JavaScript where a static document genuinely can't do the job. If it needed writing and a feed, I'd move to Astro and keep exactly this discipline.

## running it

```sh
bun install
bun run dev      # http://localhost:5173
bun run check
bun run build    # static output in build/
```

Deployed on Vercel.

## the artwork

Not mine and not licensed for reuse — fan art of Lain Iwakura from *Serial Experiments Lain*. The code is mine; the image isn't.
