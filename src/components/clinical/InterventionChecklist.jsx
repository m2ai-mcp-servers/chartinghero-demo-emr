import { isFieldChanged } from '../../hooks/usePolling';

function ChecklistItem({ item, index, fieldPath, changedFields }) {
  const isChanged = isFieldChanged(changedFields, `${fieldPath}.${index}`);

  return (
    <div
      className={`flex items-start gap-3 py-2 ${isChanged ? 'field-updated rounded px-2 -mx-2' : ''}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {item.completed ? (
          <div className="w-5 h-5 rounded bg-success flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white" />
        )}
      </div>
      <span className={`text-sm ${item.completed ? 'text-gray-700' : 'text-gray-500'}`}>
        {item.description}
      </span>
    </div>
  );
}

export default function InterventionChecklist({ interventions, changedFields = [] }) {
  if (!interventions || interventions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No interventions recorded
      </div>
    );
  }

  const completed = interventions.filter(i => i.completed).length;
  const total = interventions.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Interventions Performed
        </h3>
        <span className="text-sm text-gray-500">
          {completed}/{total} completed
        </span>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="divide-y divide-gray-100">
          {interventions.map((item, index) => (
            <ChecklistItem
              key={item.code || index}
              item={item}
              index={index}
              fieldPath="interventions"
              changedFields={changedFields}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
