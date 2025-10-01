"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/lib/api/product";
import { Product } from "@/lib/types";
import { Search, X, Loader2, FileText, ChevronRight } from "lucide-react";

interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A multi-step modal for creating a new test record.
 * Step 1: Search for and select a product.
 * (Future steps will handle version, grade, and data entry).
 */
export const AddTestModal = ({ isOpen, onClose }: AddTestModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products using the useProducts hook
  const { products, isLoading, error } = useProducts({
    searchTerm: searchTerm,
    pageSize: 10, // Limit results for performance
  });

  // Effect to reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedProduct(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // In the next step, you would fetch versions for this product
    console.log("Selected Product:", product);
  };

  // Render the content for Step 1: Product Selection
  const renderProductSelection = () => (
    <>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Step 1: Find Product for Testing
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Search for the product by its name or ID to begin the data entry process.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="px-6 pb-6 h-64 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="ml-2 text-gray-600">Searching...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            Failed to load products.
          </div>
        )}
        {!isLoading && !error && products && products.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => handleProductSelect(product)}
                  className="w-full flex items-center justify-between text-left px-2 py-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.product_id}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="text-center text-gray-500 pt-10">
            {searchTerm ? `No products found for "${searchTerm}".` : "Start typing to search for a product."}
          </div>
        )}
      </div>
    </>
  );

   // Render the content for Step 2: Details Entry (Placeholder)
   const renderDetailsEntry = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Step 2: Enter Test Details for {selectedProduct?.name}
      </h3>
      <p className="text-sm text-gray-500">
        This is where the form to select the version, grade, and input parameter values will go.
      </p>
      {/* Back button to allow changing the product */}
       <button 
        onClick={() => setSelectedProduct(null)}
        className="mt-4 text-sm text-indigo-600 hover:underline"
      >
        &larr; Back to product search
      </button>
    </div>
  );


  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
            New Test Record
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Conditional rendering based on whether a product is selected */}
        {!selectedProduct ? renderProductSelection() : renderDetailsEntry()}

      </div>
    </div>
  );
};
