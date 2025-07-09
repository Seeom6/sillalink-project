// components/AuthFormInput.tsx
"use client";

import { forwardRef } from "react";

interface AuthFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthFormInput = forwardRef<HTMLInputElement, AuthFormInputProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`block w-full text-white rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } p-2 shadow-sm focus:border-primary focus:ring-primary`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

AuthFormInput.displayName = "AuthFormInput";