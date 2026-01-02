export default function MedicationList({ medications }) {
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No medications recorded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((med, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-3"
        >
          <div className="font-medium text-gray-900">{med.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            {med.dosage} • {med.frequency} • {med.route}
          </div>
        </div>
      ))}
    </div>
  );
}
