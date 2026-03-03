import { useCallback, useState } from "react";

export type StatusFeedbackType = "success" | "error" | "info";

export interface StatusFeedbackState {
  show: boolean;
  type: StatusFeedbackType;
  msg: string;
}

export function useStatusFeedback(initialType: StatusFeedbackType = "info") {
  const [feedback, setFeedback] = useState<StatusFeedbackState>({
    show: false,
    type: initialType,
    msg: "",
  });

  const closeFeedback = useCallback(() => {
    setFeedback((prev) => ({ ...prev, show: false }));
  }, []);

  const showFeedback = useCallback((type: StatusFeedbackType, msg: string) => {
    setFeedback({ show: true, type, msg });
  }, []);

  const showSuccess = useCallback((msg: string) => {
    showFeedback("success", msg);
  }, [showFeedback]);

  const showError = useCallback((msg: string) => {
    showFeedback("error", msg);
  }, [showFeedback]);

  const showInfo = useCallback((msg: string) => {
    showFeedback("info", msg);
  }, [showFeedback]);

  return {
    feedback,
    closeFeedback,
    showFeedback,
    showSuccess,
    showError,
    showInfo,
  };
}
