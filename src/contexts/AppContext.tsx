import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserProfile, AnalysisResult } from '../types';

interface AppState {
  user: UserProfile | null;
  isLoading: boolean;
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  onboardingComplete: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ANALYSIS'; payload: AnalysisResult }
  | { type: 'ADD_TO_HISTORY'; payload: AnalysisResult }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  isLoading: false,
  currentAnalysis: null,
  history: [],
  onboardingComplete: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};