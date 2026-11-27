import { expect, test } from "bun:test";
import { FIRST_UNITY_CIRCLE_DATE, FIRST_UNITY_CIRCLE_DATE_AFTER_BREAK, FULL_UNITY_CIRCLE_DATE, isUnityCircleFullDate, isUnityCircleSessionDate, unityCircleDateHint } from "./unityCircleDates";

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

test("after 21 Nov 2026 upcoming Saturdays are open except the full date", () => {
  const now = day(2026, 11, 25); // Wednesday
  expect(isUnityCircleSessionDate(day(2026, 11, 28), now)).toBe(false);
  expect(isUnityCircleSessionDate(day(2027, 1, 2), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2027, 3, 6), now)).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 11, 26), now)).toBe(false); // Thursday
  expect(isUnityCircleSessionDate(day(2026, 11, 21), now)).toBe(false); // already past
});

test("all dates in December 2026 are blocked during the break", () => {
  const now = day(2026, 11, 23);
  for (let date = 1; date <= 31; date += 1) {
    expect(isUnityCircleSessionDate(day(2026, 12, date), now)).toBe(false);
  }
  expect(isUnityCircleSessionDate(FIRST_UNITY_CIRCLE_DATE_AFTER_BREAK, now)).toBe(true);
});

test("28 Nov 2026 is full and cannot be selected", () => {
  const now = day(2026, 11, 23);
  expect(isUnityCircleFullDate(day(2026, 11, 28))).toBe(true);
  expect(isUnityCircleSessionDate(day(2026, 11, 28), now)).toBe(false);
  expect(FULL_UNITY_CIRCLE_DATE.getDay()).toBe(6);
});

test("the hint names the single opening date while it is still ahead", () => {
  expect(unityCircleDateHint(day(2026, 11, 11))).toContain("Saturday 21 November 2026");
  expect(unityCircleDateHint(day(2026, 11, 25))).toBe(
    "Unity Circle is closed for the month of December. Activities resume on Saturday 2 January 2027.",
  );
});

test("the first session date really is a Saturday", () => {
  expect(FIRST_UNITY_CIRCLE_DATE.getDay()).toBe(6);
});
