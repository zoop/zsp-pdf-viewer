import { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import React, { useEffect } from "react";

interface TextCanvasProps {
  textCanvas: HTMLCanvasElement | null;
  textContent: TextContent; // PDF.js text content
}

const TextCanvas: React.FC<TextCanvasProps> = ({ textCanvas, textContent }) => {
  useEffect(() => {
    if (textCanvas && textContent) {
      const context = textCanvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, textCanvas.width, textCanvas.height); 

        
        context.font = "16px Arial"; // You can adjust the font size and style here
        context.fillStyle = "black"; // Text color

        // Loop through the textContent items and draw each one
        textContent.items.forEach((item: TextItem | TextMarkedContent ) => {
            if ('str' in item) {  
                const { str, transform } = item;
                console.log(str);
            
                if (transform) {
                  
                  const x = transform[4]; // Horizontal position (x)
                  const y = transform[5]; // Vertical position (y)
            
                  // Draw the text at the specified coordinates
                  context.fillText(str, x, y);
                }

                console.log(transform);
              }
            });
      }
    }
  }, [textCanvas, textContent]);
  

  return <></>; // This component doesn't render anything visually by itself
};

export default TextCanvas;
