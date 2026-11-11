import { isBefore, isSameDay, startOfDay } from "date-fns";

// Unity Circle sessions only happen on Saturdays.
// The very first session is Saturday 21 November 2026: until that day arrives,
// it is the only date a participant can pick. From that day on, every Saturday
// that has not passed yet is open.
export const FIRST_UNITY_CIRCLE_DATE = new Date(2026, 10, 21);
export const UNITY_CIRCLE_WEEKDAY = 6; // 0 = Sunday ... 6 = Saturday

export const isUnityCircleSessionDate = (date: Date, now: Date = new Date()): boolean => {
  const today = startOfDay(now);
  const firstSession = startOfDay(FIRST_UNITY_CIRCLE_DATE);

  if (isBefore(today, firstSession)) {
    return isSameDay(date, firstSession);
  }

  return date.getDay() === UNITY_CIRCLE_WEEKDAY && !isBefore(startOfDay(date), today);
};

export const unityCircleDateHint = (now: Date = new Date()): string =>
  isBefore(startOfDay(now), startOfDay(FIRST_UNITY_CIRCLE_DATE))
    ? "Unity Circle sessions run on Saturdays only. The next available date is Saturday 21 November 2026."
    : "Unity Circle sessions run on Saturdays only. Pick the Saturday that works for you and your family.";
