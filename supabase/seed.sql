-- =============================================
-- PointCare EMR - Seed Data
-- Run this after schema.sql to populate test data
-- =============================================

-- =============================================
-- PATIENTS
-- =============================================
INSERT INTO patients (id, first_name, last_name, dob, age, phone, address, status, priority, primary_diagnosis, secondary_diagnoses, medications, care_plan_goals, emergency_contact, scheduled_time, visit_status)
VALUES
(
  'PT-10001',
  'Eleanor',
  'Thompson',
  '1942-03-15',
  82,
  '555-0101',
  '{"street": "123 Oak Street", "city": "Nashville", "state": "TN", "zip": "37201"}',
  'active',
  FALSE,
  '{"description": "Type 2 Diabetes Mellitus", "icd10": "E11.9"}',
  '[{"description": "Essential Hypertension", "icd10": "I10"}, {"description": "Diabetic Peripheral Neuropathy", "icd10": "E11.42"}]',
  '[{"name": "Metformin", "dosage": "500mg", "frequency": "BID", "route": "PO"}, {"name": "Lisinopril", "dosage": "10mg", "frequency": "Daily", "route": "PO"}, {"name": "Gabapentin", "dosage": "300mg", "frequency": "TID", "route": "PO"}, {"name": "Aspirin", "dosage": "81mg", "frequency": "Daily", "route": "PO"}]',
  '["Blood glucose <150 mg/dL fasting", "Daily foot inspections performed", "A1C <7.5% by 03/2025", "Blood pressure <140/90 mmHg"]',
  '{"name": "Robert Thompson", "relationship": "Son", "phone": "555-0102"}',
  '09:00',
  'in_progress'
),
(
  'PT-10002',
  'James',
  'Mitchell',
  '1955-08-22',
  69,
  '555-0201',
  '{"street": "456 Maple Avenue", "city": "Nashville", "state": "TN", "zip": "37203"}',
  'active',
  TRUE,
  '{"description": "Heart Failure with Reduced Ejection Fraction", "icd10": "I50.2"}',
  '[{"description": "Atrial Fibrillation", "icd10": "I48.91"}, {"description": "Chronic Kidney Disease, Stage 3", "icd10": "N18.3"}]',
  '[{"name": "Furosemide", "dosage": "40mg", "frequency": "BID", "route": "PO"}, {"name": "Metoprolol Succinate", "dosage": "50mg", "frequency": "Daily", "route": "PO"}, {"name": "Lisinopril", "dosage": "20mg", "frequency": "Daily", "route": "PO"}, {"name": "Eliquis", "dosage": "5mg", "frequency": "BID", "route": "PO"}]',
  '["Daily weight monitoring", "Sodium intake <2g/day", "Report weight gain >3 lbs in 24 hours", "Maintain fluid restriction 2L/day"]',
  '{"name": "Susan Mitchell", "relationship": "Wife", "phone": "555-0202"}',
  '11:00',
  'pending'
),
(
  'PT-10003',
  'Margaret',
  'Chen',
  '1948-11-03',
  76,
  '555-0301',
  '{"street": "789 Pine Road", "city": "Nashville", "state": "TN", "zip": "37205"}',
  'active',
  FALSE,
  '{"description": "Post-Surgical Wound Care - Right Hip Replacement", "icd10": "Z96.641"}',
  '[{"description": "Osteoarthritis", "icd10": "M16.11"}]',
  '[{"name": "Oxycodone-Acetaminophen", "dosage": "5-325mg", "frequency": "Q6H PRN", "route": "PO"}, {"name": "Enoxaparin", "dosage": "40mg", "frequency": "Daily", "route": "SubQ"}, {"name": "Calcium + Vitamin D", "dosage": "600mg/400IU", "frequency": "BID", "route": "PO"}]',
  '["Surgical site healing without infection", "Perform PT exercises as prescribed", "Pain controlled at <4/10", "Ambulate with walker x3 daily"]',
  '{"name": "David Chen", "relationship": "Husband", "phone": "555-0302"}',
  '14:00',
  'pending'
)
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();

-- =============================================
-- VISITS
-- =============================================
INSERT INTO visits (id, patient_id, visit_type, visit_date, time_in, time_out, nurse_name, vital_signs, subjective, objective, assessment, plan, interventions, education, next_visit_date, status)
VALUES
(
  'VN-30001',
  'PT-10001',
  'skilled_nursing',
  CURRENT_DATE,
  '09:15',
  '10:05',
  'Sarah Johnson, RN',
  '{"bloodPressureSystolic": 138, "bloodPressureDiastolic": 82, "heartRate": 76, "oxygenSaturation": 97, "temperature": 98.4, "temperatureUnit": "F", "respiratoryRate": 16, "painLevel": 2, "weight": 156, "weightUnit": "lbs", "bloodGlucose": 142, "glucoseUnit": "mg/dL", "glucoseTiming": "fasting"}',
  'Patient reports worsening tingling in bilateral feet over past week. States "it''s getting harder to feel my feet." Denies pain, open sores, or injury. Compliant with metformin regimen. Fasting blood glucose 142 mg/dL this morning. Reports good appetite and adequate fluid intake. Sleep pattern unchanged.',
  'Alert and oriented x4. Bilateral lower extremities warm, no edema. Skin intact, no lesions or wounds noted. Pedal pulses palpable bilaterally. Monofilament test: diminished sensation noted in bilateral plantar surfaces (4/10 sites detected vs 6/10 last visit). Blood pressure slightly elevated but within acceptable range for age.',
  'Progressive diabetic peripheral neuropathy with objective decline in protective sensation. Current glucose slightly elevated but within acceptable range for age and diagnosis. Hypertension controlled. Patient demonstrates understanding of foot care importance.',
  E'1) Notify Dr. Patel of worsening neuropathy findings\n2) Continue current medication regimen\n3) Reinforce daily foot inspections with mirror technique\n4) Follow up in 3 days to reassess sensation\n5) Encourage proper diabetic footwear',
  '[{"code": "INT-001", "description": "Comprehensive foot examination", "completed": true}, {"code": "INT-002", "description": "Monofilament sensory testing", "completed": true}, {"code": "INT-003", "description": "Blood glucose monitoring", "completed": true}, {"code": "INT-004", "description": "Medication reconciliation", "completed": true}, {"code": "INT-005", "description": "Fall risk assessment", "completed": true}, {"code": "INT-006", "description": "Wound care", "completed": false}, {"code": "INT-007", "description": "Catheter care", "completed": false}, {"code": "INT-008", "description": "IV management", "completed": false}]',
  '[{"code": "EDU-001", "description": "Daily foot inspection technique", "completed": true}, {"code": "EDU-002", "description": "Proper diabetic footwear", "completed": true}, {"code": "EDU-003", "description": "Signs of foot injury requiring immediate attention", "completed": true}, {"code": "EDU-004", "description": "Blood glucose target ranges", "completed": true}, {"code": "EDU-005", "description": "Medication administration", "completed": false}, {"code": "EDU-006", "description": "Diet/nutrition guidance", "completed": false}]',
  CURRENT_DATE + INTERVAL '3 days',
  'completed'
),
(
  'VN-30000',
  'PT-10001',
  'skilled_nursing',
  CURRENT_DATE - INTERVAL '3 days',
  '09:30',
  '10:15',
  'Sarah Johnson, RN',
  '{"bloodPressureSystolic": 142, "bloodPressureDiastolic": 84, "heartRate": 78, "oxygenSaturation": 96, "temperature": 98.2, "temperatureUnit": "F", "respiratoryRate": 18, "painLevel": 1, "weight": 155, "weightUnit": "lbs", "bloodGlucose": 156, "glucoseUnit": "mg/dL", "glucoseTiming": "fasting"}',
  'Patient reports mild tingling in feet. States ''I notice it more at night.'' No pain or open wounds. Taking medications as prescribed. Blood glucose readings averaging 150-160 fasting.',
  'Alert and oriented x4. Bilateral lower extremities warm, no edema. Skin intact. Monofilament test: diminished sensation in bilateral plantar surfaces (6/10 sites detected). Pedal pulses present bilaterally.',
  'Stable diabetic peripheral neuropathy. Blood glucose slightly above target range. Blood pressure borderline elevated.',
  E'1) Continue current medications\n2) Reinforce foot care education\n3) Monitor blood glucose trends\n4) Follow up in 3 days',
  '[{"code": "INT-001", "description": "Comprehensive foot examination", "completed": true}, {"code": "INT-002", "description": "Monofilament sensory testing", "completed": true}, {"code": "INT-003", "description": "Blood glucose monitoring", "completed": true}, {"code": "INT-004", "description": "Medication reconciliation", "completed": true}]',
  '[{"code": "EDU-001", "description": "Daily foot inspection technique", "completed": true}, {"code": "EDU-004", "description": "Blood glucose target ranges", "completed": true}]',
  CURRENT_DATE,
  'completed'
),
(
  'VN-30002',
  'PT-10002',
  'skilled_nursing',
  CURRENT_DATE,
  NULL,
  NULL,
  'Sarah Johnson, RN',
  '{}',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"code": "INT-009", "description": "Heart failure assessment", "completed": false}, {"code": "INT-010", "description": "Weight monitoring", "completed": false}, {"code": "INT-011", "description": "Edema assessment", "completed": false}, {"code": "INT-004", "description": "Medication reconciliation", "completed": false}]',
  '[{"code": "EDU-007", "description": "Daily weight monitoring technique", "completed": false}, {"code": "EDU-008", "description": "Low sodium diet education", "completed": false}, {"code": "EDU-009", "description": "Signs of heart failure exacerbation", "completed": false}]',
  NULL,
  'pending'
)
ON CONFLICT (id) DO UPDATE SET
  vital_signs = EXCLUDED.vital_signs,
  subjective = EXCLUDED.subjective,
  objective = EXCLUDED.objective,
  assessment = EXCLUDED.assessment,
  plan = EXCLUDED.plan,
  interventions = EXCLUDED.interventions,
  education = EXCLUDED.education,
  updated_at = NOW();
