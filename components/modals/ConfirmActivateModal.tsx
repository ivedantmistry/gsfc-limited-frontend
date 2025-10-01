"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { ShieldCheck } from "lucide-react";

interface ConfirmActivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  versionName: string | undefined;
}

export const ConfirmActivateModal: React.FC<ConfirmActivateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  versionName,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <ShieldCheck
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title
                as="h3"
                className="text-base font-semibold leading-6 text-slate-900"
              >
                Activate Version
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-slate-500">
                  Are you sure you want to make version{" "}
                  <strong className="text-slate-700">{versionName}</strong> the
                  active version? This will deactivate any other version that is
                  currently active.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
            >
              Confirm Activate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};