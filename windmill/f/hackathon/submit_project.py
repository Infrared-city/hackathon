# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "requests>=2.31",
# ]
# ///

import wmill
import requests
from datetime import datetime, timezone


def main(
    api_key: str,
    team_name: str,
    project_title: str,
    description: str,
    tracks: list[str],
    github_url: str = "",
    demo_url: str = "",
) -> dict:
    noco = wmill.get_resource("f/shared/nocodb")
    base = noco["baseUrl"]
    token = noco["apiToken"]
    headers = {"xc-token": token, "Content-Type": "application/json"}

    keys_table = wmill.get_variable("f/hackathon/noco_keys_table_id")
    subs_table = wmill.get_variable("f/hackathon/noco_submissions_table_id")

    # Validate api_key belongs to a claimed slot
    resp = requests.get(
        f"{base}/api/v2/tables/{keys_table}/records",
        params={"where": f"(raw_key,eq,{api_key})(status,eq,claimed)", "limit": 1},
        headers=headers,
    )
    resp.raise_for_status()
    rows = resp.json().get("list", [])
    if not rows:
        raise ValueError("API key not recognised or not yet registered.")

    now = datetime.now(timezone.utc).isoformat()

    result = requests.post(
        f"{base}/api/v2/tables/{subs_table}/records",
        json={
            "api_key": api_key,
            "team_name": team_name,
            "project_title": project_title,
            "description": description,
            "tracks": ", ".join(tracks),
            "github_url": github_url,
            "demo_url": demo_url,
            "submitted_at": now,
        },
        headers=headers,
    )
    result.raise_for_status()
    row = result.json()

    return {"submission_id": row.get("Id"), "status": "submitted"}
