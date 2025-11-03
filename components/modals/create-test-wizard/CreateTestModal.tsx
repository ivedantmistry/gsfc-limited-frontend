// src/components/modals/create-test-wizard/CreateTestModal.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Step1_ProductSelect from "./Step1_ProductSelect";
import Step2_DetailsAndResults from "../create-test-wizard/Step2_DetailsAndResults/index";
import { TestRecordInput } from "@/lib/types/test.types";
import { createTestRecord } from "@/lib/api/test";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  detail?: string;
}

export default function CreateTestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTestModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProductName, setSelectedProductName] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleProductSelect = (productId: number, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setSelectedProductId(null);
    setSelectedProductName(null);
    setCurrentStep(1);
  };

  const handleFinalSubmit = async (data: TestRecordInput) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const newTestRecord = await createTestRecord(data);
      toast.success("Test record created successfully!");

      onSuccess();
      router.push(`/dashboard/records/${newTestRecord.id}`);
    } catch (error) {
      let errorMsg = "An unexpected error occurred.";
      if (error instanceof AxiosError && error.response) {
        const data = error.response.data as ApiErrorResponse;
        if (data.detail) {
          errorMsg = data.detail;
        }
      }
      setApiError(errorMsg);
      console.error(error);
      toast.error("Failed to create test record.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedProductId(null);
      setSelectedProductName(null);
      setApiError(null);
    }, 300);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl p-0 bg-slate-50">
        {currentStep === 1 && (
          <Step1_ProductSelect onSelectProduct={handleProductSelect} />
        )}
        {currentStep === 2 && selectedProductId && selectedProductName && (
          <Step2_DetailsAndResults
            productId={selectedProductId}
            productName={selectedProductName}
            onBack={handleBack}
            onSubmit={handleFinalSubmit}
            isSubmitting={isLoading}
            apiError={apiError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
