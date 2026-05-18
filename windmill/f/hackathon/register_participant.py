# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "requests>=2.31",
# ]
# ///

import wmill
import requests


def main(
    nickname: str,
    skills: list[str],
    looking_for_team: bool = True,
    project_idea: str = "",
) -> dict:
    """Update participant canvas profile (called after initial registration)."""
    noco = wmill.get_resource("f/shared/nocodb")
    base = noco["baseUrl"]
    token = noco["apiToken"]
    headers = {"xc-token": token, "Content-Type": "application/json"}

    parts_table = wmill.get_variable("f/hackathon/noco_participants_table_id")

    # Find participant by nickname
    resp = requests.get(
        f"{base}/api/v2/tables/{parts_table}/records",
        params={"where": f"(nickname,eq,{nickname})", "limit": 1},
        headers=headers,
    )
    resp.raise_for_status()
    rows = resp.json().get("list", [])
    if not rows:
        raise ValueError(f"Participant '{nickname}' not found.")

    row_id = rows[0]["Id"]

    patch = requests.patch(
        f"{base}/api/v2/tables/{parts_table}/records",
        json=[{
            "Id": row_id,
            "skills": ", ".join(skills),
            "looking_for_team": looking_for_team,
            "project_idea": project_idea,
        }],
        headers=headers,
    )
    patch.raise_for_status()

    return {"status": "updated", "participant_id": row_id}
