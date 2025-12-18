'use client';
import { useFormContext } from "react-hook-form";
/**
 * FormInput component designed to work inside FormProvider of react-hook-form
 * @param {String} name - The name of the input field
 * @param {String} label - The label of the input field
 * @param {String} type - The type of the input field, has default value of 'text'
 * @param {String} placeholder - The placeholder of the input field
 * @param {String} icon - The icon of the input field
 * @param {String} className - The class name of the input field
 * @param {Object} inputProps - The props of the input field
 * @returns {JSX.Element}
 */
export default function FormInput({
    name,
    label,
    type = 'text',
    placeholder,
    icon,
    className = '',
    ...inputProps
}) {
    const { register, formState: { errors } } = useFormContext();

    const hasError = !!errors[name];
    const hasIcon = !!icon;
    // this is used a default class design for the input field
    const inputClasses = `
    w-full px-4 py-4 border rounded-xl
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    outline-none text-gray-900 placeholder:text-gray-500
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
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                    className={className ? className : inputClasses}
                    {...inputProps}
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
