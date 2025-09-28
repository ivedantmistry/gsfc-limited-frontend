"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// Define the props the component will accept
interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (versionName: string) => void;
}

export function CreateVersionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateVersionModalProps) {
  // Internal state to manage the form input
  const [versionName, setVersionName] = useState("");

  // Clear the input field when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setVersionName("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim whitespace and ensure the name is not empty before submitting
    if (versionName.trim()) {
      onSubmit(versionName.trim());
    }
  };

  // Don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Create New Version
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Enter a unique name for this new version. You can add parameters or
            grades to it after it's created.
          </p>

          <div className="mb-4">
            <label
              htmlFor="versionName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Version Name
            </label>
            <input
              id="versionName"
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g., v2.1, 2025 Q4 Update"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition font-medium"
              disabled={!versionName.trim()}
            >
              Create Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}