'use client';

/**
 * Button component with multiple variants matching the project's design theme
 * 
 * @param {String} variant - Button style variant: 'primary', 'secondary', 'danger', 'success', 'outline'
 * @param {String} size - Button size: 'sm', 'md', 'lg'
 * @param {Boolean} fullWidth - Whether button should take full width
 * @param {Boolean} disabled - Whether button is disabled
 * @param {Boolean} loading - Whether button is in loading state
 * @param {React.ReactNode} icon - Optional icon to display before text
 * @param {React.ReactNode} children - Button content
 * @param {String} className - Additional custom classes
 * @param {Object} props - Additional button props
 * @returns {JSX.Element}
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  children,
  className = '',
  ...props
}) {
  // Base styles shared across all variants
  const baseStyles = `
    relative overflow-hidden font-semibold transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  `.trim();

  // Variant styles matching the project theme
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 
      hover:from-blue-700 hover:to-indigo-700 
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-500
      ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
    `.trim(),
    
    secondary: `
      bg-gradient-to-r from-slate-700 to-slate-800 
      hover:from-slate-800 hover:to-slate-900 
      text-white shadow-md hover:shadow-lg
      focus:ring-slate-500
      ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
    `.trim(),
    
    danger: `
      bg-gradient-to-r from-red-500 to-orange-500 
      hover:from-red-600 hover:to-orange-600 
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
      ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
    `.trim(),
    
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 
      hover:from-green-600 hover:to-emerald-600 
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-500
      ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
    `.trim(),
    
    outline: `
      bg-white border-2 border-gray-300 
      hover:border-blue-500 hover:bg-blue-50
      text-gray-700 hover:text-blue-600
      focus:ring-blue-500
      ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
    `.trim(),
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect on hover for gradient buttons */}
      {(variant === 'primary' || variant === 'secondary' || variant === 'danger' || variant === 'success') && !disabled && !loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      )}

      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
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
      )}

      {/* Icon */}
      {icon && !loading && <span className="relative">{icon}</span>}

      {/* Button text */}
      <span className="relative">{children}</span>
    </button>
  );
}