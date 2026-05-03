export const pwRules = (pw: string) => ({
  minLength: pw.length >= 8,
  hasUpper: /[A-Z]/.test(pw),
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

// Password rules
export const PW_RULE_LABELS = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'hasUpper',  label: 'At least one uppercase letter' },
  { key: 'hasDigit',  label: 'At least one digit' },
  { key: 'hasSpecial', label: 'At least one special character (!@#$...)' },
] as const;

