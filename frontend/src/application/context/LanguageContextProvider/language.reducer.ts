export interface LanguageState {
  language: string;
}

export type LanguageAction = { type: 'SET_LANGUAGE'; payload: string };

export const initialState: LanguageState = {
  language: 'en',
};

export function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}
