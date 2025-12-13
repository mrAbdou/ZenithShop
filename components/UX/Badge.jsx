'use client';

/**
 * Badge component for labels, status indicators, and tags
 * Matches the project's gradient design theme
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {String} variant - Badge color: 'primary', 'success', 'danger', 'warning', 'info', 'neutral'
 * @param {String} size - Badge size: 'sm', 'md', 'lg'
 * @param {Boolean} rounded - Whether badge should be fully rounded (pill shape)
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {String} className - Additional custom classes
 * @returns {JSX.Element}
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  icon,
  className = '',
}) {
  // Variant styles matching the project theme
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const roundedStyle = rounded ? 'rounded-full' : 'rounded-lg';

  const badgeClasses = `
    inline-flex items-center gap-1.5 font-bold
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${roundedStyle}
    ${className}
  `.trim();

  return (
    <span className={badgeClasses}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}