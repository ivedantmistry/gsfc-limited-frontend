"use client";

import React from "react";
import { ProductGrade } from "@/lib/types";
import { ProductGradeCard } from "./ProductGradeCard";

interface ProductGradeListProps {
  grades: ProductGrade[];
}

export const ProductGradeList = ({ grades }: ProductGradeListProps) => {
  return (
    <div className="space-y-4">
      {grades.map((grade) => (
        <ProductGradeCard key={grade.id} grade={grade} />
      ))}
    </div>
  );
};