import React from 'react';
import { Check, X } from 'lucide-react';
import { pwRules, PW_RULE_LABELS } from '../../../infrastructure/utils/passwordUtils';

interface PasswordRulesProps {
  password: string;
}

// show pass rules
const PasswordRules: React.FC<PasswordRulesProps> = ({ password }) => {
  if (!password) return null;
  const rules = pwRules(password);
  return (
    <ul className="mt-2 space-y-0.5 text-xs">
      {PW_RULE_LABELS.map(r => (
        <li key={r.key} className={`flex items-center gap-1.5 ${rules[r.key] ? 'text-green-500' : 'text-gray-400'}`}>
          {rules[r.key] ? <Check size={12} /> : <X size={12} />} {r.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordRules;

