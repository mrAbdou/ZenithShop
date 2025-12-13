'use client';

/**
 * Alert component for displaying notifications and messages
 * Matches the project's gradient design theme
 * 
 * @param {String} variant - Alert type: 'info', 'success', 'warning', 'danger'
 * @param {String} title - Alert title
 * @param {React.ReactNode} children - Alert message content
 * @param {Boolean} dismissible - Whether alert can be dismissed
 * @param {Function} onDismiss - Function to call when alert is dismissed
 * @param {React.ReactNode} icon - Optional custom icon
 * @param {String} className - Additional custom classes
 * @returns {JSX.Element}
 */
export default function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
}) {
  // Variant styles
  const variantStyles = {
    info: {
      container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    success: {
      container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    warning: {
      container: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      text: 'text-yellow-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    danger: {
      container: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-800',
      defaultIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        border-l-4 rounded-xl p-4 shadow-md
        ${styles.container}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icon || styles.defaultIcon}
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className={`font-bold text-sm mb-1 ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.text}`}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-75 transition-opacity`}
            aria-label="Dismiss alert"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}