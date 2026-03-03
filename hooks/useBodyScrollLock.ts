import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean, paddingRight = "0px") {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = paddingRight;
      return () => {
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "0px";
      };
    }

    document.body.style.overflow = "unset";
    document.body.style.paddingRight = "0px";

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [locked, paddingRight]);
}
