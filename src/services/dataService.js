import { supabase, isSupabaseConfigured } from './supabase';
import { DATA_PATH } from '../utils/constants';

// ============================================
// SUPABASE FUNCTIONS
// ============================================

async function fetchPatientsFromSupabase() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'active')
    .order('scheduled_time', { ascending: true });

  if (error) throw new Error(error.message);

  // Transform snake_case to camelCase for frontend compatibility
  return data.map(transformPatient);
}

async function fetchPatientFromSupabase(patientId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error) throw new Error(error.message);
  return transformPatient(data);
}

async function fetchVisitsFromSupabase() {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .order('visit_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(transformVisit);
}

async function fetchVisitFromSupabase(visitId) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('id', visitId)
    .single();

  if (error) throw new Error(error.message);
  return transformVisit(data);
}

async function fetchPatientVisitsFromSupabase(patientId) {
  console.log('[DEBUG] Fetching visits from Supabase for patient:', patientId);
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[DEBUG] Supabase error:', error);
    throw new Error(error.message);
  }
  console.log('[DEBUG] Supabase RAW data:', JSON.stringify(data?.map(v => ({ id: v.id, visit_date: v.visit_date, vital_signs: v.vital_signs }))));
  const transformed = data.map(transformVisit);
  console.log('[DEBUG] TRANSFORMED data:', JSON.stringify(transformed?.map(v => ({ id: v.id, visitDate: v.visitDate, vitalSigns: v.vitalSigns }))));
  return transformed;
}

// ============================================
// LOCAL JSON FUNCTIONS (fallback)
// ============================================

async function fetchPatientsFromJSON() {
  const response = await fetch(`${DATA_PATH}/patients.json`);
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
}

async function fetchPatientFromJSON(patientId) {
  const patients = await fetchPatientsFromJSON();
  return patients.find(p => p.id === patientId) || null;
}

async function fetchVisitsFromJSON() {
  const response = await fetch(`${DATA_PATH}/visits.json`);
  if (!response.ok) throw new Error('Failed to fetch visits');
  return response.json();
}

async function fetchVisitFromJSON(visitId) {
  const visits = await fetchVisitsFromJSON();
  return visits.find(v => v.id === visitId) || null;
}

async function fetchPatientVisitsFromJSON(patientId) {
  const visits = await fetchVisitsFromJSON();
  return visits
    .filter(v => v.patientId === patientId)
    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
}

// ============================================
// TRANSFORM FUNCTIONS (Supabase snake_case → camelCase)
// ============================================

function transformPatient(p) {
  if (!p) return null;
  return {
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    dob: p.dob,
    age: p.age,
    phone: p.phone,
    address: p.address, // JSONB stored as object
    status: p.status,
    priority: p.priority,
    primaryDiagnosis: p.primary_diagnosis,
    secondaryDiagnoses: p.secondary_diagnoses,
    medications: p.medications,
    carePlanGoals: p.care_plan_goals,
    emergencyContact: p.emergency_contact,
    scheduledTime: p.scheduled_time,
    visitStatus: p.visit_status,
  };
}

function transformVisit(v) {
  if (!v) return null;
  return {
    id: v.id,
    patientId: v.patient_id,
    visitType: v.visit_type,
    visitDate: v.visit_date,
    timeIn: v.time_in,
    timeOut: v.time_out,
    nurseName: v.nurse_name,
    vitalSigns: v.vital_signs,
    subjective: v.subjective,
    objective: v.objective,
    assessment: v.assessment,
    plan: v.plan,
    interventions: v.interventions,
    education: v.education,
    nextVisitDate: v.next_visit_date,
    status: v.status,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}

// ============================================
// PUBLIC API (auto-selects Supabase or JSON)
// ============================================

export async function fetchPatients() {
  if (isSupabaseConfigured()) {
    return fetchPatientsFromSupabase();
  }
  return fetchPatientsFromJSON();
}

export async function fetchPatient(patientId) {
  if (isSupabaseConfigured()) {
    return fetchPatientFromSupabase(patientId);
  }
  return fetchPatientFromJSON(patientId);
}

export async function fetchVisits() {
  if (isSupabaseConfigured()) {
    return fetchVisitsFromSupabase();
  }
  return fetchVisitsFromJSON();
}

export async function fetchVisit(visitId) {
  if (isSupabaseConfigured()) {
    return fetchVisitFromSupabase(visitId);
  }
  return fetchVisitFromJSON(visitId);
}

export async function fetchPatientVisits(patientId) {
  const useSupabase = isSupabaseConfigured();
  console.log('[DEBUG] fetchPatientVisits - using Supabase:', useSupabase, 'for patient:', patientId);
  if (useSupabase) {
    return fetchPatientVisitsFromSupabase(patientId);
  }
  return fetchPatientVisitsFromJSON(patientId);
}

export async function fetchCurrentVisit(patientId) {
  const visits = await fetchPatientVisits(patientId);
  const today = new Date().toISOString().split('T')[0];

  // First try to find today's visit
  const todaysVisit = visits.find(v => v.visitDate === today);
  if (todaysVisit) return todaysVisit;

  // Otherwise return the most recent visit
  return visits[0] || null;
}

export async function fetchTodaysSchedule() {
  const [patients, visits] = await Promise.all([
    fetchPatients(),
    fetchVisits()
  ]);

  const today = new Date().toISOString().split('T')[0];
  const todaysVisits = visits.filter(v => v.visitDate === today);

  return todaysVisits.map(visit => {
    const patient = patients.find(p => p.id === visit.patientId);
    return { ...visit, patient };
  });
}

// ============================================
// CHANGE DETECTION
// ============================================

export function detectChanges(oldData, newData) {
  if (!oldData || !newData) return [];

  const changes = [];

  function compare(oldObj, newObj, path = '') {
    if (typeof oldObj !== typeof newObj) {
      changes.push(path);
      return;
    }

    if (typeof oldObj !== 'object' || oldObj === null) {
      if (oldObj !== newObj) {
        changes.push(path);
      }
      return;
    }

    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      compare(oldObj[key], newObj[key], newPath);
    }
  }

  compare(oldData, newData);
  return changes;
}

// ============================================
// DATA SOURCE INFO
// ============================================

export function getDataSource() {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
