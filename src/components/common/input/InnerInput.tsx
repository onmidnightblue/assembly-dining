import { InputHTMLAttributes, useState } from "react";
import SmallLoadingSpinner from "../loading/SmallLoadingSpinner";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string | null;
  loading?: boolean;
  value?: string;
  onChange: (value: string) => void;
  validate?: (value: string) => boolean;
}

const InnerInput = ({
  label,
  error,
  loading,
  value = "",
  onChange,
  validate,
  ...props
}: Props) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused ? localValue : value;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (validate && localValue !== "" && !validate(localValue)) {
      setLocalValue(value);
    }
    props.onBlur?.(e);
  };

  const handleFocus = () => {
    setLocalValue(value);
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (newValue === "" || !validate || validate(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full text-sm">
        <input
          className={`
       px-1 py-0.5 w-full bg-gray-100 outline-none text-foreground
            ${error ? "border border-error" : "border-blue-200"}
            ${loading ? "pr-6 opacity-70" : ""}
          `}
          value={displayValue}
          placeholder={label}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          {...props}
        />
        {loading && <SmallLoadingSpinner />}
      </div>
      {error && (
        <span className="mt-0.5 text-[10px] text-error font-medium leading-none">
          {error}
        </span>
      )}
    </div>
  );
};

export default InnerInput;
