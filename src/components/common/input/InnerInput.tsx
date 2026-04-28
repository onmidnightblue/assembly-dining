import { InputHTMLAttributes, useEffect, useState } from "react";
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
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setLocalValue(value);
    setPrevValue(value);
  }

  const handleBlur = () => {
    if (validate && localValue !== "" && !validate(localValue)) {
      setLocalValue(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    const isValid = validate ? validate(newValue) : true;
    if (newValue === "" || isValid) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full text-sm">
        <input
          className={`
       px-1 py-0.5 w-full bg-gray-100 outline-none text-foreground
            ${
              error
                ? "border border-red-500 focus:border-red-600"
                : "border-blue-200 hover:border-blue-300"
            }
            ${loading ? "pr-6 opacity-70" : ""}
          `}
          value={localValue}
          placeholder={label}
          onChange={handleChange}
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
