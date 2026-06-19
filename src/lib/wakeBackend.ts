import { supabase } from "@/integrations/supabase/client";

let lastWake = 0;
const WAKE_INTERVAL = 60_000; // 1 min

/**
 * Pings the backend with a lightweight query to wake it up if paused/sleeping.
 * Throttled to avoid spamming. Safe to call frequently.
 */
export const wakeBackend = async (force = false): Promise<void> => {
  const now = Date.now();
  if (!force && now - lastWake < WAKE_INTERVAL) return;
  lastWake = now;
  try {
    // Lightweight HEAD-like query to wake the database
    await supabase.from("survey_responses").select("id", { count: "exact", head: true });
  } catch {
    // Swallow — best effort
  }
};
