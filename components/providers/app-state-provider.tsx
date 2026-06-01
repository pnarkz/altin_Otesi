"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  clearAiSettings,
  clearTestProgress,
  loadAiSettings,
  loadTestResult,
  saveAiSettings,
  saveTestResult,
} from "@/lib/storage";
import { AiSettings, TestResult } from "@/types";

type AppStateContextValue = {
  result: TestResult | null;
  aiSettings: AiSettings | null;
  isReady: boolean;
  setResult: (value: TestResult | null) => void;
  setAiSettings: (value: AiSettings | null) => void;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<TestResult | null>(null);
  const [aiSettings, setAiSettingsState] = useState<AiSettings | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setResultState(loadTestResult());
    setAiSettingsState(loadAiSettings());
    setIsReady(true);
  }, []);

  const setResult = (value: TestResult | null) => {
    setResultState(value);
    if (value) {
      saveTestResult(value);
      clearTestProgress();
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("altin-otesi-result");
    }
  };

  const setAiSettings = (value: AiSettings | null) => {
    setAiSettingsState(value);

    if (value?.apiKey.trim()) {
      saveAiSettings(value);
      return;
    }

    clearAiSettings();
  };

  return (
    <AppStateContext.Provider
      value={{ result, aiSettings, isReady, setResult, setAiSettings }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
