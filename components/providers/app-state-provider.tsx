"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clearTestProgress, loadTestResult, saveTestResult } from "@/lib/storage";
import { TestResult } from "@/types";

type AppStateContextValue = {
  result: TestResult | null;
  isReady: boolean;
  setResult: (value: TestResult | null) => void;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<TestResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setResultState(loadTestResult());
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

  return <AppStateContext.Provider value={{ result, isReady, setResult }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
