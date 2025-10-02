// src/contexts/RecordDetailContext.tsx

"use client";

import { createContext, useContext } from 'react';
import { TestRecord } from '@/lib/types/test.types';

// Define the shape of the data our context will hold
interface RecordDetailContextType {
    testRecord: TestRecord | undefined;
    isLoading: boolean;
    error: any;
}

// Create the context with a default value of undefined
const RecordDetailContext = createContext<RecordDetailContextType | undefined>(undefined);

// Create a custom hook for easily using the context
export const useRecordDetail = () => {
    const context = useContext(RecordDetailContext);
    if (context === undefined) {
        throw new Error('useRecordDetail must be used within a RecordDetailProvider');
    }
    return context;
};

// We will use the Provider part directly in the layout
export { RecordDetailContext };