import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { LoadingScreen } from '../components/common/LoadingSpinner';
import DataRefreshIndicator from '../components/demo/DataRefreshIndicator';
import VitalsPanel from '../components/clinical/VitalsPanel';
import SOAPNote from '../components/clinical/SOAPNote';
import MedicationList from '../components/clinical/MedicationList';
import InterventionChecklist from '../components/clinical/InterventionChecklist';
import EducationChecklist from '../components/clinical/EducationChecklist';
import { useVisit } from '../hooks/useVisits';
import { usePatient } from '../hooks/usePatients';
import { formatDate, formatPatientName, formatTime } from '../utils/formatters';
import { VISIT_TYPES } from '../utils/constants';
import { isFieldChanged } from '../hooks/usePolling';

const TABS = [
  { id: 'vitals', label: 'Vitals' },
  { id: 'soap', label: 'SOAP' },
  { id: 'meds', label: 'Meds' },
  { id: 'plan', label: 'Plan' },
  { id: 'education', label: 'Ed' },
];

function TabBar({ activeTab, onTabChange, changedFields }) {
  return (
    <div className="flex bg-white border-b border-gray-200 overflow-x-auto">
      {TABS.map((tab) => {
        const hasChanges = changedFields.some(field => {
          if (tab.id === 'vitals') return field.startsWith('vitalSigns');
          if (tab.id === 'soap') return ['subjective', 'objective', 'assessment', 'plan'].some(s => field.startsWith(s));
          if (tab.id === 'plan') return field.startsWith('interventions');
          if (tab.id === 'education') return field.startsWith('education');
          return false;
        });

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium text-center whitespace-nowrap transition-colors touch-target relative ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {hasChanges && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-warning rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function TimeFields({ visit, changedFields }) {
  const timeInChanged = isFieldChanged(changedFields, 'timeIn');
  const timeOutChanged = isFieldChanged(changedFields, 'timeOut');
  const nextVisitChanged = isFieldChanged(changedFields, 'nextVisitDate');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
      <div className="grid grid-cols-3 gap-4">
        <div className={timeInChanged ? 'field-updated rounded p-2 -m-2' : ''}>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Time In
          </div>
          <div className="font-mono font-semibold text-gray-900">
            {formatTime(visit?.timeIn)}
          </div>
        </div>
        <div className={timeOutChanged ? 'field-updated rounded p-2 -m-2' : ''}>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Time Out
          </div>
          <div className="font-mono font-semibold text-gray-900">
            {formatTime(visit?.timeOut)}
          </div>
        </div>
        <div className={nextVisitChanged ? 'field-updated rounded p-2 -m-2' : ''}>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Next Visit
          </div>
          <div className="font-semibold text-gray-900 text-sm">
            {visit?.nextVisitDate ? formatDate(visit.nextVisitDate) : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisitDocumentation() {
  const { visitId } = useParams();
  const [activeTab, setActiveTab] = useState('vitals');

  const { data: visit, loading: visitLoading, lastUpdate, changedFields } = useVisit(visitId);
  const { data: patient } = usePatient(visit?.patientId);

  if (visitLoading || !visit) {
    return <LoadingScreen message="Loading visit..." />;
  }

  const visitType = VISIT_TYPES[visit.visitType] || visit.visitType;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vitals':
        return (
          <div className="space-y-4">
            <VitalsPanel vitals={visit.vitalSigns} changedFields={changedFields} />
            <TimeFields visit={visit} changedFields={changedFields} />
          </div>
        );
      case 'soap':
        return <SOAPNote visit={visit} changedFields={changedFields} />;
      case 'meds':
        return <MedicationList medications={patient?.medications} />;
      case 'plan':
        return <InterventionChecklist interventions={visit.interventions} changedFields={changedFields} />;
      case 'education':
        return <EducationChecklist education={visit.education} changedFields={changedFields} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header
        title={`Visit Note - ${patient ? formatPatientName(patient, 'initials') : ''}`}
        subtitle={`${formatDate(visit.visitDate)} | ${visitType}`}
        showBack
        showSave
        onSave={() => alert('Save functionality - demo only')}
      />

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        changedFields={changedFields}
      />

      <main className="p-4">
        {renderTabContent()}
      </main>

      <DataRefreshIndicator lastUpdate={lastUpdate} />
    </div>
  );
}
