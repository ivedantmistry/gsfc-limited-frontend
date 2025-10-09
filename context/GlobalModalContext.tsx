"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import CreateTestModal from '@/components/modals/create-test-wizard/CreateTestModal';
import { useHasPermission } from './AuthContext'; // Assuming AuthContext is in the same folder

interface GlobalModalContextType {
  openCreateTestModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");

  const openCreateTestModal = () => {
    if (canCreateTest) {
      setIsCreateTestModalOpen(true);
    }
  };

  const handleSuccess = () => {
    setIsCreateTestModalOpen(false);
    // Optionally, you can add logic here to refresh data globally if needed
  };

  return (
    <GlobalModalContext.Provider value={{ openCreateTestModal }}>
      {children}
      <CreateTestModal
        isOpen={isCreateTestModalOpen}
        onClose={() => setIsCreateTestModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </GlobalModalContext.Provider>
  );
};