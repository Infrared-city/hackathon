# CONTRIBUTING — content updates

Plain-English guide for editing the hackathon site copy, images, dates, and prizes. **No backend changes here** — that's covered in [`CLAUDE.md`](CLAUDE.md).

## The 30-second mental model

1. **Edit the file** that owns the section.
2. **Push to `main`**.
3. **30 seconds later** the live site updates at `hackathon-73i.pages.dev`.

If you broke something, the GitHub Action turns red — open `Infrared-city/hackathon` → Actions tab → click the failing run → read the error. Most failures are TypeScript complaints about a misplaced comma or quote.

## Setup (once)

```bash
git clone git@github.com-company:Infrared-city/hackathon.git
cd hackathon
npm install
npm run dev    # http://localhost:5173 — auto-reloads as you edit
```

## What's where

All editable content lives in `src/components/landing/`. **One file per landing-page section.** You can almost always edit just the array/constant at the top of the file and ignore the rest.

| You want to edit… | Open this file |
|---|---|
| The big headline + subtitle + stats at the top | `HeroSection.tsx` |
| The 6 challenge tracks (titles, blurbs, images) | `TracksSection.tsx` |
| The schedule table | `TimelineSection.tsx` |
| The prize amounts | `PrizesSection.tsx` |
| "Who this is for" + starter kit cards | `ResourcesSection.tsx` |
| Python code snippet shown on the page | `QuickStartSection.tsx` |
| FAQ list | `FaqSection.tsx` |
| Bottom CTA section | `FinalCtaSection.tsx` |
| Event dates (drives the countdown) | `src/lib/config.ts` |
| Skill chips on the registration form | `src/types/index.ts` → `SKILLS` |
| Available submission tracks (dropdown) | `src/types/index.ts` → `TRACKS` |

**Do NOT edit:** `src/pages/`, `src/lib/api.ts`, `src/lib/useStatus.ts`, anything in `windmill/`, anything in `.github/`. Those are wiring — ask Serjoscha if you think they need to change.

## Common edits — recipes

### Change a track's title or description

Open `TracksSection.tsx`. Find the `tracks` array at the top:

```tsx
const tracks = [
  {
    title: 'Urban Heat',
    apis: 'UTCI · Thermal Comfort Statistics',
    body: 'Map heat stress, find cool corridors, quantify the impact of tree planting.',
    img: `${CDN}/media/image/72la5kotgtpi/optimised.jpg`,
  },
  …
]
```

Edit `title`, `apis`, or `body` strings. **Keep the quotes and commas exactly as they are.** Save, push, done.

### Swap a track image

1. Go to https://media.infrared.city
2. Find / upload the image you want
3. Copy the **`url_optimised`** value (NOT `url_original`)
4. Paste it as the `img:` value for that track

### Add an FAQ item

Open `FaqSection.tsx`, find the `faqs` array. Add an entry:

```tsx
{
  q: 'Can I join solo?',
  a: 'Yes, but you can also use the participant canvas to find teammates.',
},
```

Order in the array = order on the page. Trailing comma after the last item is fine (keep it).

### Change the kickoff date

Open `src/lib/config.ts`. Three constants:

```ts
export const HACKATHON_START = new Date('2026-05-27T15:00:00Z')   // when /get-key form unlocks
export const HACKATHON_END   = new Date('2026-05-31T22:00:00Z')   // submission deadline
export const WINNER_DATE     = new Date('2026-06-02T15:00:00Z')   // winners announced
```

**Times are UTC.** CET = UTC+1 winter / UTC+2 summer. So 17:00 CET in May (summer) = 15:00 UTC.

The countdown reads `HACKATHON_START` automatically. The schedule table (`TimelineSection.tsx`) is **separate** — also edit the dates there if you change `HACKATHON_START`.

### Change prize amounts

Open `PrizesSection.tsx` → `prizes` array. Each entry has `rank`, `amount`, `title`, `body`. First item gets a gold gradient border — keep it as 1st place.

## Launch day (May 27) — operational

These are **not content edits**, they're flag flips. Done in the Windmill UI, not in the code:

1. https://windmill.team.infrared.city → log in
2. Sidebar **Variables** → search `hackathon`
3. Open `f/hackathon/registration_status` → **Edit** → change `locked` → `open` → Save
4. Same for `f/hackathon/submission_status` (probably keep `locked` until the actual submission window opens later)

The frontend re-fetches the status every 60 seconds. After a flag flip, hard-refresh once to see the change immediately.

## Image catalogue

All images are hosted on the Infrared media service at `media.infrared.city`. Browse + upload there. **Always use `url_optimised`** (about 1500px wide, ~150KB) — the `url_original` field can be a 20MB raw upload.

URLs look like: `https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev/media/image/<id>/optimised.jpg`

## Testing before pushing

```bash
npm run dev       # localhost:5173 — visual check
npm run build     # catches TypeScript errors
```

If `npm run build` exits clean, GitHub Actions will too.

## If GitHub Actions fails

Open `Infrared-city/hackathon` → **Actions** tab → click the red ❌ run → expand the failing step. Almost always one of:

- **Stray quote/bracket/comma** — find it, fix it, push again
- **`Property 'X' does not exist on type 'Y'`** — you typed a field name wrong inside an array entry
- **Build timeout** — re-run from the Actions UI (transient)

Ping Serjoscha if it's not obvious.

## Don't do

- Don't run `wrangler pages deploy` manually — let GitHub Actions handle it.
- Don't edit anything in `windmill/` or `.github/workflows/` — that's CI plumbing.
- Don't commit anything to a branch other than `main` (or if you do, open a PR).
- Don't paste API keys / tokens / secrets into source files. **Ever.** All secrets are in GitHub Actions secrets / Windmill variables.
