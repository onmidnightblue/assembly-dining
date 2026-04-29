import { SelectHTMLAttributes } from "react";
import SmallLoadingSpinner from "../loading/SmallLoadingSpinner";

type SelectOption = [string | number | boolean, string];

interface Props
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  options: SelectOption[];
  value?: string | number | boolean | null;
  error?: string | null;
  loading?: boolean;
  onChange: (value: string) => void;
}

const Select = ({
  options,
  value,
  error,
  loading,
  onChange,
  ...props
}: Props) => {
  const safeValue = value !== null && value !== undefined ? String(value) : "";

  return (
    <div>
      <select
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full text-sm bg-transparent outline-none cursor-pointer
          ${error ? "border border-red-500" : ""}
          `}
        {...props}
      >
        {options?.map(([value, label]) => (
          <option key={String(value)} value={String(value)}>
            {label}
          </option>
        ))}
      </select>
      {loading && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <SmallLoadingSpinner />
        </div>
      )}
      {error && (
        <span className="mt-0.5 text-[10px] text-error font-medium leading-none">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
