'use client';

/**
 * Loading spinner component with multiple variants
 * Matches the project's gradient design theme
 * 
 * @param {String} size - Spinner size: 'sm', 'md', 'lg', 'xl'
 * @param {String} variant - Spinner color: 'primary', 'white', 'gray'
 * @param {String} text - Optional loading text to display
 * @param {Boolean} fullScreen - Whether to show as full-screen overlay
 * @param {String} className - Additional custom classes
 * @returns {JSX.Element}
 */
export default function Spinner({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className = '',
}) {
  // Size styles
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Variant styles
  const variantStyles = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  const spinnerElement = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Spinner SVG */}
      <svg
        className={`animate-spin ${sizeStyles[size]} ${variantStyles[variant]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      {/* Loading text */}
      {text && (
        <p className={`text-sm font-medium ${variantStyles[variant]}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}