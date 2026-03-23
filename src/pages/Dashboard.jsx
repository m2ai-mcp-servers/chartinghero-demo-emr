import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { LoadingScreen } from '../components/common/LoadingSpinner';
import DataRefreshIndicator from '../components/demo/DataRefreshIndicator';
import { usePatients } from '../hooks/usePatients';
import { formatAddress, formatPatientName } from '../utils/formatters';

function SummaryCard({ label, value, variant }) {
  const bgColors = {
    primary: 'bg-primary-500',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div className={`${bgColors[variant]} text-white rounded-lg p-4 text-center`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

function PatientCard({ patient, onClick }) {
  const statusColors = {
    completed: '#10B981',
    in_progress: '#0066CC',
    pending: '#F59E0B',
  };

  const statusVariants = {
    completed: 'success',
    in_progress: 'primary',
    pending: 'warning',
  };

  const statusLabels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    pending: 'Not Started',
  };

  return (
    <Card
      onClick={onClick}
      statusColor={statusColors[patient.visitStatus]}
      className="mb-3"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {formatPatientName(patient)}
            </span>
            <span className="text-gray-500 text-sm">
              {patient.age}y
            </span>
            {patient.priority && (
              <span className="text-danger text-xs font-bold">PRIORITY</span>
            )}
          </div>
          <div className="text-sm text-primary-600 font-medium mb-1">
            {patient.primaryDiagnosis?.description}
          </div>
          <div className="text-xs text-gray-500">
            {formatAddress(patient.address, true)}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {patient.scheduledTime}
          </div>
          <Badge variant={statusVariants[patient.visitStatus]} size="sm">
            {statusLabels[patient.visitStatus]}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: patients, loading, lastUpdate } = usePatients();

  if (loading) {
    return <LoadingScreen message="Loading schedule..." />;
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate summary stats
  const completed = patients?.filter(p => p.visitStatus === 'completed').length || 0;
  const inProgress = patients?.filter(p => p.visitStatus === 'in_progress').length || 0;
  const pending = patients?.filter(p => p.visitStatus === 'pending').length || 0;
  const total = patients?.length || 0;

  // Sort by scheduled time
  const sortedPatients = [...(patients || [])].sort((a, b) => {
    const timeA = a.scheduledTime || '99:99';
    const timeB = b.scheduledTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="min-h-screen pb-20">
      <Header
        title="Today's Schedule"
        subtitle={formattedDate}
      />

      <main className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard label="Total Visits" value={total} variant="primary" />
          <SummaryCard label="Completed" value={completed} variant="success" />
          <SummaryCard label="Pending" value={pending + inProgress} variant="warning" />
        </div>

        {/* Patient List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Patients
          </h2>
          {sortedPatients.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No patients scheduled for today
            </div>
          ) : (
            sortedPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => navigate(`/patient/${patient.id}`)}
              />
            ))
          )}
        </div>
      </main>

      <DataRefreshIndicator lastUpdate={lastUpdate} />
    </div>
  );
}
