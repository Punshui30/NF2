// src/contexts/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";

type State = {
  onboardingComplete: boolean;
  history: any[];
};

type Action =
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "RESET_ONBOARDING" }
  | { type: "ADD_TO_HISTORY"; payload: any };

const ONBOARD_KEY = "nf:onboardingComplete";
const HISTORY_KEY = "nf:history";

function loadBool(key: string, fallback = false) {
  try {
    const v = localStorage.getItem(key);
    return v === "true" ? true : v === "false" ? false : fallback;
  } catch {
    return fallback;
  }
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

const initialState: State = {
  onboardingComplete: loadBool(ONBOARD_KEY, false),
  history: loadJSON(HISTORY_KEY, [] as any[]),
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "COMPLETE_ONBOARDING": {
      try { localStorage.setItem(ONBOARD_KEY, "true"); } catch {}
      return { ...state, onboardingComplete: true };
    }
    case "RESET_ONBOARDING": {
      try { localStorage.setItem(ONBOARD_KEY, "false"); localStorage.removeItem(HISTORY_KEY); } catch {}
      return { ...state, onboardingComplete: false, history: [] };
    }
    case "ADD_TO_HISTORY": {
      const next = [action.payload, ...state.history];
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return { ...state, history: next };
    }
    default:
      return state;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Keep history in localStorage in case it was changed elsewhere
  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history)); } catch {}
  }, [state.history]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
};

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
