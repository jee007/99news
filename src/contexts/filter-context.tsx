
'use client';

import type { Category } from '@/lib/types';
import React, { createContext, useState, ReactNode } from 'react';

interface FilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: Category | 'All';
  setCategory: (category: Category | 'All') => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');

  return (
    <FilterContext.Provider value={{ searchTerm, setSearchTerm, category, setCategory }}>
      {children}
    </FilterContext.Provider>
  );
}
