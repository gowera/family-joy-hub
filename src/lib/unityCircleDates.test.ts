import { expect, test } from "bun:test";
import { FIRST_UNITY_CIRCLE_DATE, isUnityCircleSessionDate, unityCircleDateHint } from "./unityCircleDates";

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

test("before 21 Nov 2026 only Saturday 21 November is open", () => {
  const now = day(2026, 11, 11); // Wednesday
  expect(isUnityCircleSessionDate(day(2026, 11, 21), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 11, 14), now)).toBe(false); // earlier Saturday
  expect(isUnityCircleSessionDate(day(2026, 11, 28), now)).toBe(false); // later Saturday
  expect(isUnityCircleSessionDate(day(2026, 11, 12), now)).toBe(false); // next day, a Thursday
});

test("on 21 Nov 2026 that Saturday is still open, the day after is not", () => {
  const now = day(2026, 11, 21);
  expect(isUnityCircleSessionDate(day(2026, 11, 21), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 11, 22), now)).toBe(false);
});

test("after 21 Nov 2026 every upcoming Saturday is open and no other weekday is", () => {
  const now = day(2026, 11, 25); // Wednesday
  expect(isUnityCircleSessionDate(day(2026, 11, 28), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 12, 5), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2027, 3, 6), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 11, 26), now)).toBe(false); // Thursday
  expect(isUnityCircleSessionDate(day(2026, 11, 21), now)).toBe(false); // already past
});

test("the hint names the single opening date while it is still ahead", () => {
  expect(unityCircleDateHint(day(2026, 11, 11))).toContain("Saturday 21 November 2026");
  expect(unityCircleDateHint(day(2026, 11, 25))).not.toContain("Saturday 21 November 2026");
});

test("the first session date really is a Saturday", () => {
  expect(FIRST_UNITY_CIRCLE_DATE.getDay()).toBe(6);
});
