"use client";

import React, { useState, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

interface Rectangle {
  start: Point;
  end: Point;
  type?: "highlight" | "comment";
  comment?: string;
}

interface AnnotationCanvasProps {
  canvas: HTMLCanvasElement | null;
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ canvas }) => {
  const [annotations, setAnnotations] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [selectedRectangle, setSelectedRectangle] = useState<Rectangle | null>(
    null
  );
  const [modalPosition, setModalPosition] = useState<Point | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const drawAnnotations = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      annotations.forEach(({ start, end, type }) => {
        const width = end.x - start.x;
        const height = end.y - start.y;

        if (type === "highlight") {
          context.fillStyle = "rgba(255, 255, 0, 0.5)";
          context.fillRect(start.x, start.y, width, height);
        }

        context.strokeStyle = "yellow";
        context.lineWidth = 2;
        context.strokeRect(start.x, start.y, width, height);
      });
    };

    drawAnnotations();
  }, [canvas, annotations]);

  useEffect(() => {
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const handleMouseDown = (event: MouseEvent) => {
      if (!context) return;
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      setStartPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || !canvas || !context) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw existing annotations
      annotations.forEach(({ start, end, type }) => {
        const rectWidth = end.x - start.x;
        const rectHeight = end.y - start.y;

        if (type === "highlight") {
          context.fillStyle = "rgba(255, 255, 0, 0.5)";
          context.fillRect(start.x, start.y, rectWidth, rectHeight);
        }

        context.strokeStyle = "yellow";
        context.lineWidth = 2;
        context.strokeRect(start.x, start.y, rectWidth, rectHeight);
      });

      // Draw the currently drawing rectangle
      context.fillStyle = "rgba(255, 255, 0, 0.5)";
      context.fillRect(startPoint.x, startPoint.y, width, height);
      context.strokeStyle = "yellow";
      context.lineWidth = 2;
      context.strokeRect(startPoint.x, startPoint.y, width, height);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!context || !canvas) return;
      setIsDrawing(false);
      const rect = canvas.getBoundingClientRect();
      const endPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };

      // Add the new rectangle to annotations
      const newRectangle = { start: startPoint, end: endPoint };
      setAnnotations((prev) => [...prev, newRectangle]);

      // Open the annotation modal
      setModalPosition(endPoint);
      setSelectedRectangle(newRectangle);
      setIsModalOpen(true);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvas, isDrawing, startPoint, annotations]);

  const applyAnnotation = (type: "highlight" | "comment", comment?: string) => {
    if (selectedRectangle) {
      setAnnotations((prev) =>
        prev.map((rect) =>
          rect === selectedRectangle ? { ...rect, type, comment } : rect
        )
      );
      setIsModalOpen(false);
      setSelectedRectangle(null);
    }
  };

  return (
    <div>
      {isModalOpen && modalPosition && (
        <div
          id="annotation-modal"
          className="absolute bg-white border border-gray-300 rounded-lg p-2 z-[1000]"
          style={{
            top: `${modalPosition.y}px`,
            left: `${modalPosition.x}px`,
          }}
        >
          <button
            className="px-4 py-2 text-white bg-yellow-500 rounded"
            onClick={() => applyAnnotation("highlight")}
          >
            Highlight
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded ml-2"
            onClick={() => {
              const comment = prompt("Enter comment:");
              if (comment) applyAnnotation("comment", comment);
            }}
          >
            Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnotationCanvas;






// "use client";

// import React, { useState, useEffect } from "react";

// interface Point {
//   x: number;
//   y: number;
// }

// interface Rectangle {
//   start: Point;
//   end: Point;
//   type?: "highlight" | "comment";
//   comment?: string;
// }

// interface AnnotationCanvasProps {
//   canvas: HTMLCanvasElement | null;
// }

// const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ canvas }) => {
//   const [annotations, setAnnotations] = useState<Rectangle[]>([]);
//   const [selectedRectangle, setSelectedRectangle] = useState<Rectangle | null>(
//     null
//   );
//   const [modalPosition, setModalPosition] = useState<Point | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!canvas) return;

//     const context = canvas.getContext("2d");

//     const drawAnnotations = () => {
//       if (!context) return;
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       annotations.forEach(({ start, end, type }) => {
//         const width = end.x - start.x;
//         const height = end.y - start.y;

//         if (type === "highlight") {
//           context.fillStyle = "rgba(255, 255, 0, 0.5)";
//           context.fillRect(start.x, start.y, width, height);
//         }

//         context.strokeStyle = "yellow";
//         context.lineWidth = 2;
//         context.strokeRect(start.x, start.y, width, height);
//       });
//     };

//     drawAnnotations();
//   }, [canvas, annotations]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!isModalOpen) return;

//       const modal = document.getElementById("annotation-modal");
//       if (modal && !modal.contains(event.target as Node)) {
//         setIsModalOpen(false);
//         setSelectedRectangle(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isModalOpen]);

//   const handleRectangleSelect = (rectangle: Rectangle, position: Point) => {
//     setSelectedRectangle(rectangle);
//     setModalPosition(position);
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     if (!canvas) return;

//     const handleMouseUp = (event: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = event.clientX - rect.left;
//       const y = event.clientY - rect.top;

//       const newlyDrawnRectangle = annotations[annotations.length - 1];
//       if (newlyDrawnRectangle) {
//         handleRectangleSelect(newlyDrawnRectangle, { x, y });
//       }
//     };

//     canvas.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       canvas.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [canvas, annotations]);

//   const applyAnnotation = (type: "highlight" | "comment", comment?: string) => {
//     if (selectedRectangle) {
//       setAnnotations((prev) =>
//         prev.map((rect) =>
//           rect === selectedRectangle ? { ...rect, type, comment } : rect
//         )
//       );
//       setIsModalOpen(false);
//       setSelectedRectangle(null);
//     }
//   };

//   return (
//     <div>
//       {isModalOpen && modalPosition && (
//         <div
//           id="annotation-modal"
//           className="absolute bg-white border border-gray-300 rounded-lg p-2 z-[1000]"
//           style={{
//             top: `${modalPosition.y}px`,
//             left: `${modalPosition.x}px`,
//           }}
//         >
//           <button
//             className="px-4 py-2 text-white bg-yellow-500 rounded"
//             onClick={() => applyAnnotation("highlight")}
//           >
//             Highlight
//           </button>
//           <button
//             className="px-4 py-2 text-white bg-blue-500 rounded ml-2"
//             onClick={() => {
//               const comment = prompt("Enter comment:");
//               if (comment) applyAnnotation("comment", comment);
//             }}
//           >
//             Comment
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnnotationCanvas;
