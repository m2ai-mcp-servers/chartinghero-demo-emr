import { useState } from 'react';
import { isFieldChanged } from '../../hooks/usePolling';

function SOAPSection({ title, content, fieldPath, changedFields, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isChanged = isFieldChanged(changedFields, fieldPath);

  return (
    <div className={`border-b border-gray-100 last:border-b-0 ${isChanged ? 'field-updated' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 transition-colors touch-target"
      >
        <span className="font-semibold text-gray-800 uppercase text-sm tracking-wide">
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {content ? (
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <p className="text-gray-400 text-sm italic">No information recorded</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SOAPNote({ visit, changedFields = [] }) {
  if (!visit) {
    return (
      <div className="text-center text-gray-500 py-8">
        No SOAP note recorded
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <SOAPSection
        title="Subjective"
        content={visit.subjective}
        fieldPath="subjective"
        changedFields={changedFields}
      />
      <SOAPSection
        title="Objective"
        content={visit.objective}
        fieldPath="objective"
        changedFields={changedFields}
      />
      <SOAPSection
        title="Assessment"
        content={visit.assessment}
        fieldPath="assessment"
        changedFields={changedFields}
      />
      <SOAPSection
        title="Plan"
        content={visit.plan}
        fieldPath="plan"
        changedFields={changedFields}
      />
    </div>
  );
}
