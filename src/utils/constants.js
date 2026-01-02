// Polling interval in milliseconds
export const POLL_INTERVAL = 2000;

// Data source path
export const DATA_PATH = '/data';

// Status colors
export const STATUS_COLORS = {
  completed: 'bg-success text-white',
  in_progress: 'bg-primary-500 text-white',
  pending: 'bg-warning text-white',
  overdue: 'bg-danger text-white',
};

// Vital signs normal ranges
export const VITAL_RANGES = {
  bloodPressureSystolic: { low: 90, high: 140, critical_low: 80, critical_high: 180 },
  bloodPressureDiastolic: { low: 60, high: 90, critical_low: 50, critical_high: 120 },
  heartRate: { low: 60, high: 100, critical_low: 50, critical_high: 130 },
  oxygenSaturation: { low: 95, high: 100, critical_low: 90, critical_high: 100 },
  temperature: { low: 97.0, high: 99.0, critical_low: 95.0, critical_high: 101.5 },
  respiratoryRate: { low: 12, high: 20, critical_low: 8, critical_high: 30 },
  bloodGlucose: { low: 70, high: 140, critical_low: 50, critical_high: 250 },
};

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'patients', label: 'Patients', icon: 'users', path: '/patients' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar', path: '/schedule' },
];

// Visit types
export const VISIT_TYPES = {
  skilled_nursing: 'Skilled Nursing',
  physical_therapy: 'Physical Therapy',
  occupational_therapy: 'Occupational Therapy',
  speech_therapy: 'Speech Therapy',
  home_health_aide: 'Home Health Aide',
  social_work: 'Social Work',
};

// Tab configuration for Visit Documentation
export const VISIT_TABS = [
  { id: 'vitals', label: 'Vitals' },
  { id: 'soap', label: 'SOAP' },
  { id: 'meds', label: 'Meds' },
  { id: 'plan', label: 'Plan' },
  { id: 'education', label: 'Ed' },
];
