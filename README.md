# nojin-card

The page at [nojin.is-a.dev](https://nojin.is-a.dev). One screen: a name, a sentence, four links. No scroll, no cookie banner, no "let's connect".

## why this exists at all

I tried the usual link-in-bio services first. Four links, and the page still wanted a few hundred kilobytes of JavaScript, a tracking pixel, and a subdomain I didn't own. That felt backwards for something that is, structurally, a business card. So the page became a document instead: one HTML file that reads fine with JavaScript switched off, and a handful of files around it.

## how it's built, and why

It's SvelteKit compiled with `adapter-static`. I wanted components and a build step without a framework running in the browser, and that's exactly what this setup gives: I write `.svelte` files, the build emits plain HTML, and nothing of the framework ends up in the bundle. Astro would have worked too, and it's what I'd switch to if this ever grew a blog or a feed. Hand-written HTML would also work today, but the moment a second page exists the header, the links and the meta tags get copy-pasted, and that's how small projects start rotting.

The reason there's no client runtime isn't ideological, it's arithmetic. The page has two behaviours: keys `1`–`4` open the matching link, and the artwork shifts a few pixels when the pointer moves. Hydrating Svelte for that cost around 99 KB — more than every other asset on the page combined. So I removed it and wrote `static/app.js` by hand instead. It's two kilobytes, it has no dependencies, and if it fails the page still works; you just lose the shortcuts.

```js
// keys 1-4 open a link, pointer parallax for mice only, nothing else
```

Everything visual — layout, the entrance animation, hover states, the reduced-motion kill switch — lives in CSS. Bun is in the toolchain only because install and build are faster with it; nothing of Bun reaches production, and npm or pnpm would work the same. Tailwind isn't there because one screen with one design doesn't need a build-time CSS pipeline. The tokens are custom properties inside `@layer`, so the spacing scale and the amber accent are named once and used everywhere. On a project with ten components and a design system I'd reach for Tailwind without arguing — this isn't that project.

Content sits apart from the markup in [`src/lib/profile.yaml`](src/lib/profile.yaml): name, greeting, description, the four links, the theme. [`src/lib/schema.ts`](src/lib/schema.ts) validates it with Zod before the build finishes, so a typo fails with the field name instead of shipping a page with an empty row. That's also what makes editing from a phone realistic: open the file, change a line, push.

## the weight argument

Most of the budget went into three decisions. The illustration is served as AVIF at about 34 KB, with a WebP fallback through `<picture>`, because a JPEG of the same quality was both bigger and softer at this size. It's a 736×977 portrait and it's never stretched or cropped to fit a viewport — it's sized to itself and its edges are feathered with a CSS mask into a gradient sampled from the artwork's own corners. The pixel font is Silkscreen, subset to the glyphs that actually appear: 2.6 KB, self-hosted, no request to Google. Body text uses the system UI font, which costs nothing and looks sharper than a webfont on every platform.

All told the page is about 52 KB raw and around 42 KB over the wire, image included, with zero third-party requests:

| | raw | over the wire |
|---|---|---|
| HTML | 4.8 KB | 1.6 KB |
| CSS | 9.0 KB | 2.6 KB |
| `app.js` | 2.0 KB | 0.8 KB |
| Silkscreen subset | 2.6 KB | 2.6 KB |
| Artwork (AVIF) | 34 KB | 34 KB |
| **total** | **~52 KB** | **~42 KB** |

Search engines get honest metadata rather than decoration: `robots.txt` and `sitemap.xml` as static files, canonical and `og:*` pointing at the real domain, and JSON-LD `Person` carrying the full name and the same links that are on the page. The old `nojin.vercel.app` address 308-redirects to the domain through `vercel.json`, because two addresses for one page is one too many.

## what isn't there

No analytics, no theme toggle, no cookie banner, no contact form, no back-to-top button (there is nowhere to scroll), and no animation that isn't either an entrance or feedback for something you did. Each of those is easy to add and each one would have made the page heavier without answering a question a visitor actually has.

If this ever has to grow, the discipline stays and the tool changes: prerender every route, keep the client runtime at zero, and add JavaScript only where a static document genuinely cannot do the job.

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
