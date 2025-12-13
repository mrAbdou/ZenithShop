'use client';

/**
 * Card component matching the project's design theme
 * Used for containing content with consistent styling
 * 
 * @param {React.ReactNode} children - Card content
 * @param {String} variant - Card style: 'default', 'gradient', 'bordered'
 * @param {Boolean} hoverable - Whether card should have hover effects
 * @param {String} padding - Padding size: 'sm', 'md', 'lg', 'xl'
 * @param {String} className - Additional custom classes
 * @param {Object} props - Additional div props
 * @returns {JSX.Element}
 */
export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'bg-white rounded-2xl transition-all duration-300';

  // Variant styles
  const variantStyles = {
    default: 'border border-gray-200 shadow-md',
    gradient: 'shadow-xl relative overflow-hidden',
    bordered: 'border-2 border-gray-300 shadow-sm',
  };

  // Hover styles
  const hoverStyles = hoverable
    ? 'hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 cursor-pointer'
    : '';

  // Padding styles
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const cardClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${hoverStyles}
    ${paddingStyles[padding]}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} {...props}>
      {/* Gradient overlay for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full -z-10"></div>
      )}

      {/* Decorative bottom border for hoverable cards */}
      {hoverable && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      )}

      {children}
    </div>
  );
}