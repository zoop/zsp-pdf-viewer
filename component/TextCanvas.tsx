import { useTextCanvas } from "@/app/context/TextCanvasContext";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import React, { useEffect, useRef } from "react";

interface TextCanvasProps {
  textCanvas: HTMLCanvasElement | null;
  // viewport: { transform: number[] }; // Ensure this prop is passed from the parent
  // onTextBounds?: (
  //   bounds: Array<{ x: number; y: number; width: number; height: number }>
  // ) => [];
}

const TextCanvas: React.FC<TextCanvasProps> = ({
  textCanvas,
  // viewport,
  // onTextBounds,
}) => {
  const { textContent } = useTextCanvas();
  const textBounds = useRef<
    Array<{ x: number; y: number; width: number; height: number }>
  >([]);

  useEffect(() => {
    if (textCanvas && textContent) {
      const context = textCanvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, textCanvas.width, textCanvas.height);
        context.font = "40px Arial"; // This can be adjusted for better alignment
        context.fillStyle = "black";

        // Clear previous bounds
        textBounds.current = [];

        // Loop through the textContent items and draw each one
        textContent.items.forEach((item: TextItem | TextMarkedContent) => {
          if ("str" in item) {
            const { str, transform} = item;
            console.log(transform);
            console.log(str);
            if (transform) {
              // transform has 6 coordinates
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              // const [fontScaleX, , , fontScaleY, originalX, originalY] =
              //   transform;

              // // Apply the PDF viewport scaling to the coordinates
              // const scaledX =
              //   viewport.transform[0] * originalX + viewport.transform[4];
              // const scaledY =
              //   viewport.transform[3] * originalY + viewport.transform[5];

              // // Adjust for font scaling (optional, to improve alignment)
              // const adjustedY = scaledY - fontScaleY; // Align y to the top-left

              // // Draw the text on the canvas at the calculated coordinates
              // context.fillText(str, scaledX, adjustedY);

              // // Store bounding box information
              // const estimatedHeight = fontScaleY * 1.2; // Estimate height
              // textBounds.current.push({
              //   x: scaledX,
              //   y: adjustedY - estimatedHeight, // Adjust to top-left corner
              //   width: width || context.measureText(str).width,
              //   height: estimatedHeight,
              // });
            }
          }
        });

        // Pass bounds to parent (e.g., HighlightCanvas)
        //if (onTextBounds) onTextBounds(textBounds.current);
      }
    }
  }, [textCanvas, textContent]);

  return null; // This component doesn't render visually itself
};

export default TextCanvas;
