# ChartingHero Demo EMR

React-based mobile EMR mockup for home health nurses demonstrating the ChartingHero MCP's ability to populate clinical documentation from natural language.

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS (v4 with CSS-first config)
- React Router DOM
- Supabase (optional, for multi-user real-time updates)

## Data Sources

The app supports two data sources:

1. **Local JSON** (default) - reads from `public/data/`
2. **Supabase** - reads from PostgreSQL database (multi-user, real-time)

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set, the app automatically falls back to local JSON.

## Supabase Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project
- Note your Project URL and anon public key from Settings > API

### 2. Run Schema Migration
- Open SQL Editor in Supabase Dashboard
- Copy and run `supabase/schema.sql`
- Then run `supabase/seed.sql` to add test data

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Verify Connection
```bash
npm run dev
```
The "Live" indicator will show data source (local vs supabase).

## ChartingHero MCP Integration

The MCP writes one whole visit row per `create_visit_note` call (upsert on `id`). There is no field-by-field update flow. Payload, known gaps and synthetic-data rules: `docs/CHARTINGHERO-INTEGRATION.md`.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, NavBar
│   ├── common/          # Badge, Card, LoadingSpinner
│   ├── clinical/        # VitalsPanel, SOAPNote, checklists
│   └── demo/            # DataRefreshIndicator
├── pages/
│   ├── Dashboard.jsx    # Today's schedule
│   ├── Patients.jsx     # Patient list
│   ├── PatientDetail.jsx
│   ├── VisitDocumentation.jsx  # KEY DEMO SCREEN
│   └── Schedule.jsx
├── hooks/               # usePolling, usePatients, useVisits
├── services/
│   ├── supabase.js      # Supabase client
│   └── dataService.js   # Data fetching (auto-switches source)
└── utils/               # constants.js, formatters.js

supabase/
├── schema.sql           # Database schema
└── seed.sql             # Test data

public/data/             # Local JSON fallback
├── patients.json
└── visits.json
```

## Key Features

- **2-second polling** for real-time data updates
- **Yellow highlight animation** on changed fields
- **"Live • Updated Xs ago"** indicator
- **Mobile-first tablet design** (768-1024px primary)
- **44px touch targets** for accessibility
- **Auto-fallback** between Supabase and local JSON

## Demo Flow

1. Dashboard shows today's patients
2. Tap patient → Patient Detail
3. "Start Visit" → Visit Documentation
4. Tabs: Vitals | SOAP | Meds | Plan | Education
5. Fields highlight when data changes in Supabase

## Architecture for Multi-User Demo

```
┌─────────────────┐     ┌─────────────────┐
│ Nurse 1 Device  │     │ Nurse 2 Device  │
│ Claude Desktop  │     │ Claude Desktop  │
│ + ChartingHero  │     │ + ChartingHero  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │    POST to API        │
         ▼                       ▼
    ┌────────────────────────────────┐
    │         Supabase               │
    │   (PostgreSQL + REST API)      │
    └───────────────┬────────────────┘
                    │
                    │ polls every 2s
                    ▼
         ┌─────────────────────┐
         │     Dashboard       │
         │  (Netlify hosted)   │
         └─────────────────────┘
```

## Deployment

### Netlify
```bash
npm run build
# Output in dist/
```

Set environment variables in Netlify:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Color Palette

- Primary: `#0066CC` (healthcare blue)
- Success: `#10B981` (completed/normal)
- Warning: `#F59E0B` (pending/borderline)
- Danger: `#EF4444` (overdue/critical)
