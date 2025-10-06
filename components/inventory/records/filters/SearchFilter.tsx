import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Command } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function SearchFilter({ searchTerm, setSearchTerm }: SearchFilterProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="xl:col-span-2">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Search Record
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search by Products, RecordId .."
          className="pl-10 pr-20 h-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs text-muted-foreground bg-muted border rounded px-2 py-0.5 h-5">
          <Command className="w-3.5 h-3.5" />
          <span className="font-mono text-[0.7rem]">K</span>
        </div>
      </div>
    </div>
  );
}