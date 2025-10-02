"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types/product.types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Step1_ProductSelect from "./Step1_ProductSelect";
import Step2_DetailsAndResults from "../create-test-wizard/Step2_DetailsAndResults/index";
import { TestRecordInput } from "@/lib/types/test.types";
import { createTestRecord } from "@/lib/api/test";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTestModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentStep(1);
  };

  const handleFinalSubmit = async (data: TestRecordInput) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const newTestRecord = await createTestRecord(data);
     toast("Test record created!");

      onSuccess();
      router.push(`/dashboard/records/${newTestRecord.id}`); // Redirect to the new record
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.detail || "An unexpected error occurred.";
      setApiError(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing the modal
    setTimeout(() => {
        setCurrentStep(1);
        setSelectedProduct(null);
        setApiError(null);
    }, 300); // Delay to allow animation
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        {currentStep === 1 && (
          <Step1_ProductSelect onSelectProduct={handleProductSelect} />
        )}
        {currentStep === 2 && selectedProduct && (
          <Step2_DetailsAndResults
            product={selectedProduct}
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