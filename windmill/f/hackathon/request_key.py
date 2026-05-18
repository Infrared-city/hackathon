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
    team_name: str,
    email: str,
    nickname: str,
    skills: list[str],
    project_idea: str = "",
    looking_for_team: bool = True,
) -> dict:
    noco = wmill.get_resource("f/shared/nocodb")
    base = noco["baseUrl"]
    token = noco["apiToken"]
    headers = {"xc-token": token, "Content-Type": "application/json"}

    keys_table = wmill.get_variable("f/hackathon/noco_keys_table_id")
    parts_table = wmill.get_variable("f/hackathon/noco_participants_table_id")

    # Claim the first available key
    resp = requests.get(
        f"{base}/api/v2/tables/{keys_table}/records",
        params={"where": "(status,eq,available)", "limit": 1},
        headers=headers,
    )
    resp.raise_for_status()
    rows = resp.json().get("list", [])
    if not rows:
        raise ValueError("No API keys available — the pool is exhausted.")

    key_row = rows[0]
    row_id = key_row["Id"]
    api_key = key_row["raw_key"]
    key_name = key_row["name"]

    now = datetime.now(timezone.utc).isoformat()

    # Atomically mark key as claimed
    patch = requests.patch(
        f"{base}/api/v2/tables/{keys_table}/records",
        json=[{
            "Id": row_id,
            "status": "claimed",
            "assigned_to_team": team_name,
            "assigned_email": email,
            "assigned_at": now,
        }],
        headers=headers,
    )
    patch.raise_for_status()

    # Create participant record
    participant = requests.post(
        f"{base}/api/v2/tables/{parts_table}/records",
        json={
            "team_name": team_name,
            "email": email,
            "nickname": nickname,
            "skills": ", ".join(skills),
            "project_idea": project_idea,
            "looking_for_team": looking_for_team,
            "key_name": key_name,
            "registered_at": now,
        },
        headers=headers,
    )
    participant.raise_for_status()

    # HubSpot contact (non-fatal if it fails)
    try:
        hs_token = wmill.get_variable("f/hackathon/hubspot_token")
        requests.post(
            "https://api.hubapi.com/crm/v3/objects/contacts",
            json={"properties": {
                "email": email,
                "firstname": nickname,
                "company": team_name,
                "ir_hackathon_26": "registered",
            }},
            headers={"Authorization": f"Bearer {hs_token}", "Content-Type": "application/json"},
            timeout=8,
        )
    except Exception:
        pass  # HubSpot failure must not block key delivery

    # Welcome email via Resend (non-fatal)
    try:
        resend_key = wmill.get_variable("f/hackathon/resend_api_key")
        requests.post(
            "https://api.resend.com/emails",
            json={
                "from": "Infrared Hackathon <hackathon@infrared.city>",
                "to": [email],
                "subject": "Your Infrared SDK Hackathon API key",
                "html": _welcome_email(nickname, team_name, api_key, key_name),
            },
            headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
            timeout=8,
        )
    except Exception:
        pass  # Email failure must not block key delivery

    return {"api_key": api_key, "key_name": key_name}


def _welcome_email(nickname: str, team_name: str, api_key: str, key_name: str) -> str:
    return f"""
<p>Hey {nickname},</p>
<p>Welcome to the Infrared SDK Buildathon! Team <strong>{team_name}</strong> is now registered.</p>
<p>Your API key (<code>{key_name}</code>):</p>
<pre style="background:#0d1f23;color:#23e5e5;padding:14px;border-radius:6px;font-size:13px">{api_key}</pre>
<p>Get started:</p>
<pre style="background:#0d1f23;color:#e8f4f4;padding:14px;border-radius:6px;font-size:13px">pip install infrared-sdk
export INFRARED_API_KEY={api_key}</pre>
<p>Docs: <a href="https://infrared.city/docs/sdk/">infrared.city/docs/sdk</a><br>
Kickoff: Wednesday May 27, 17:00 CET · Online</p>
<p>— The Infrared team</p>
"""
