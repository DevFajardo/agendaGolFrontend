import { useCallback, useEffect, useRef, useState } from "react";

export function useTimedMessage(defaultDuration = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
  }, []);

  const show = useCallback(
    (value: string, duration = defaultDuration) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setMessage(value);
      timerRef.current = setTimeout(() => {
        setMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    message,
    show,
    clear,
    setMessage,
  };
}
