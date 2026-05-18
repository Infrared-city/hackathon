#!/usr/bin/env python3
"""
Import hackathon API keys from CSV into NocoDB hackathon_keys table.

Usage:
  source ~/.run8n.env
  python3 scripts/import_keys.py <table_id> [--csv /path/to/keys.csv]

The table must have columns: name, key_id, raw_key, status (default 'available'),
  assigned_to_team, assigned_email, assigned_at

Find table_id in NocoDB → table → "..." → Copy API URL.
"""

import csv
import json
import os
import sys
import urllib.request

NOCODB_BASE = 'https://nocodb.team.infrared.city/api/v2'
DEFAULT_CSV  = os.path.expanduser('~/ir-hackathon26-keys.csv')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    table_id = sys.argv[1]
    csv_path = DEFAULT_CSV
    for i, arg in enumerate(sys.argv):
        if arg == '--csv' and i + 1 < len(sys.argv):
            csv_path = sys.argv[i + 1]

    token = os.environ.get('NOCODB_IR_TOKEN')
    if not token:
        print('ERROR: NOCODB_IR_TOKEN not set. Run: source ~/.run8n.env')
        sys.exit(1)

    with open(csv_path, newline='') as f:
        rows = list(csv.DictReader(f))

    print(f'Importing {len(rows)} keys into table {table_id}…')

    records = [
        {
            'name':             row['name'],
            'key_id':           row['key_id'],
            'raw_key':          row['raw_key'],
            'status':           'available',
            'assigned_to_team': None,
            'assigned_email':   None,
            'assigned_at':      None,
        }
        for row in rows
    ]

    payload = json.dumps({'list': records}).encode()
    url     = f'{NOCODB_BASE}/tables/{table_id}/records'
    req     = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json', 'xc-token': token},
        method='POST',
    )
    with urllib.request.urlopen(req) as resp:
        body = json.loads(resp.read())

    inserted = len(body) if isinstance(body, list) else body.get('inserted', '?')
    print(f'Done — {inserted} records inserted.')


if __name__ == '__main__':
    main()
