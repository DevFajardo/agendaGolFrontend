import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export const FormField = ({
  label,
  type = "text",
  placeholder,
  error,
  register,
}: FormFieldProps) => (
  <div className="w-full space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      {...register}
      type={type}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-lg outline-none transition-all focus:ring-2 
        ${error ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-green-100 focus:border-green-500"}`}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);
