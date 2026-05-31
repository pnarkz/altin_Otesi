import { TestProgress, TestResult } from "@/types";

const RESULT_KEY = "altin-otesi-result";
const TEST_PROGRESS_KEY = "altin-otesi-test-progress";

export function saveTestResult(result: TestResult) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadTestResult(): TestResult | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(RESULT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TestResult;
  } catch {
    return null;
  }
}

export function clearTestResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESULT_KEY);
}

export function saveTestProgress(progress: TestProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEST_PROGRESS_KEY, JSON.stringify(progress));
}

export function loadTestProgress(): TestProgress | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(TEST_PROGRESS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TestProgress;
  } catch {
    return null;
  }
}

export function clearTestProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEST_PROGRESS_KEY);
}
