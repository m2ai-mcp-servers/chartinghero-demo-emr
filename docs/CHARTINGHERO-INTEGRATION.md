# ChartingHero MCP to demo dashboard: integration guide

How the ChartingHero MCP server gets visit data into this dashboard. It describes what the MCP does today (0.1.x), not an aspirational API.

## Data path

```
Nurse + Claude Desktop
        │  create_visit_note (one tool call per visit)
        ▼
ChartingHero MCP (mock backend)
        │  one upsert per created note: POST /rest/v1/visits, onConflict=id
        ▼
Supabase (patients, visits tables)
        │  dashboard polls every 2 seconds
        ▼
ChartingHero demo dashboard (this repo)
```

There is no field-by-field PATCH flow and no `update_visit_vitals` tool. A visit is written once, as a whole, when `create_visit_note` succeeds. The MCP's `updateVisitInSupabase` helper exists but no tool calls it.

## Configuration

| Side | Variables |
|---|---|
| MCP server | `SUPABASE_URL`, `SUPABASE_ANON_KEY` (sync runs when both are set) |
| Dashboard | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`) |

Synthetic data only. The anon key ships in the browser bundle and `supabase/schema.sql` leaves RLS commented out, so anything written here is publicly readable. Real patient data must never reach this table.

## Row written per visit

Produced by `transformVisitToSupabase` in `chartinghero/src/services/supabase-service.ts`:

```json
{
  "id": "VN-30003",
  "patient_id": "PT-10001",
  "visit_type": "skilled_nursing",
  "visit_date": "2026-01-03",
  "time_in": "09:15",
  "time_out": "10:05",
  "nurse_name": "<from the MCP>",
  "vital_signs": {
    "bloodPressureSystolic": 138, "bloodPressureDiastolic": 82,
    "heartRate": 76, "oxygenSaturation": 97,
    "temperature": 98.4, "temperatureUnit": "F",
    "respiratoryRate": 16, "painLevel": 2,
    "weight": 156, "weightUnit": "lbs",
    "bloodGlucose": null, "glucoseUnit": "mg/dL", "glucoseTiming": null
  },
  "subjective": "...", "objective": "...", "assessment": "...", "plan": "...",
  "interventions": [{ "code": "INT-001", "description": "...", "completed": true }],
  "education": [{ "code": "EDU-001", "description": "...", "completed": true }],
  "next_visit_date": "2026-01-05",
  "status": "..."
}
```

Notes:
- Interventions and education arrive as strings in the MCP and are mapped to `{code, description, completed: true}`.
- The MCP has no glucose field yet, so `bloodGlucose` is always `null`.

## Known gaps (tracked in the FHIR pivot plan, chartinghero `docs/FHIR-PIVOT-PLAN.md`)

- **Visit id collisions.** The MCP mock counter starts at `VN-30000`, and `seed.sql` seeds `VN-30000` to `VN-30002`. Because the upsert is on `id`, the first three MCP writes after a restart overwrite seeded rows. Fixed in PR2 (UUID ids).
- **Patient identity split.** The MCP's mock `PT-10001` is a different fictional patient from this repo's seeded `PT-10001`. Fixed by one shared patient set (PR8).
- **No RLS.** Turning RLS on with no anon write is a precondition for dashboard sync in 0.2.0.

## Seeded data

| ID | Name | Primary diagnosis |
|----|------|-------------------|
| PT-10001 | Jane Marple | Type 2 Diabetes, Hypertension, CHF |
| PT-10002 | Hercule Poirot | Heart Failure, AFib, CKD Stage 3 |
| PT-10003 | Ariadne Oliver | Parkinson's Disease |

| Visit | Patient | Status |
|----|------|--------|
| VN-30000 | Jane Marple | Completed |
| VN-30001 | Jane Marple | Completed |
| VN-30002 | Hercule Poirot | Pending |

## Demo tips

1. Open the visit or dashboard page first, then create the note from Claude.
2. The dashboard polls every 2 seconds; changed fields flash yellow for 1.5 seconds.
3. The "Live, updated Xs ago" indicator shows connection status.

## Dashboard

Public demo: https://chartinghero-demo.netlify.app (planned rename of the previous Netlify site, which will redirect here).
