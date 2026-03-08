'use client';

import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  error?: string;
  required?: boolean;
}

export default function ValidatedInput({
  label,
  icon: Icon,
  error,
  required,
  className = '',
  ...rest
}: Props) {
  return (
    <div className="relative">
      <label className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
        <span className="text-[11px] font-bold uppercase tracking-wide text-gray-700">
          {label}{required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <input
        className={`w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white shadow-sm placeholder:text-gray-300 transition ${className} ${error ? 'border-red-500' : ''}`}
        {...rest}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
