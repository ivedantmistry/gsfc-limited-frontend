"use client";

import React from "react";
import { Product } from "@/lib/types/";
// CORRECTED: Import the component with its new name
import { VersionManager } from "./VersionManager";

interface ProductWithNoGradesViewProps {
  product: Product;
}

export const ProductWithNoGradesView: React.FC<ProductWithNoGradesViewProps> = ({
  product,
}) => {
  // The logic for displaying parameters is now handled inside each version.
  // This component's primary role is to manage the versions for this product.
  return (
    <div className="space-y-8">
      {/* This is the main component for managing this product's versions.
        It handles creating the first version, creating new versions from old ones,
        locking, and activating.
      */}
      <VersionManager productId={product.id} />
    </div>
  );
};