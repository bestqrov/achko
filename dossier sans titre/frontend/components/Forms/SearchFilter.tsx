'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (value: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  placeholder?: string;
  filters?: { key: string; label: string; options: { value: string; label: string }[] }[];
}

export default function SearchFilter({ onSearch, placeholder = 'Rechercher...', filters = [] }: SearchFilterProps) {
  const [search, setSearch] = useState('');

  const handleClear = () => {
    setSearch('');
    onSearch('');
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm shadow-sm">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); onSearch(e.target.value); }}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
        {search && (
          <button onClick={handleClear}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {filters.map((f) => (
        <select
          key={f.key}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary-500"
          onChange={(e) => {}}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
