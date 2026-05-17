import { createContext } from 'react';
import type React from 'react';

export interface LanguageState {
  language: string;
}

export type LanguageAction = { type: 'SET_LANGUAGE'; payload: string };

export const LanguageContext = createContext<{
  state: LanguageState;
  dispatch: React.Dispatch<LanguageAction>;
} | null>(null);

