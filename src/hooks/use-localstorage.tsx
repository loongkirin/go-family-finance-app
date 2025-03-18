"use client"

import { useState, useEffect } from "react"

const useLocalStorage = (key: any, defaultValue: string): [any, (v: any) => void] => {
  const [value, setValue] = useState<any>(defaultValue);

  useEffect(() => {
    const stickyValue = localStorage.getItem(key);
    if (stickyValue !== null) {
      setValue(stickyValue);
    }
  }, [key, setValue]);

  return [
    value,
    (v) => {
      localStorage.setItem(key, v);
      setValue(v);
    },
  ];
}

export default useLocalStorage;