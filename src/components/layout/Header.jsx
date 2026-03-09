import { useNavigate } from 'react-router-dom';

function DemoBanner() {
  return (
    <div className="bg-amber-500 text-amber-950 text-xs font-semibold text-center py-1 px-2">
      DEMO — Synthetic patient data only. Not for clinical use.
    </div>
  );
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  showSave = false,
  onSave,
  rightContent
}) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50">
      <DemoBanner />
      <header className="bg-primary-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="touch-target flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-700 transition-colors"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-medium text-primary-200 tracking-wider uppercase">Ratchet</span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold leading-tight">{title}</h1>
              {subtitle && (
                <p className="text-sm text-primary-100 leading-tight">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightContent}
            {showSave && (
              <button
                onClick={onSave}
                className="touch-target flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-700 transition-colors"
                aria-label="Save"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
