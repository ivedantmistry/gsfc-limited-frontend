"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Edit } from "lucide-react";

interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => Promise<void>;
  fieldName: string;
  canEdit: boolean;
  textClass?: string;
  inputClass?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  onSave,
  fieldName,
  canEdit,
  textClass = "text-3xl font-bold tracking-tight text-slate-900",
  inputClass = "text-3xl font-bold",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    if (value === initialValue || value.trim() === "") {
      setIsEditing(false);
      setValue(initialValue);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error(`Failed to save ${fieldName}:`, error);
      // Optionally, show a toast notification with the error
      setValue(initialValue); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(initialValue);
  };

  if (!canEdit) {
    return <h1 className={textClass}>{value}</h1>;
  }

  return (
    <div className="flex items-center gap-2 group">
      {isEditing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className={`bg-white ring-2 ring-indigo-500 rounded-md p-1 -m-1 focus:outline-none ${inputClass}`}
            disabled={isSaving}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 rounded-md text-green-600 hover:bg-green-100"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900" />
            ) : (
              <Check size={20} />
            )}
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-100"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <h1 className={textClass}>{value}</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit size={20} className="text-slate-500" />
          </button>
        </>
      )}
    </div>
  );
};
