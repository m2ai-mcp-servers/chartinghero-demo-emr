import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { usePatients } from '../hooks/usePatients';
import { formatPatientName } from '../utils/formatters';

export default function Schedule() {
  const { data: patients } = usePatients();

  // Generate week days
  const today = new Date();
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    weekDays.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: i === 0,
    });
  }

  return (
    <div className="min-h-screen pb-20">
      <Header
        title="Schedule"
        subtitle="Weekly View"
      />

      <main className="p-4 space-y-4">
        {/* Week Calendar Strip */}
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="flex justify-between">
            {weekDays.map((day, index) => (
              <button
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[40px] transition-colors ${
                  day.isToday
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={`text-xs font-medium ${day.isToday ? 'text-primary-100' : 'text-gray-500'}`}>
                  {day.dayName}
                </span>
                <span className={`text-lg font-semibold ${day.isToday ? 'text-white' : 'text-gray-900'}`}>
                  {day.dayNum}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Today's Appointments
          </h2>

          {patients?.length > 0 ? (
            <div className="space-y-2">
              {patients
                .sort((a, b) => (a.scheduledTime || '99:99').localeCompare(b.scheduledTime || '99:99'))
                .map((patient) => (
                  <Card key={patient.id} padding="sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-primary-600 w-14">
                          {patient.scheduledTime}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatPatientName(patient)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {patient.primaryDiagnosis?.description}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          patient.visitStatus === 'completed'
                            ? 'success'
                            : patient.visitStatus === 'in_progress'
                            ? 'primary'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {patient.visitStatus === 'completed'
                          ? 'Done'
                          : patient.visitStatus === 'in_progress'
                          ? 'Active'
                          : 'Pending'}
                      </Badge>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No appointments scheduled
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
