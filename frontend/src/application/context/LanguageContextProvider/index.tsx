import React, { useReducer, type ReactNode } from 'react';
import { LanguageContext, type LanguageState, type LanguageAction } from './LanguageContext';

const initialState: LanguageState = { language: 'en' };

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);
  return (
    <LanguageContext.Provider value={{ state, dispatch }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
