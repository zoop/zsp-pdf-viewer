"use client"

import React, { createContext, useContext, useState } from "react";
import { TextContent } from "pdfjs-dist/types/src/display/api";

interface TextCanvasContextType {
  textContent: TextContent | null;
  setTextContent: (content: TextContent | null) => void;
}

const TextCanvasContext = createContext<TextCanvasContextType | undefined>(
  undefined
);

export const TextCanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [textContent, setTextContent] = useState<TextContent | null>(null);

  return (
    <TextCanvasContext.Provider value={{ textContent, setTextContent }}>
      {children}
    </TextCanvasContext.Provider>
  );
};

export const useTextCanvas = (): TextCanvasContextType => {
  const context = useContext(TextCanvasContext);
  if (!context) {
    throw new Error("useTextCanvas must be used within a TextCanvasProvider");
  }
  return context;
};
