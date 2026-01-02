import { isFieldChanged } from '../../hooks/usePolling';
import { formatBloodPressure, getVitalStatus, getVitalColorClass } from '../../utils/formatters';

function VitalBox({ label, value, unit, fieldPath, changedFields, status }) {
  const isChanged = isFieldChanged(changedFields, fieldPath);
  const colorClass = getVitalColorClass(status);

  return (
    <div
      className={`bg-gray-50 rounded-lg p-3 text-center border border-gray-100 ${
        isChanged ? 'field-updated' : ''
      }`}
    >
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className={`vitals-value ${colorClass}`}>
        {value ?? '--'}
      </div>
      {unit && <div className="text-xs text-gray-400 mt-0.5">{unit}</div>}
    </div>
  );
}

export default function VitalsPanel({ vitals, changedFields = [] }) {
  if (!vitals) {
    return (
      <div className="text-center text-gray-500 py-8">
        No vital signs recorded
      </div>
    );
  }

  const bpStatus = getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic);
  const hrStatus = getVitalStatus('heartRate', vitals.heartRate);
  const o2Status = getVitalStatus('oxygenSaturation', vitals.oxygenSaturation);
  const tempStatus = getVitalStatus('temperature', vitals.temperature);
  const glucoseStatus = getVitalStatus('bloodGlucose', vitals.bloodGlucose);

  return (
    <div className="space-y-3">
      {/* Row 1: BP, HR, O2 */}
      <div className="grid grid-cols-3 gap-3">
        <VitalBox
          label="BP"
          value={formatBloodPressure(vitals.bloodPressureSystolic, vitals.bloodPressureDiastolic)}
          unit="mmHg"
          fieldPath="vitalSigns.bloodPressureSystolic"
          changedFields={changedFields}
          status={bpStatus}
        />
        <VitalBox
          label="HR"
          value={vitals.heartRate}
          unit="bpm"
          fieldPath="vitalSigns.heartRate"
          changedFields={changedFields}
          status={hrStatus}
        />
        <VitalBox
          label="O2 Sat"
          value={vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : null}
          unit=""
          fieldPath="vitalSigns.oxygenSaturation"
          changedFields={changedFields}
          status={o2Status}
        />
      </div>

      {/* Row 2: Temp, Resp, Pain */}
      <div className="grid grid-cols-3 gap-3">
        <VitalBox
          label="Temp"
          value={vitals.temperature ? `${vitals.temperature}°${vitals.temperatureUnit || 'F'}` : null}
          unit=""
          fieldPath="vitalSigns.temperature"
          changedFields={changedFields}
          status={tempStatus}
        />
        <VitalBox
          label="Resp"
          value={vitals.respiratoryRate}
          unit="/min"
          fieldPath="vitalSigns.respiratoryRate"
          changedFields={changedFields}
          status="normal"
        />
        <VitalBox
          label="Pain"
          value={vitals.painLevel !== null && vitals.painLevel !== undefined ? vitals.painLevel : null}
          unit="/10"
          fieldPath="vitalSigns.painLevel"
          changedFields={changedFields}
          status="normal"
        />
      </div>

      {/* Row 3: Weight, Glucose */}
      <div className="grid grid-cols-2 gap-3">
        <VitalBox
          label="Weight"
          value={vitals.weight}
          unit={vitals.weightUnit || 'lbs'}
          fieldPath="vitalSigns.weight"
          changedFields={changedFields}
          status="normal"
        />
        <VitalBox
          label="Glucose"
          value={vitals.bloodGlucose}
          unit={vitals.glucoseUnit || 'mg/dL'}
          fieldPath="vitalSigns.bloodGlucose"
          changedFields={changedFields}
          status={glucoseStatus}
        />
      </div>
    </div>
  );
}
