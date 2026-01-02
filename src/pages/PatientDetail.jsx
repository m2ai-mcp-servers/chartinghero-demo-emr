import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card, { CardSection } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { LoadingScreen } from '../components/common/LoadingSpinner';
import DataRefreshIndicator from '../components/demo/DataRefreshIndicator';
import { usePatient } from '../hooks/usePatients';
import { usePatientVisits, useCurrentVisit } from '../hooks/useVisits';
import { formatDate, formatPatientName, formatBloodPressure, calculateAge } from '../utils/formatters';

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { data: patient, loading: patientLoading, lastUpdate } = usePatient(patientId);
  const { data: visits } = usePatientVisits(patientId);
  const { data: currentVisit } = useCurrentVisit(patientId);

  if (patientLoading || !patient) {
    return <LoadingScreen message="Loading patient..." />;
  }

  const age = calculateAge(patient.dob);
  const recentVisit = visits?.[0];
  const recentVitals = recentVisit?.vitalSigns;

  const handleStartVisit = () => {
    // Navigate to today's visit or the current visit
    const today = new Date().toISOString().split('T')[0];
    const todaysVisit = visits?.find(v => v.visitDate === today);

    if (todaysVisit) {
      navigate(`/visit/${todaysVisit.id}`);
    } else if (currentVisit) {
      navigate(`/visit/${currentVisit.id}`);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header
        title={formatPatientName(patient, 'initials')}
        subtitle={`${patient.id} | DOB: ${formatDate(patient.dob)} (${age}y)`}
        showBack
      />

      <main className="p-4 space-y-4">
        {/* Primary Diagnosis */}
        <Card>
          <CardSection title="Primary Diagnosis">
            <div className="font-semibold text-gray-900 text-lg">
              {patient.primaryDiagnosis?.description}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ICD-10: {patient.primaryDiagnosis?.icd10}
            </div>
          </CardSection>
        </Card>

        {/* Secondary Diagnoses */}
        {patient.secondaryDiagnoses?.length > 0 && (
          <Card>
            <CardSection title="Secondary Diagnoses">
              <div className="space-y-2">
                {patient.secondaryDiagnoses.map((dx, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm">{dx.description}</span>
                    <span className="text-xs text-gray-400">{dx.icd10}</span>
                  </div>
                ))}
              </div>
            </CardSection>
          </Card>
        )}

        {/* Current Medications */}
        <Card>
          <CardSection title="Current Medications">
            <div className="space-y-2">
              {patient.medications?.slice(0, 3).map((med, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-900 font-medium">{med.name}</span>
                  <span className="text-gray-500"> {med.dosage} {med.frequency}</span>
                </div>
              ))}
              {patient.medications?.length > 3 && (
                <div className="text-sm text-primary-600 font-medium">
                  + {patient.medications.length - 3} more
                </div>
              )}
            </div>
          </CardSection>
        </Card>

        {/* Recent Vitals */}
        {recentVitals && (
          <Card>
            <CardSection title={`Recent Vitals (${formatDate(recentVisit?.visitDate)})`}>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">BP: </span>
                  <span className="font-mono font-semibold">
                    {formatBloodPressure(recentVitals.bloodPressureSystolic, recentVitals.bloodPressureDiastolic)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">HR: </span>
                  <span className="font-mono font-semibold">{recentVitals.heartRate || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">O2: </span>
                  <span className="font-mono font-semibold">
                    {recentVitals.oxygenSaturation ? `${recentVitals.oxygenSaturation}%` : '--'}
                  </span>
                </div>
              </div>
            </CardSection>
          </Card>
        )}

        {/* Visit History */}
        <Card>
          <CardSection title="Visit History">
            {visits?.length > 0 ? (
              <div className="space-y-2">
                {visits.slice(0, 3).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{formatDate(visit.visitDate)}</span>
                      <span className="text-gray-500">-</span>
                      <span className="text-gray-500 capitalize">
                        {visit.visitType?.replace('_', ' ')}
                      </span>
                    </div>
                    {visit.status === 'completed' && (
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No visit history</div>
            )}
          </CardSection>
        </Card>

        {/* Care Plan Goals */}
        <Card>
          <CardSection title="Care Plan Goals">
            <ul className="space-y-1">
              {patient.carePlanGoals?.map((goal, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </CardSection>
        </Card>
      </main>

      {/* Start Visit Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <button
          onClick={handleStartVisit}
          className="w-full bg-primary-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:bg-primary-700 active:bg-primary-800 transition-colors touch-target"
        >
          Start Today's Visit
        </button>
      </div>

      <DataRefreshIndicator lastUpdate={lastUpdate} />
    </div>
  );
}
