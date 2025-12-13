'use client';
import { useFormContext } from "react-hook-form";
/**
 * FormTextArea component designed to work inside FormProvider of react-hook-form
 * @param {String} name - The name of the textarea field
 * @param {String} label - The label of the textarea field
 * @param {String} placeholder - The placeholder of the textarea field
 * @param {String} icon - The icon of the textarea field
 * @param {String} className - The class name of the textarea field
 * @param {Number} rows - The number of rows of the textarea field
 * @param {Object} textareaProps - The props of the textarea field
 * @returns {JSX.Element}
 */
export default function FormTextArea({
    name,
    label,
    placeholder,
    icon,
    className = '',
    rows = 4,
    ...textareaProps
}) {
    const { register, formState: { errors } } = useFormContext();

    const hasError = !!errors[name];
    const hasIcon = !!icon;

    const textareaClasses = `
    w-full px-4 py-4 border rounded-xl
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    outline-none text-gray-900 placeholder:text-gray-500
    resize-none
    ${hasIcon ? 'pl-10' : ''}
    ${hasError ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-gray-800 mb-3">
                {label}
            </label>
            <div className="relative">
                {hasIcon && (
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                        {icon}
                    </div>
                )}
                <textarea
                    id={name}
                    placeholder={placeholder}
                    rows={rows}
                    {...register(name)}
                    className={textareaClasses}
                    {...textareaProps}
                />
            </div>
            {hasError && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
}
