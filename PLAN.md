# Infrared SDK Hackathon — Platform Brief & Scope

## What We're Building

A lightweight hackathon platform hosted at `hackathon.infrared.city` (CF Pages + Windmill + NocoDB + R2).
Built on existing Infrared infra — zero new external dependencies.

## The Hackathon

**Concept:** Build something real with the Infrared SDK. Win a €5K annual API subscription + shared token pool.
**Scale:** ~100 participants, teams of ~4, one event.
**Audience:** Developers, urban planners, architects, climate researchers.

## Prize

- 1× €5,000 annual Infrared API subscription
- Shared token pool for the winning team
- Public recognition + infrared.city feature

## Pages

### `/` — Landing
- Hero: headline, prize, CTA to register + get API key
- What you can build (reuse 8-analysis card grid from SDK page)
- Timeline (registration open → hackathon starts → submission deadline → winners)
- Challenge tracks (mobility, urban heat, climate adaptation, open)
- How it works (3 steps: get key → build → submit)
- SDK quick-start code snippet
- FAQ

### `/participants` — Team Canvas (Model C)
- Cards: nickname + skill tags + "looking for team" badge
- Toggle: Canvas view / List view
- Filter by skill
- Self-registration: add yourself to the canvas (nickname + skills + looking flag)
- No auth — trust-based, just a nickname
- Reads/writes NocoDB `participants` table via Windmill webhook

### `/get-key` — API Key Request
- Simple form: team name + email
- POST to Windmill webhook → round-robin assign from pre-generated pool
- Key returned inline on page + emailed
- No checks, no auth — anyone can get a key
- Recycles through 100 pre-generated service account keys

### `/submit` — Project Submission
- Project name + one-liner
- Team name + teammate nicknames (free text)
- GitHub URL (required)
- Demo URL (optional)
- Video URL — YouTube / Loom (optional)
- Up to 3 screenshots → presigned R2 upload
- Which Infrared APIs used (checkboxes: Wind, Solar, UTCI, Daylight, SVF, PWC, Thermal Stats, Custom)
- POST to Windmill → NocoDB row + confirmation email

### `/projects` — Public Gallery
- All submissions visible immediately after submit
- Cards: project name, team, APIs used, GitHub + demo links, screenshot
- Filter by API used / challenge track
- Reads NocoDB `submissions` public view

## Team Formation (Model C)

No hard team locking. Teams form organically:
1. Register on `/participants` canvas with skills + "looking for team" flag
2. Find each other via canvas or Discord/Slack
3. Formalize team name only at `/get-key` and `/submit`

## Data (NocoDB — nocodb.team.infrared.city)

### `hackathon_participants`
| field | type |
|---|---|
| nickname | text (unique-ish) |
| skills | multi-select |
| looking_for_team | bool |
| registered_at | datetime |

### `hackathon_keys`
| field | type |
|---|---|
| key_name | text (hackathon-team-001…100) |
| api_key | text |
| last_team | text |
| last_email | text |
| last_assigned_at | datetime |
| use_count | number |

### `hackathon_config`
| field | type |
|---|---|
| key | text |
| value | text |
(row: current_index = 0)

### `hackathon_submissions`
| field | type |
|---|---|
| project_name | text |
| one_liner | text |
| team_name | text |
| members | text |
| github_url | url |
| demo_url | url |
| video_url | url |
| screenshots | text (R2 keys, comma-sep) |
| apis_used | multi-select |
| challenge_track | single-select |
| submitted_at | datetime |
| score | number (judges fill) |

## Windmill Flows (windmill.team.infrared.city — ir-main)

### `f/hackathon/request_key`
Webhook trigger → assign next key (round-robin) → email → return key in response

### `f/hackathon/submit_project`
Webhook trigger → validate → write NocoDB → send confirmation email

### `f/hackathon/register_participant`
Webhook trigger → write NocoDB participants table → return success

## Infrastructure

| Layer | Service | Notes |
|---|---|---|
| Frontend | Cloudflare Pages | Vite + React + TypeScript |
| Data | NocoDB | nocodb.team.infrared.city |
| Flows | Windmill | windmill.team.infrared.city / ir-main |
| Files | R2 | infrared-team bucket |
| Email | Windmill → SMTP | confirmation + key delivery |
| Domain | hackathon.infrared.city | CF Pages custom domain |

## Visual Language

- Dark theme (#0d0e14 bg, #00e5c3 teal accent) — matches Infrared SDK page
- Code blocks prominent — this is a developer audience
- Stats bars, card grids — reuse SDK page patterns
- No colored card borders (brand rule)
- Infrared logo top-left, minimal nav

## Repo

`Infrared-city/hackathon` → deploys to CF Pages
`ir-team-windmill` → Windmill flows in `f/hackathon/`
