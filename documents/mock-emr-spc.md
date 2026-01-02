# PointCare EMR Mockup UI - Claude Code Build Spec

## Project Overview

Build a React-based mockup of the PointCare mobile clinical documentation app used by home health nurses. This UI will visually demonstrate the Ratchet MCP's ability to populate EMR fields from natural language input.

**Primary Use Case:** Demo showing voice/chat input → Claude processing → EMR fields populating in real-time

**Target Audience:** Healthcare IT stakeholders, AccentCare leadership, Anthropic hiring team

---

## Tech Stack

- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **State Management:** React Query or simple polling for data refresh
- **Deployment:** Netlify
- **Data Source:** JSON files from `../ratchet-emr-demo/mock_data/`

---

## Project Structure

```
pointcare-mockup/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── TabBar.jsx
│   │   ├── patients/
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientCard.jsx
│   │   │   └── PatientSearch.jsx
│   │   ├── visits/
│   │   │   ├── VisitList.jsx
│   │   │   ├── VisitCard.jsx
│   │   │   ├── VisitDetail.jsx
│   │   │   └── VisitForm.jsx
│   │   ├── clinical/
│   │   │   ├── VitalsPanel.jsx
│   │   │   ├── SOAPNote.jsx
│   │   │   ├── MedicationList.jsx
│   │   │   ├── InterventionChecklist.jsx
│   │   │   └── EducationChecklist.jsx
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   └── demo/
│   │       ├── DataRefreshIndicator.jsx
│   │       └── MCPStatusBadge.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── VisitDocumentation.jsx
│   │   └── Schedule.jsx
│   ├── hooks/
│   │   ├── usePatients.js
│   │   ├── useVisits.js
│   │   └── usePolling.js
│   ├── services/
│   │   └── dataService.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── data/
│   └── (symlink or copy from ratchet-emr-demo/mock_data)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Design Requirements

### Visual Style - Mobile Clinical App

**Color Palette:**
```css
/* Primary - AccentCare/Healthcare Blue */
--primary-500: #0066CC;
--primary-600: #0052A3;
--primary-700: #003D7A;

/* Status Colors */
--success: #10B981;    /* Completed, normal vitals */
--warning: #F59E0B;    /* Pending, borderline vitals */
--danger: #EF4444;     /* Overdue, critical vitals */
--info: #3B82F6;       /* Informational */

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* Background */
--bg-primary: #F3F4F6;
--bg-card: #FFFFFF;
```

**Typography:**
- Font: Inter or SF Pro (system fonts fallback)
- Headers: 600-700 weight
- Body: 400-500 weight
- Clinical data: Monospace for vitals/measurements

**Layout Principles:**
- Mobile-first, tablet-optimized (768px-1024px primary)
- Large touch targets (min 44px)
- High contrast for outdoor/bright environments
- Clear visual hierarchy for scanning during patient visits

---

## Screen Specifications

### 1. Dashboard / Schedule View

**Purpose:** Morning route overview, today's patients

**Elements:**
- Header with date, nurse name, shift time
- Summary cards: Visits Today (X), Completed (Y), Pending (Z)
- Patient list sorted by scheduled time
- Each patient card shows:
  - Patient name, age
  - Primary diagnosis badge
  - Scheduled time
  - Address (truncated)
  - Status indicator (Not Started / In Progress / Completed)
  - Priority flag if applicable

**Interactions:**
- Tap patient card → Patient Detail
- Pull to refresh
- Filter by status

### 2. Patient Detail View

**Purpose:** Full patient context before/during visit

**Sections:**
```
┌─────────────────────────────────────┐
│ [←] Eleanor Thompson          [⋮]  │
│ PT-10001 | DOB: 03/15/1942 (82y)   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ PRIMARY DIAGNOSIS               │ │
│ │ Type 2 Diabetes Mellitus        │ │
│ │ ICD-10: E11.9                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ CURRENT MEDICATIONS         [→] │ │
│ │ • Metformin 500mg BID           │ │
│ │ • Lisinopril 10mg daily         │ │
│ │ + 2 more                        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ RECENT VITALS (12/20/2024)      │ │
│ │ BP: 142/84  HR: 78  O2: 96%     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ VISIT HISTORY              [→]  │ │
│ │ 12/20 - Skilled Nursing ✓       │ │
│ │ 12/17 - Skilled Nursing ✓       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ CARE PLAN GOALS                 │ │
│ │ • Blood glucose <150 fasting    │ │
│ │ • Daily foot inspections        │ │
│ │ • A1C <7.5% by 03/2025          │ │
│ └─────────────────────────────────┘ │
│                                     │
│    [ START TODAY'S VISIT ]         │
└─────────────────────────────────────┘
```

### 3. Visit Documentation View (CRITICAL - Main Demo Screen)

**Purpose:** This is the money shot - fields populating from MCP

**Layout - Tabbed Interface:**
```
┌─────────────────────────────────────┐
│ [←] Visit Note - E. Thompson  [💾] │
│ 01/02/2026 | Skilled Nursing       │
├─────────────────────────────────────┤
│ [Vitals] [SOAP] [Meds] [Plan] [Ed] │
├─────────────────────────────────────┤
│                                     │
│  VITAL SIGNS                        │
│  ┌─────────┬─────────┬─────────┐   │
│  │ BP      │ HR      │ O2 Sat  │   │
│  │ 138/82  │ 76      │ 97%     │   │
│  │ mmHg    │ bpm     │         │   │
│  └─────────┴─────────┴─────────┘   │
│  ┌─────────┬─────────┬─────────┐   │
│  │ Temp    │ Resp    │ Pain    │   │
│  │ 98.4°F  │ --      │ --      │   │
│  │         │ /min    │ /10     │   │
│  └─────────┴─────────┴─────────┘   │
│  ┌─────────┬─────────┐             │
│  │ Weight  │ Glucose │             │
│  │ ---     │ 142     │             │
│  │ lbs     │ mg/dL   │             │
│  └─────────┴─────────┘             │
│                                     │
│  Time In: [09:15]  Time Out:[10:05]│
│                                     │
└─────────────────────────────────────┘
```

**SOAP Note Tab:**
```
┌─────────────────────────────────────┐
│ SUBJECTIVE                      [▼]│
├─────────────────────────────────────┤
│ Patient reports worsening tingling │
│ in bilateral feet over past week.  │
│ States "it's getting harder to     │
│ feel my feet." Denies pain, open   │
│ sores, or injury. Compliant with   │
│ metformin regimen. Fasting blood   │
│ glucose 142 mg/dL this morning.    │
├─────────────────────────────────────┤
│ OBJECTIVE                       [▼]│
├─────────────────────────────────────┤
│ Alert and oriented x4. Bilateral   │
│ lower extremities warm, no edema.  │
│ Skin intact, no lesions or wounds  │
│ noted. Pedal pulses palpable       │
│ bilaterally. Monofilament test:    │
│ diminished sensation noted in      │
│ bilateral plantar surfaces (4/10   │
│ sites detected vs 6/10 last visit).│
├─────────────────────────────────────┤
│ ASSESSMENT                      [▼]│
├─────────────────────────────────────┤
│ Progressive diabetic peripheral    │
│ neuropathy with objective decline  │
│ in protective sensation. Current   │
│ glucose slightly elevated but      │
│ within acceptable range for age.   │
├─────────────────────────────────────┤
│ PLAN                            [▼]│
├─────────────────────────────────────┤
│ 1) Notify Dr. Patel of worsening   │
│    neuropathy                      │
│ 2) Continue current medication     │
│    regimen                         │
│ 3) Reinforce daily foot inspections│
│ 4) Follow up in 3 days             │
└─────────────────────────────────────┘
```

**Visual Feedback for Demo:**
- Fields flash/highlight briefly when populated by MCP
- "Last updated: 2 seconds ago" indicator
- Optional: Side-by-side "empty form" vs "populated form" view

### 4. Interventions & Education Checklists

```
┌─────────────────────────────────────┐
│ INTERVENTIONS PERFORMED            │
├─────────────────────────────────────┤
│ ☑ Comprehensive foot examination   │
│ ☑ Monofilament sensory testing     │
│ ☑ Blood glucose monitoring         │
│ ☑ Medication reconciliation        │
│ ☑ Fall risk assessment             │
│ ☐ Wound care                       │
│ ☐ Catheter care                    │
│ ☐ IV management                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PATIENT EDUCATION PROVIDED         │
├─────────────────────────────────────┤
│ ☑ Daily foot inspection technique  │
│ ☑ Proper diabetic footwear         │
│ ☑ Signs of foot injury requiring   │
│   immediate attention              │
│ ☑ Blood glucose target ranges      │
│ ☐ Medication administration        │
│ ☐ Diet/nutrition                   │
└─────────────────────────────────────┘
```

---

## Data Integration

### Reading Mock Data

The app should read from JSON files. For the demo, implement polling:

```javascript
// services/dataService.js
const DATA_PATH = '/data'; // Served from public folder or API

export async function fetchPatients() {
  const response = await fetch(`${DATA_PATH}/patients.json`);
  return response.json();
}

export async function fetchVisits(patientId) {
  const response = await fetch(`${DATA_PATH}/visits.json`);
  const visits = await response.json();
  return patientId 
    ? visits.filter(v => v.patientId === patientId)
    : visits;
}

// Polling hook for live updates
export function usePolling(fetchFn, interval = 2000) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const poll = async () => {
      const result = await fetchFn();
      setData(result);
    };
    
    poll(); // Initial fetch
    const timer = setInterval(poll, interval);
    return () => clearInterval(timer);
  }, [fetchFn, interval]);
  
  return data;
}
```

### Mock Data Schema

**patients.json:**
```json
[
  {
    "id": "PT-10001",
    "firstName": "Eleanor",
    "lastName": "Thompson",
    "dob": "1942-03-15",
    "phone": "555-0101",
    "address": {
      "street": "123 Oak Street",
      "city": "Nashville",
      "state": "TN",
      "zip": "37201"
    },
    "status": "active",
    "primaryDiagnosis": {
      "description": "Type 2 Diabetes Mellitus",
      "icd10": "E11.9"
    },
    "medications": [...],
    "carePlanGoals": [...],
    "emergencyContact": {...}
  }
]
```

**visits.json:**
```json
[
  {
    "id": "VN-30000",
    "patientId": "PT-10001",
    "visitType": "skilled_nursing",
    "visitDate": "2026-01-02",
    "timeIn": "09:15",
    "timeOut": "10:05",
    "nurseName": "Sarah Johnson, RN",
    "vitalSigns": {
      "bloodPressureSystolic": 138,
      "bloodPressureDiastolic": 82,
      "heartRate": 76,
      "oxygenSaturation": 97,
      "temperature": 98.4,
      "temperatureUnit": "F"
    },
    "subjective": "...",
    "objective": "...",
    "assessment": "...",
    "plan": "...",
    "interventions": [...],
    "education": [...],
    "nextVisitDate": "2026-01-05",
    "createdAt": "2026-01-02T10:07:23Z",
    "updatedAt": "2026-01-02T10:07:23Z"
  }
]
```

---

## Demo Features

### 1. Live Data Refresh Indicator

Show when data was last fetched and highlight new/changed records:

```jsx
// components/demo/DataRefreshIndicator.jsx
function DataRefreshIndicator({ lastUpdate }) {
  const secondsAgo = Math.floor((Date.now() - lastUpdate) / 1000);
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      Live • Updated {secondsAgo}s ago
    </div>
  );
}
```

### 2. Field Highlight Animation

When a field changes, briefly highlight it:

```css
@keyframes field-update {
  0% { background-color: #FEF3C7; }
  100% { background-color: transparent; }
}

.field-updated {
  animation: field-update 1.5s ease-out;
}
```

### 3. Split-Screen Demo Mode (Optional)

For presentations, show Claude chat on left, EMR on right:

```
┌──────────────────┬──────────────────┐
│   Claude Chat    │   PointCare UI   │
│                  │                  │
│ User: Just       │  ┌────────────┐  │
│ finished with    │  │ VITALS     │  │
│ Eleanor, BP was  │  │ BP: 138/82 │◄─┼── Highlights
│ 138/82...        │  │ HR: 76     │  │
│                  │  └────────────┘  │
│ Claude: Creating │                  │
│ visit note...    │                  │
└──────────────────┴──────────────────┘
```

---

## Implementation Priority

### Phase 1 - Core Demo (MVP)
1. Patient list view
2. Patient detail view
3. Visit documentation view with vitals
4. SOAP note display
5. Basic polling for data refresh
6. Field highlight animation

### Phase 2 - Polish
1. Interventions/Education checklists
2. Visit history timeline
3. Medication list
4. Better mobile responsiveness
5. Loading states

### Phase 3 - Demo Enhancements
1. Split-screen mode
2. "Before/After" toggle
3. Demo walkthrough overlay
4. Export demo as video/GIF

---

## Deployment

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

```env
VITE_DATA_SOURCE=local  # or 'api' for future backend
VITE_POLL_INTERVAL=2000
VITE_DEMO_MODE=true
```

---

## Prompt for Claude Code

Copy this to start the CC session:

---

**START CC PROMPT:**

I need you to build a React mockup of the PointCare mobile EMR app for home health nurses. This is a demo UI that will display data populated by my Ratchet MCP server.

**Context:**
- I have an MCP server (ratchet-emr) that creates visit notes from natural language
- Mock data is in JSON files at `../ratchet-emr-demo/mock_data/`
- This UI reads that data and displays it like a real EMR
- Primary demo: show fields populating in "real-time" when MCP creates records

**Requirements:**
1. React + Vite + Tailwind CSS
2. Mobile-first design (tablet-optimized, 768-1024px)
3. Healthcare blue color scheme (#0066CC primary)
4. Four main views: Dashboard, Patient Detail, Visit Documentation, Schedule
5. Visit Documentation is the key screen - tabbed interface with Vitals, SOAP, Meds, Plan, Education
6. Poll JSON files every 2 seconds for updates
7. Highlight fields that change (yellow flash animation)
8. "Live • Updated Xs ago" indicator

**Read the full spec in pointcare-mockup-spec.md for:**
- Complete component structure
- Screen wireframes (ASCII)
- Data schemas
- Styling details
- Demo features

Start by scaffolding the project structure, then build Phase 1 MVP components.

**END CC PROMPT**

---

## Reference: PointCare/HCHB UI Patterns

Based on AccentCare training materials:

- Navigation: Bottom tab bar on mobile (Home, Patients, Schedule, Messages, More)
- Forms: Collapsible sections with completion indicators
- Vitals: Grid of input boxes with units
- Lists: Cards with left color bar indicating status
- Actions: Floating action button for "Start Visit"
- Signatures: Signature capture pad (mock only for demo)

---

## Success Criteria

The demo is successful when a viewer can:

1. See a realistic-looking home health EMR interface
2. Watch fields populate automatically after MCP creates a visit note
3. Understand the time savings (conversational input → complete documentation)
4. Recognize this as production-viable, not just a hackathon prototype