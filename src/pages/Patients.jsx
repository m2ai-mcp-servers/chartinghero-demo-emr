import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { LoadingScreen } from '../components/common/LoadingSpinner';
import DataRefreshIndicator from '../components/demo/DataRefreshIndicator';
import { usePatients } from '../hooks/usePatients';
import { formatPatientName, formatAddress, calculateAge } from '../utils/formatters';

export default function Patients() {
  const navigate = useNavigate();
  const { data: patients, loading, lastUpdate } = usePatients();

  if (loading) {
    return <LoadingScreen message="Loading patients..." />;
  }

  return (
    <div className="min-h-screen pb-20">
      <Header
        title="Patients"
        subtitle={`${patients?.length || 0} active patients`}
      />

      <main className="p-4 space-y-3">
        {patients?.map((patient) => (
          <Card
            key={patient.id}
            onClick={() => navigate(`/patient/${patient.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {formatPatientName(patient)}
                  </span>
                  {patient.priority && (
                    <Badge variant="danger" size="sm">Priority</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {patient.id} • {calculateAge(patient.dob)}y • {patient.phone}
                </div>
                <div className="text-sm text-primary-600 font-medium">
                  {patient.primaryDiagnosis?.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatAddress(patient.address, true)}
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        ))}
      </main>

      <DataRefreshIndicator lastUpdate={lastUpdate} />
    </div>
  );
}
