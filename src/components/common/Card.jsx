export default function Card({
  children,
  className = '',
  onClick,
  padding = 'md',
  statusColor,
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden
        ${paddingClasses[padding]}
        ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-primary-200 active:bg-gray-50 transition-all touch-target' : ''}
        ${statusColor ? 'border-l-4' : ''}
        ${className}
      `}
      style={statusColor ? { borderLeftColor: statusColor } : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`font-semibold text-gray-900 mb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardSection({ title, children, className = '' }) {
  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
