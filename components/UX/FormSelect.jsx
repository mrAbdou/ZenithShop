'use client';
import { useFormContext } from "react-hook-form";
export default function FormSelect({
    name,
    label,
    options,
    className = '',
    multiple = false,
}) {
    const { register, formState: { errors } } = useFormContext();

    const hasError = !!errors[name];

    const selectClasses = `
    w-full px-4 py-4 border rounded-xl
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    outline-none text-gray-900
    ${multiple ? 'min-h-[100px]' : ''}
    ${hasError ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `.trim();
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-gray-800 mb-3">{label}</label>
            <select
                name={name}
                id={name}
                multiple={multiple}
                {...register(name)}
                className={selectClasses}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hasError && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
}