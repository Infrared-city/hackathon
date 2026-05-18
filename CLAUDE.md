# Hackathon Platform — CLAUDE.md

Infrared SDK Buildathon website (May 27–31 2026).
React + TypeScript + Vite, deployed to Cloudflare Pages.

- **Live:** https://hackathon-73i.pages.dev (stable; `hackathon.infrared.city` after CNAME)
- **Repo:** `Infrared-city/hackathon` (public)
- **Backend:** Windmill scripts live in `Infrared-city/ir-team-windmill/f/hackathon/`

**For routine content edits, see [`CONTRIBUTING.md`](CONTRIBUTING.md).** This file covers architecture, ops, and how to flip operational gates.

---

## Deploy

Push to `main` → GitHub Actions builds + deploys (≈ 1 min):
- `deploy.yml` builds Vite with secrets/vars and uploads to CF Pages
- Frontend bundle inlines `VITE_*` at build time — those vars must be GitHub Actions secrets/variables (CF Pages dashboard env vars don't reach the build)

Manual rebuild: `gh workflow run deploy.yml -R Infrared-city/hackathon`

## Architecture

```
┌────────────┐      scoped token      ┌───────────────────┐
│  Frontend  │ ─────────────────────> │  Windmill scripts │
│  CF Pages  │                        │  f/hackathon/*    │
└────────────┘                        └────────┬──────────┘
      │ read-only NocoDB token                 │ writes
      ▼                                        ▼
┌──────────────────────────────────────────────────────────┐
│             NocoDB "Hackathon 2026" base                 │
│  hackathon_keys · hackathon_participants ·               │
│  hackathon_submissions · hackathon_waitlist              │
└──────────────────────────────────────────────────────────┘
```

Frontend reads from NocoDB directly (read-only token) for the participants + projects galleries. All writes go through Windmill scripts via a scoped trigger token.

## 📅 Team ops reminders calendar

**Subscribe once → phone reminders for every flag flip:**

Download → https://hackathon.infrared.city/team-reminders.ics

Import into Google Calendar / Apple Calendar / Outlook. Five timed reminders with 30-min pre-alerts:

| When (CET)        | Action |
|---|---|
| **May 27 08:00**  | Flip `registration_status` → `open` |
| **May 31 08:00**  | Flip `submission_status` → `open`   |
| **May 31 24:00**  | Flip `submission_status` → `closed` |
| **June 2 15:00**  | Announce winners + flip `registration_status` → `closed` |
| **June 3 08:00**  | Verify deactivation cron ran + revoke keys in Infrared backend |

Send the same link to Sezin & anyone else who might need to do these flips while you're traveling.

## Operational gates (the flags you flip on launch day)

Two Windmill variables control everything:

| Variable | Values | Effect |
|---|---|---|
| `f/hackathon/registration_status` | `locked` · `open` · `closed` | `/get-key` form, `request_key` script |
| `f/hackathon/submission_status`   | `locked` · `open` · `closed` | `/submit` form, `submit_project` script |

Flip at https://windmill.team.infrared.city → Variables → search "hackathon".

- `locked` = pre-launch: countdown + waitlist signup; backend refuses.
- `open` = active: form shown; backend accepts.
- `closed` = post-event: explainer page (no form); backend refuses.

Frontend reads via `f/hackathon/status` script (60s cache). Backend enforces independently — UI bypass cannot defeat the server-side check.

## Windmill scripts (in `ir-team-windmill/f/hackathon/`)

| Script | Purpose | Gate |
|---|---|---|
| `request_key`         | Claim a key from pool + create participant + push HubSpot + email | `registration_status` |
| `notify_me`           | Pre-launch waitlist signup (NocoDB + HubSpot fail-soft)            | — |
| `submit_project`      | Record a submission                                                 | `submission_status` |
| `register_participant`| Update participant canvas profile                                   | — |
| `status`              | Public flag read (consumed by frontend hook)                        | — |
| `deactivate_keys`     | Mark all keys `deactivated` (scheduled for 2026-06-03 00:00 UTC)   | — |

Edit those files in the **`ir-team-windmill` repo**, push to `main`, GitHub Actions deploys via the scoped `WINDMILL_DEPLOY_TOKEN`. **Never `wmill script push` directly.**

## Resource IDs (already populated — for reference)

NocoDB base: `p9fbh7wb0d94d9l` — "Hackathon 2026"

| Table | ID |
|---|---|
| `hackathon_keys`         | `mdjzu2a5jj7unlc` |
| `hackathon_participants` | `mkidyny6ikwj7u3` |
| `hackathon_submissions`  | `mxko6wyyfanpk2e` |
| `hackathon_waitlist`     | `mrw0yjngib2o7pi` |

Windmill variables (under `f/hackathon/`): `noco_keys_table_id`, `noco_participants_table_id`, `noco_submissions_table_id`, `noco_waitlist_table_id`, `registration_status`, `submission_status`, `hubspot_token` (secret, currently invalid), `resend_api_key` (secret, currently empty).

## Secrets (already set)

**GitHub Actions** (`Infrared-city/hackathon` → Settings → Secrets/Variables):

| Name | Type | Purpose |
|---|---|---|
| `CLOUDFLARE_API_TOKEN`        | secret | CF Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID`       | secret | `76766acc855cf7634a25fa485a4f5e52` |
| `VITE_WINDMILL_TRIGGER_TOKEN` | secret | Scoped to 5 hackathon scripts only |
| `VITE_NOCODB_READ_TOKEN`      | secret | NocoDB read for galleries |
| `VITE_NOCO_PARTICIPANTS_TABLE`| var    | `mkidyny6ikwj7u3` |
| `VITE_NOCO_SUBMISSIONS_TABLE` | var    | `mxko6wyyfanpk2e` |

**Never put `WINDMILL_IR_TOKEN` (admin) in GitHub secrets, CF Pages, or the bundle.** Only scoped trigger tokens.

## HubSpot (currently broken — fix when ready)

The variable `f/hackathon/hubspot_token` holds an expired OAuth token. Every `request_key` and `notify_me` call attempts HubSpot push and **fails silently** (try/except). NocoDB write still succeeds.

**To fix:**
1. HubSpot → Settings → Integrations → **Private Apps** → "Create a private app"
2. Scopes: `crm.objects.contacts.read` + `crm.objects.contacts.write`
3. Create → Show token → copy (starts with `pat-…`)
4. Update Windmill variable: https://windmill.team.infrared.city → Variables → `f/hackathon/hubspot_token` → set new value
5. Backfill rows where `hubspot_pushed=false`: run one-shot script (TODO: not built yet, ~20 LOC)

## Resend (not yet wired)

Welcome email + launch-day blast use Resend. Sign up, verify `infrared.city` domain, set the API key in Windmill var `f/hackathon/resend_api_key`. Until then `request_key` skips the email step silently — users still get their key on screen.

## Key deactivation (already scheduled)

Cron `f/hackathon/deactivate_keys_schedule` runs `deactivate_keys` on **2026-06-03 00:00 UTC**. Marks every row in `hackathon_keys` as `status=deactivated`. **NocoDB ledger only** — Infrared backend revocation still requires a separate manual disable. CSV of keys at `~/ir-hackathon26-keys.csv`.

## Outstanding manual TODOs

| What | Why | Path |
|---|---|---|
| Add CNAME `hackathon` → `hackathon-73i.pages.dev` in CF dashboard | Custom domain | CF Pages domain bind already done; just needs the DNS record (zone DNS scope missing from our API tokens) |
| Refresh HubSpot token | Marketing automation | See HubSpot section above |
| Resend signup + domain verify | Email delivery | See Resend section above |
| Flip flags to `open` on May 27 17:00 CET | Launch | Windmill UI → variables |
| Flip `submission_status` to `open` on launch / `closed` after deadline | Submission window | Windmill UI |
| Magic-link email verification on registration | Anti-spam | Needs Resend; defer until token is live |
