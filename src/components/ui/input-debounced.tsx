"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type InputDebouncedProps = {
  value: string | readonly string[] | number | undefined;
  onChange: (value: string | readonly string[] | number | undefined) => void;
  debounceTime?: number;
} & Omit<React.ComponentProps<"input">, "onChange">;

function InputDebounced({ debounceTime = 500, value : initialValue, onChange, ...props }: InputDebouncedProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTime);
    return () => clearTimeout(timeout)
  }, [initialValue, debounceTime]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export { InputDebounced };