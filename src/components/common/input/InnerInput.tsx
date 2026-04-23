import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  loading?: boolean;
}

const InnerInput = ({ label, error, loading, className, ...props }: Props) => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full text-sm">
        <input
          className={`
       px-1 py-0.5 w-full bg-gray-100 outline-none
            ${
              error
                ? "border border-red-500 focus:border-red-600"
                : "border-blue-200 hover:border-blue-300"
            }
            ${loading ? "pr-6 opacity-70" : ""}
            ${className} 
          `}
          placeholder={label}
          {...props}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
            <div className="w-3 h-3 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>
      {error && (
        <span className="mt-0.5 text-[10px] text-red-500 font-medium leading-none">
          {error}
        </span>
      )}
    </div>
  );
};

export default InnerInput;
