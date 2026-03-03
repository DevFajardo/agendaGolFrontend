import { useCallback, useEffect, useRef, useState } from "react";
import type { StatusFeedbackState, StatusFeedbackType } from "./useStatusFeedback";

export function useTimedStatusFeedback(defaultDuration = 3000) {
  const [feedback, setFeedback] = useState<StatusFeedbackState>({
    show: false,
    type: "info",
    msg: "",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeFeedback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setFeedback((prev) => ({ ...prev, show: false }));
  }, []);

  const showFeedback = useCallback(
    (type: StatusFeedbackType, msg: string, duration = defaultDuration) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setFeedback({ show: true, type, msg });
      timerRef.current = setTimeout(() => {
        setFeedback((prev) => ({ ...prev, show: false }));
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration],
  );

  const showSuccess = useCallback(
    (msg: string, duration?: number) => {
      showFeedback("success", msg, duration);
    },
    [showFeedback],
  );

  const showError = useCallback(
    (msg: string, duration?: number) => {
      showFeedback("error", msg, duration);
    },
    [showFeedback],
  );

  const showInfo = useCallback(
    (msg: string, duration?: number) => {
      showFeedback("info", msg, duration);
    },
    [showFeedback],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    feedback,
    closeFeedback,
    showFeedback,
    showSuccess,
    showError,
    showInfo,
  };
}
