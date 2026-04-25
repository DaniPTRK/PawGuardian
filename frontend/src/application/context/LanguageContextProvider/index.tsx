import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

interface LanguageState {
  language: string;
}

type LanguageAction = { type: 'SET_LANGUAGE'; payload: string };

const initialState: LanguageState = {
  language: 'en',
};

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

const LanguageContext = createContext<{
  state: LanguageState;
  dispatch: React.Dispatch<LanguageAction>;
} | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  return (
    <LanguageContext.Provider value={{ state, dispatch }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
