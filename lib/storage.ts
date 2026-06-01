import {
  AcademyProgress,
  AiSettings,
  AuthSession,
  CoachMessage,
  ProducerRecord,
  ScamCheckRecord,
  SavingsState,
  TestProgress,
  TestResult,
  TwinProgress,
} from "@/types";

const RESULT_KEY = "altin-otesi-result";
const TEST_PROGRESS_KEY = "altin-otesi-test-progress";
const ACADEMY_PROGRESS_KEY = "altin-otesi-academy-progress";
const SAVINGS_STATE_KEY = "altin-otesi-savings-state";
const SCAM_HISTORY_KEY = "altin-otesi-scam-history";
const AI_SETTINGS_KEY = "altin-otesi-ai-settings";
const PRODUCER_HISTORY_KEY = "altin-otesi-producer-history";
const TWIN_PROGRESS_KEY = "altin-otesi-twin-progress";
const COACH_MESSAGES_KEY = "altin-otesi-coach-messages";
const AUTH_SESSION_KEY = "altin-otesi-auth-session";

function loadJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function saveTestResult(result: TestResult) {
  saveJson(RESULT_KEY, result);
}

export function loadTestResult(): TestResult | null {
  return loadJson<TestResult>(RESULT_KEY);
}

export function clearTestResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESULT_KEY);
}

export function saveTestProgress(progress: TestProgress) {
  saveJson(TEST_PROGRESS_KEY, progress);
}

export function loadTestProgress(): TestProgress | null {
  return loadJson<TestProgress>(TEST_PROGRESS_KEY);
}

export function clearTestProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TEST_PROGRESS_KEY);
}

export function saveAcademyProgress(progress: AcademyProgress) {
  saveJson(ACADEMY_PROGRESS_KEY, progress);
}

export function loadAcademyProgress(): AcademyProgress | null {
  return loadJson<AcademyProgress>(ACADEMY_PROGRESS_KEY);
}

export function clearAcademyProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACADEMY_PROGRESS_KEY);
}

export function saveSavingsState(state: SavingsState) {
  saveJson(SAVINGS_STATE_KEY, state);
}

export function loadSavingsState(): SavingsState | null {
  return loadJson<SavingsState>(SAVINGS_STATE_KEY);
}

export function clearSavingsState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAVINGS_STATE_KEY);
}

export function saveScamHistory(history: ScamCheckRecord[]) {
  saveJson(SCAM_HISTORY_KEY, history);
}

export function loadScamHistory(): ScamCheckRecord[] {
  return loadJson<ScamCheckRecord[]>(SCAM_HISTORY_KEY) ?? [];
}

export function clearScamHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SCAM_HISTORY_KEY);
}

export function saveAiSettings(settings: AiSettings) {
  saveJson(AI_SETTINGS_KEY, settings);
}

export function loadAiSettings(): AiSettings | null {
  return loadJson<AiSettings>(AI_SETTINGS_KEY);
}

export function clearAiSettings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AI_SETTINGS_KEY);
}

export function saveProducerHistory(history: ProducerRecord[]) {
  saveJson(PRODUCER_HISTORY_KEY, history);
}

export function loadProducerHistory(): ProducerRecord[] {
  return loadJson<ProducerRecord[]>(PRODUCER_HISTORY_KEY) ?? [];
}

export function clearProducerHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRODUCER_HISTORY_KEY);
}

export function saveTwinProgress(progress: TwinProgress) {
  saveJson(TWIN_PROGRESS_KEY, progress);
}

export function loadTwinProgress(): TwinProgress | null {
  return loadJson<TwinProgress>(TWIN_PROGRESS_KEY);
}

export function clearTwinProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TWIN_PROGRESS_KEY);
}

export function saveCoachMessages(messages: CoachMessage[]) {
  saveJson(COACH_MESSAGES_KEY, messages);
}

export function loadCoachMessages(): CoachMessage[] {
  return loadJson<CoachMessage[]>(COACH_MESSAGES_KEY) ?? [];
}

export function clearCoachMessages() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COACH_MESSAGES_KEY);
}

export function saveAuthSession(session: AuthSession) {
  saveJson(AUTH_SESSION_KEY, session);
}

export function loadAuthSession(): AuthSession | null {
  return loadJson<AuthSession>(AUTH_SESSION_KEY);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
