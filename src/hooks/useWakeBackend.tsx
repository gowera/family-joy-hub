import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { wakeBackend } from "@/lib/wakeBackend";

/**
 * Wakes the backend on initial load, on route changes,
 * and when the tab becomes visible again.
 */
const useWakeBackend = () => {
  const location = useLocation();

  useEffect(() => {
    wakeBackend();
  }, [location.pathname]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") wakeBackend(true);
    };
    const onOnline = () => wakeBackend(true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);
    wakeBackend(true);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, []);
};

export default useWakeBackend;
