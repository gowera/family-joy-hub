import { isBefore, isSameDay, startOfDay } from "date-fns";

// Unity Circle sessions only happen on Saturdays.
// The very first session is Saturday 21 November 2026: until that day arrives,
// it is the only date a participant can pick. From that day on, upcoming
// Saturdays are open except for dates that are full.
export const FIRST_UNITY_CIRCLE_DATE = new Date(2026, 10, 21);
export const FULL_UNITY_CIRCLE_DATE = new Date(2026, 10, 28);
export const FIRST_UNITY_CIRCLE_DATE_AFTER_BREAK = new Date(2027, 0, 2);
export const UNITY_CIRCLE_WEEKDAY = 6; // 0 = Sunday ... 6 = Saturday

export const isUnityCircleFullDate = (date: Date): boolean =>
  isSameDay(date, FULL_UNITY_CIRCLE_DATE);

export const isUnityCircleSessionDate = (date: Date, now: Date = new Date()): boolean => {
  if (isUnityCircleFullDate(date)) return false;
  if (date.getFullYear() === 2026 && date.getMonth() === 11) return false;

  const today = startOfDay(now);
  const firstSession = startOfDay(FIRST_UNITY_CIRCLE_DATE);

  if (isBefore(today, firstSession)) {
    return isSameDay(date, firstSession);
  }

  return date.getDay() === UNITY_CIRCLE_WEEKDAY && !isBefore(startOfDay(date), today);
};

export const unityCircleDateHint = (now: Date = new Date()): string => {
  const today = startOfDay(now);

  if (isBefore(today, startOfDay(FIRST_UNITY_CIRCLE_DATE))) {
    return "Unity Circle sessions run on Saturdays only. The next available date is Saturday 21 November 2026. Saturday 28 November 2026 is FULL — all places are taken, so please choose another Saturday.";
  }

  if (isBefore(today, startOfDay(FIRST_UNITY_CIRCLE_DATE_AFTER_BREAK))) {
    return "Unity Circle is closed for the month of December. Activities resume on Saturday 2 January 2027.";
  }

  return "Unity Circle sessions run on Saturdays only. Saturday 28 November 2026 is FULL — all places are taken, so please choose another available Saturday.";
};
