import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClearFiltersButtonProps {
  areFiltersActive: boolean;
  clearFilters: () => void;
}

export function ClearFiltersButton({ areFiltersActive, clearFilters }: ClearFiltersButtonProps) {
  if (!areFiltersActive) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground">
            Clear
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Clear Filters</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}