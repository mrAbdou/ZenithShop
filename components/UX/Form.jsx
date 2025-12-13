'use client';
import { FormProvider } from 'react-hook-form';

/**
 * Form wrapper component that provides react-hook-form context
 * Works with FormInput, FormTextArea and other form components
 * Matches the project's design theme with gradient styling
 * 
 * @param {Object} form - react-hook-form instance from useForm()
 * @param {Function} onSubmit - Form submission handler
 * @param {React.ReactNode} children - Form fields and content
 * @param {String} title - Optional form title
 * @param {String} description - Optional form description
 * @param {Boolean} showHeader - Whether to show the header section
 * @param {React.ReactNode} headerIcon - Optional icon for header
 * @param {String} className - Additional custom classes
 * @returns {JSX.Element}
 */
export default function Form({
  form,
  onSubmit,
  children,
  title,
  description,
  showHeader = true,
  headerIcon,
  className = '',
}) {
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 ${className}`}>
      {/* Header */}
      {showHeader && (title || description) && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            {headerIcon && (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                {headerIcon}
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-600">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
        </form>
      </FormProvider>
    </div>
  );
}