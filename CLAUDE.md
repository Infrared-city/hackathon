# Hackathon Platform — CLAUDE.md

Infrared SDK Buildathon website. React + TypeScript + Tailwind, deployed to Cloudflare Pages.
Live: `hackathon.infrared.city` (CF Pages project: `hackathon`)

## Deploy

Push to `main` → GitHub Actions builds + deploys automatically (≈ 2 min).
Manual: `source ~/.run8n.env && CLOUDFLARE_ACCOUNT_ID=76766acc855cf7634a25fa485a4f5e52 CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN npm run deploy`

## Content updates — what to edit and where

All content lives in `src/components/landing/`. Each file is one section of the landing page.
**Never touch** `src/pages/`, `src/lib/`, `tests/`, or config files unless explicitly asked.

### Event dates
**`src/lib/config.ts`** — three constants:
- `HACKATHON_START` — when the registration form unlocks (countdown disappears)
- `HACKATHON_END` — submission deadline
- `WINNER_DATE` — winner announcement

Dates are UTC. CET = UTC+1 (winter) / UTC+2 (summer).
Example: May 27 17:00 CET = `2026-05-27T15:00:00Z`

### Hero section (top of page)
**`src/components/landing/HeroSection.tsx`**
- `h1` tag: the big headline (`5 lines of code. Any city. Any climate.`)
- `p` tag below it: subtitle paragraph
- Two `<a>` links: primary CTA (`Join the Hackathon`) and secondary (`Submit Project`)
- `heroStats` array: the 4 stat boxes (value + label)
- Hero image: the `SF_THERMAL` constant at the top — replace URL with a different media URL if needed

### Challenge tracks
**`src/components/landing/TracksSection.tsx`**
- `tracks` array — each entry: `title`, `apis`, `body`, `img`
- `img` must be a `url_optimised` from the media catalogue (`media.infrared.city`)
- 7 tracks expected — reorder freely, change copy, swap images

### Schedule
**`src/components/landing/TimelineSection.tsx`**
- `days` array — each entry: `date`, `label`, `events[]`
- Each event: `time`, `title`, `note`
- The eyebrow text (`📅 May 27–31...`) — update dates there too

### Prizes
**`src/components/landing/PrizesSection.tsx`**
- `prizes` array — `rank`, `amount`, `title`, `body`
- First entry is highlighted (gradient border). Keep it as 1st place.

### "Who this is for" + starter kit
**`src/components/landing/ResourcesSection.tsx`**
- `audience` array — 4 cards describing who the event targets
- `resources` array — 4 cards describing what Infrared provides

### SDK quick-start code
**`src/components/landing/QuickStartSection.tsx`**
- `codeSnippet` constant — the Python snippet. Verified correct against SDK README.
- The `pip install infrared-sdk` line is hardcoded in the JSX below it.

### FAQ
**`src/components/landing/FaqSection.tsx`**
- `faqs` array — `q` (question) and `a` (answer). Add/remove freely.

### Final CTA (bottom of page)
**`src/components/landing/FinalCtaSection.tsx`**
- Headline, subtitle paragraph, two CTA links, small print below buttons

### Countdown
**`src/components/landing/CountdownSection.tsx`**
- Do not edit. It reads `HACKATHON_START` from `config.ts` automatically.
- Before `HACKATHON_START`: countdown is shown on landing page + registration is locked.
- After `HACKATHON_START`: both disappear automatically.

## Media images

All images come from `https://pub-196eb52bea2944ac94bf7d6015f31748.r2.dev/media/image/<id>/optimised.jpg`
Browse the catalogue at `media.infrared.city`. Always use `url_optimised` (not `url_original`).

To replace the hero image: swap the `SF_THERMAL` URL in `HeroSection.tsx`.
To replace a track image: swap the `img` URL in that track's entry in `TracksSection.tsx`.

## SDK playground iframe

The interactive demo in the "8 analyses" section is an embedded iframe from `sdk-playground-14t.pages.dev`.
Managed separately — no changes needed here for content updates.

## Registration form

**`src/pages/GetKeyPage.tsx`** — do not edit for routine content updates.
Form fields, validation, and key assignment logic all live here.
The skills list comes from `src/types/index.ts` → `SKILLS` array (add/remove skills there).

## Participant canvas + projects gallery

**`src/pages/ParticipantsPage.tsx`** and **`src/pages/ProjectsPage.tsx`** — do not edit.
Data comes live from NocoDB.

## Environment variables (CF Pages dashboard)

Set under `hackathon` project → Settings → Environment variables:
| Variable | Purpose |
|---|---|
| `VITE_WINDMILL_TRIGGER_TOKEN` | Scoped token for registration + submission Windmill flows |
| `VITE_NOCODB_READ_TOKEN` | Read-only NocoDB token for participants + projects gallery |
| `VITE_NOCO_PARTICIPANTS_TABLE` | NocoDB table ID for hackathon_participants |
| `VITE_NOCO_SUBMISSIONS_TABLE` | NocoDB table ID for hackathon_submissions |

## GitHub Actions secrets (repo Settings → Secrets)

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | `76766acc855cf7634a25fa485a4f5e52` |

## Backend (Windmill)

**Scripts live in the central `ir-team-windmill` repo**, NOT here.
- Path: `~/01_Projects/00_infrared/ir-team-windmill/f/hackathon/`
- Edits there → push to main → ir-team-windmill GitHub Actions auto-deploys to `windmill.team.infrared.city` via scoped deploy token.
- Three scripts: `request_key`, `submit_project`, `register_participant`.
- Never push Windmill scripts directly with `wmill script push` — always go via the ir-team-windmill repo.

## Wiring checklist

Order of operations:

1. **NocoDB tables** — create three tables at `nocodb.team.infrared.city`:
   - `hackathon_keys` — columns: `name`, `key_id`, `raw_key`, `status` (default `available`), `assigned_to_team`, `assigned_email`, `assigned_at`
   - `hackathon_participants` — `team_name`, `email`, `nickname`, `skills`, `project_idea`, `looking_for_team`, `key_name`, `registered_at`
   - `hackathon_submissions` — `api_key`, `team_name`, `project_title`, `description`, `tracks`, `github_url`, `demo_url`, `submitted_at`
2. **Import keys** — `source ~/.run8n.env && python3 scripts/import_keys.py <hackathon_keys_table_id>`
3. **Windmill variables** (Windmill UI → Variables, all under folder `f/hackathon/`):
   - `noco_keys_table_id` — copy table ID from NocoDB URL
   - `noco_participants_table_id`
   - `noco_submissions_table_id`
   - `hubspot_token` (secret) — HubSpot Private App, scope: `crm.objects.contacts.write`
   - `resend_api_key` (secret) — from resend.com after verifying `infrared.city`
4. **Windmill deploy** — push the scripts in `ir-team-windmill/f/hackathon/` to `main`. GitHub Actions on that repo deploys them via `WINDMILL_DEPLOY_TOKEN` (scoped, not admin).
5. **Scoped trigger token** — Windmill UI → Account Settings → Tokens → create a token with scopes `jobs:run:scripts:f/hackathon/request_key`, `...submit_project`, `...register_participant`. Add as `VITE_WINDMILL_TRIGGER_TOKEN` on CF Pages. **Never put `WINDMILL_IR_TOKEN` (admin) in CF Pages env or in the bundle.**
6. **Custom domain** — CF Pages → `hackathon` project → Custom domains → `hackathon.infrared.city`

## Key deactivation

All 50 `svc_ir_hackathon26_*` keys must be deactivated on **2026-06-03**.
Keys are in `~/ir-hackathon26-keys.csv`. Batch disable recipe in memory: `hackathon26-key-deactivation.md`.
