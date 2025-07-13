import React from 'react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 3) {
      return { score: 1, label: 'Weak', color: 'bg-red-500' };
    } else if (score < 5) {
      return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    } else {
      return { score: 3, label: 'Strong', color: 'bg-green-500' };
    }
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 3) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${
          strength.score === 1 ? 'text-red-600' :
          strength.score === 2 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      {password.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          <p>Password should contain:</p>
          <ul className="list-disc list-inside space-y-0.5 mt-1">
            <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              One uppercase letter
            </li>
            <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              One lowercase letter
            </li>
            <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
              One number
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
