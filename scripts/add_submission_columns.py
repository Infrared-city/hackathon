#!/usr/bin/env python3
"""Add the new submission columns to the NocoDB hackathon_submissions table.

Idempotent — skips columns that already exist. Run ONCE before deploying the
extended submit_project.py (NocoDB drops unknown fields silently, so the
columns must exist first or the new data is lost without error).

Usage:
    export NOCO_IR_URL="https://nocodb.team.infrared.city"
    export NOCO_IR_TOKEN="<ir-nocodb-token>"   # from Windmill f/shared/nocodb_api_token
    python3 scripts/add_submission_columns.py

The token is the Infrared NocoDB instance token (NOT the personal run8n one,
NOT the frontend read-only token).
"""
import os
import sys
import requests

TABLE_ID = "mxko6wyyfanpk2e"  # hackathon_submissions

# (title, NocoDB UI data type)
NEW_COLUMNS = [
    ("problem", "LongText"),
    ("solution", "LongText"),
    ("tech_impl", "LongText"),
    ("target_group", "SingleLineText"),
    ("tags", "SingleLineText"),
    ("sdk_feedback", "LongText"),
    ("prize_email", "SingleLineText"),
    ("documents", "LongText"),
]


def main() -> int:
    base = os.environ.get("NOCO_IR_URL", "https://nocodb.team.infrared.city").rstrip("/")
    token = os.environ.get("NOCO_IR_TOKEN")
    if not token:
        print("ERROR: set NOCO_IR_TOKEN (Infrared NocoDB token).", file=sys.stderr)
        return 1

    headers = {"xc-token": token, "Content-Type": "application/json"}

    meta = requests.get(f"{base}/api/v2/meta/tables/{TABLE_ID}", headers=headers)
    meta.raise_for_status()
    existing = {c["title"] for c in meta.json().get("columns", [])}
    print(f"Existing columns: {sorted(existing)}\n")

    for title, uidt in NEW_COLUMNS:
        if title in existing:
            print(f"  = {title} already exists — skip")
            continue
        r = requests.post(
            f"{base}/api/v2/meta/tables/{TABLE_ID}/columns",
            json={"title": title, "uidt": uidt},
            headers=headers,
        )
        if r.ok:
            print(f"  + {title} ({uidt}) added")
        else:
            print(f"  ! {title} FAILED {r.status_code}: {r.text[:200]}", file=sys.stderr)
            return 1

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
