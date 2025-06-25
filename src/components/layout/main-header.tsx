
'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFilter } from '@/hooks/use-filter';
import { LanguageSwitcher } from '../article/language-switcher';
import { CountrySwitcher } from '../article/country-switcher';
import { SidebarTrigger } from '../ui/sidebar';

export function MainHeader() {
  const { searchTerm, setSearchTerm } = useFilter();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 md:px-6">
       <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          className="w-full max-w-md pl-10 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CountrySwitcher />
      <LanguageSwitcher />
    </header>
  );
}
