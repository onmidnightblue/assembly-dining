import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
}

const Input = ({ label, error, loading, ...props }: Props) => {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {label && <label className="text-sm text-gray-500">{label}</label>}
      <div className="relative">
        <input
          className={`w-full p-2 outline-none transition-all focus:ring-1 rounded border border-gray-400 ${
            error
              ? "border-red-600  focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
          {...props}
        />
        {loading && (
          <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
