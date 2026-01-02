# Ratchet MCP → PointCare EMR Integration Guide

This document describes how Ratchet MCP should write data to Supabase so the PointCare EMR dashboard displays updates in real-time.

## Architecture Overview

```
┌─────────────────────┐
│   Nurse + Claude    │
│   Desktop + Ratchet │
│                     │
│  "BP is 138/82,     │
│   heart rate 76"    │
└──────────┬──────────┘
           │
           │ Ratchet parses natural language
           │ and calls Supabase REST API
           ▼
┌─────────────────────┐
│      Supabase       │
│  PostgreSQL + API   │
│                     │
│  patients table     │
│  visits table       │
└──────────┬──────────┘
           │
           │ Dashboard polls every 2 seconds
           ▼
┌─────────────────────┐
│  PointCare EMR UI   │
│  (Netlify hosted)   │
│                     │
│  Fields highlight   │
│  yellow on change   │
└─────────────────────┘
```

## Supabase Connection Details

```
Project URL:  https://ffbpqxwkdywbwxbcntaa.supabase.co
REST API:     https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1
Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYnBxeHdrZHl3Ynd4YmNudGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODc0NjQsImV4cCI6MjA4Mjk2MzQ2NH0.oA5qoIqjlk9NaTrhOMqqFhVF-_dBwx3ztutaYWNC1f4
```

## Required Headers

All requests must include these headers:

```http
apikey: <ANON_KEY>
Authorization: Bearer <ANON_KEY>
Content-Type: application/json
Prefer: return=representation
```

---

## API Endpoints

### Visits Table

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all visits | GET | `/rest/v1/visits` |
| Get visit by ID | GET | `/rest/v1/visits?id=eq.VN-30001` |
| Get patient's visits | GET | `/rest/v1/visits?patient_id=eq.PT-10001` |
| Update visit | PATCH | `/rest/v1/visits?id=eq.VN-30001` |
| Create visit | POST | `/rest/v1/visits` |

### Patients Table

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all patients | GET | `/rest/v1/patients` |
| Get patient by ID | GET | `/rest/v1/patients?id=eq.PT-10001` |
| Update patient | PATCH | `/rest/v1/patients?id=eq.PT-10001` |

---

## Visit Data Schema

```json
{
  "id": "VN-30001",
  "patient_id": "PT-10001",
  "visit_type": "skilled_nursing",
  "visit_date": "2026-01-02",
  "time_in": "09:15",
  "time_out": "10:05",
  "nurse_name": "Sarah Johnson, RN",
  "vital_signs": {
    "bloodPressureSystolic": 138,
    "bloodPressureDiastolic": 82,
    "heartRate": 76,
    "oxygenSaturation": 97,
    "temperature": 98.4,
    "temperatureUnit": "F",
    "respiratoryRate": 16,
    "painLevel": 2,
    "weight": 156,
    "weightUnit": "lbs",
    "bloodGlucose": 142,
    "glucoseUnit": "mg/dL",
    "glucoseTiming": "fasting"
  },
  "subjective": "Patient reports...",
  "objective": "Alert and oriented x4...",
  "assessment": "Progressive diabetic...",
  "plan": "1) Notify Dr...\n2) Continue...",
  "interventions": [
    {"code": "INT-001", "description": "Comprehensive foot examination", "completed": true},
    {"code": "INT-002", "description": "Monofilament sensory testing", "completed": true}
  ],
  "education": [
    {"code": "EDU-001", "description": "Daily foot inspection technique", "completed": true},
    {"code": "EDU-002", "description": "Proper diabetic footwear", "completed": false}
  ],
  "next_visit_date": "2026-01-05",
  "status": "completed"
}
```

---

## Common Ratchet Operations

### 1. Update Vital Signs

When nurse says: *"BP is 138 over 82, heart rate 76, O2 sat 97 percent"*

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "vital_signs": {
      "bloodPressureSystolic": 138,
      "bloodPressureDiastolic": 82,
      "heartRate": 76,
      "oxygenSaturation": 97,
      "temperature": 98.4,
      "temperatureUnit": "F",
      "respiratoryRate": 16,
      "painLevel": 2,
      "weight": 156,
      "weightUnit": "lbs",
      "bloodGlucose": 142,
      "glucoseUnit": "mg/dL",
      "glucoseTiming": "fasting"
    }
  }'
```

### 2. Update Subjective Note

When nurse says: *"Patient reports feeling better today, slept well last night, no new complaints"*

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "subjective": "Patient reports feeling better today. Slept well last night with no interruptions. Denies new complaints. States medication regimen is manageable. Appetite good, eating regular meals."
  }'
```

### 3. Update Objective Findings

When nurse says: *"Patient is alert and oriented, lungs clear, no edema noted"*

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "objective": "Alert and oriented x4. Lungs clear to auscultation bilaterally. No peripheral edema noted. Skin warm and dry. Surgical site clean, dry, intact with no signs of infection."
  }'
```

### 4. Update Assessment

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "assessment": "Patient stable with well-controlled diabetes. Blood pressure within target range. Progressive improvement in mobility post-surgery. No signs of complications."
  }'
```

### 5. Update Plan

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "plan": "1) Continue current medication regimen\n2) Reinforce daily foot inspections\n3) Encourage ambulation with walker TID\n4) Follow up in 3 days\n5) Call physician if symptoms worsen"
  }'
```

### 6. Update Interventions Checklist

When nurse says: *"I completed the foot exam and glucose check"*

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "interventions": [
      {"code": "INT-001", "description": "Comprehensive foot examination", "completed": true},
      {"code": "INT-002", "description": "Monofilament sensory testing", "completed": true},
      {"code": "INT-003", "description": "Blood glucose monitoring", "completed": true},
      {"code": "INT-004", "description": "Medication reconciliation", "completed": true},
      {"code": "INT-005", "description": "Fall risk assessment", "completed": false}
    ]
  }'
```

### 7. Update Education Checklist

When nurse says: *"I taught the patient about foot care and glucose monitoring"*

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "education": [
      {"code": "EDU-001", "description": "Daily foot inspection technique", "completed": true},
      {"code": "EDU-002", "description": "Proper diabetic footwear", "completed": true},
      {"code": "EDU-003", "description": "Blood glucose target ranges", "completed": true},
      {"code": "EDU-004", "description": "Signs requiring immediate attention", "completed": false}
    ]
  }'
```

### 8. Update Time In/Out

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "time_in": "09:15",
    "time_out": "10:05"
  }'
```

### 9. Set Next Visit Date

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "next_visit_date": "2026-01-05"
  }'
```

### 10. Complete Full SOAP Note at Once

```bash
curl -X PATCH "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "subjective": "Patient reports...",
    "objective": "Alert and oriented...",
    "assessment": "Stable with...",
    "plan": "1) Continue...\n2) Follow up..."
  }'
```

---

## Creating a New Visit

When starting a new patient encounter:

```bash
curl -X POST "https://ffbpqxwkdywbwxbcntaa.supabase.co/rest/v1/visits" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "id": "VN-30003",
    "patient_id": "PT-10001",
    "visit_type": "skilled_nursing",
    "visit_date": "2026-01-03",
    "nurse_name": "Sarah Johnson, RN",
    "status": "in_progress",
    "vital_signs": {},
    "interventions": [],
    "education": []
  }'
```

---

## Available Patient IDs

| ID | Name | Primary Diagnosis |
|----|------|-------------------|
| PT-10001 | Eleanor Thompson | Type 2 Diabetes Mellitus |
| PT-10002 | James Mitchell | Heart Failure (HFrEF) |
| PT-10003 | Margaret Chen | Post-Hip Replacement |

---

## Available Visit IDs

| ID | Patient | Date | Status |
|----|---------|------|--------|
| VN-30001 | Eleanor Thompson | Today | Completed |
| VN-30000 | Eleanor Thompson | 3 days ago | Completed |
| VN-30002 | James Mitchell | Today | Pending |

---

## Dashboard URLs

| View | URL |
|------|-----|
| Dashboard | https://pointcare-emr-demo.netlify.app/ |
| Eleanor's Visit | https://pointcare-emr-demo.netlify.app/visit/VN-30001 |
| Eleanor's Profile | https://pointcare-emr-demo.netlify.app/patient/PT-10001 |
| James's Visit | https://pointcare-emr-demo.netlify.app/visit/VN-30002 |

---

## Demo Tips

1. **Open the visit page first**, then have Ratchet send updates
2. **Dashboard polls every 2 seconds** - updates appear quickly
3. **Changed fields flash yellow** for 1.5 seconds
4. **"Live • Updated Xs ago"** indicator shows connection status
5. **Partial updates work** - only send fields that changed

---

## Error Handling

| HTTP Code | Meaning | Solution |
|-----------|---------|----------|
| 200 | Success | Data updated |
| 201 | Created | New record inserted |
| 400 | Bad Request | Check JSON syntax |
| 401 | Unauthorized | Check API key |
| 404 | Not Found | Check visit/patient ID |
| 409 | Conflict | ID already exists (for POST) |

---

## Ratchet MCP Tool Definition (Example)

```json
{
  "name": "update_visit_vitals",
  "description": "Update vital signs for a patient visit in the EMR",
  "input_schema": {
    "type": "object",
    "properties": {
      "visit_id": {
        "type": "string",
        "description": "The visit ID (e.g., VN-30001)"
      },
      "blood_pressure_systolic": {"type": "integer"},
      "blood_pressure_diastolic": {"type": "integer"},
      "heart_rate": {"type": "integer"},
      "oxygen_saturation": {"type": "integer"},
      "temperature": {"type": "number"},
      "respiratory_rate": {"type": "integer"},
      "pain_level": {"type": "integer"},
      "weight": {"type": "number"},
      "blood_glucose": {"type": "integer"}
    },
    "required": ["visit_id"]
  }
}
```

---

## Contact

Dashboard: https://pointcare-emr-demo.netlify.app
Supabase Project: https://supabase.com/dashboard/project/ffbpqxwkdywbwxbcntaa
