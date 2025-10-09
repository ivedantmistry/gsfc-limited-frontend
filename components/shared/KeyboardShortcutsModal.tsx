"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Command, Plus } from "lucide-react";
import React from "react";

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-slate-100 px-2 font-mono text-sm font-medium text-slate-600 opacity-100">
    {children}
  </kbd>
);

const ShortcutItem = ({
  label,
  keys,
  icon: Icon,
}: {
  label: string;
  keys: string[];
  icon: React.ElementType;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100">
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-slate-500" />
      <span className="text-sm text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Kbd>{key}</Kbd>
          {index < keys.length - 1 && <span>+</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export function KeyboardShortcutsModal() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>
          Use these shortcuts to navigate the app more efficiently.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-2 py-4">
        <ShortcutItem
          label="Create New Record"
          keys={["Ctrl", "I"]}
          icon={Plus}
        />
        <ShortcutItem label="Search" keys={["Ctrl", "K"]} icon={Command} />
      </div>
    </DialogContent>
  );
}
