"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

// Define the type for our PDF document context
interface PdfDocContextType {
  pdfDoc: PDFDocumentProxy | null;
  setPdfDoc: React.Dispatch<React.SetStateAction<PDFDocumentProxy | null>>;
}

// Create a context with default values
const PdfDocContext = createContext<PdfDocContextType | undefined>(undefined);

// Context provider component
export const PdfDocProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  return (
    <PdfDocContext.Provider value={{ pdfDoc, setPdfDoc }}>
      {children}
    </PdfDocContext.Provider>
  );
};

// Custom hook to use the PdfDocContext
export const usePdfDoc = () => {
  const context = useContext(PdfDocContext);
  if (!context) {
    throw new Error("usePdfDoc must be used within a PdfDocProvider");
  }
  return context;
};
