"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaComment, FaHighlighter, FaTrashAlt } from "react-icons/fa";

interface RectangleDrawerProps {
  canvas: HTMLCanvasElement | null;
}

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

const RectangleDrawer: React.FC<RectangleDrawerProps> = ({ canvas }) => {
  const [comment, setComment] = useState('');
  const [commentModal,setCommentModal]=useState(false);
  const [annotations, setAnnotations] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [selectedRectangle, setSelectedRectangle] = useState<Rectangle | null>(
    null
  );
  const [modalPosition, setModalPosition] = useState<Point | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);


// not working
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        setRectangles([]); // Remove rectangles
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

// not working
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // draw annotation
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

// interaction handled
  useEffect(() => {
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const handleMouseDown = (event: MouseEvent) => {
      if (!context) return;
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      setStartPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || !canvas || !context) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;

      context.clearRect(0, 0, canvas.width, canvas.height);

      rectangles.forEach(({ start, end }) => {
        context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      });
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
      const endPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setRectangles((prev) => [...prev, { start: startPoint, end: endPoint }]);

      // modal for annotations open here
      const newRectangle = { start: startPoint, end: endPoint };
      setAnnotations((prev) => [...prev, newRectangle]);
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
  }, [canvas, isDrawing, startPoint]);

  // applied annotation
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

  const removeHighlight = () => {
    if (selectedRectangle) {
      setAnnotations((prev) =>
        prev.map((rect) =>
          rect === selectedRectangle ? { ...rect, type: undefined } : rect
        )
      );
      setIsModalOpen(false);
      setSelectedRectangle(null);
    }
  };

  return (
    <div>
      {isModalOpen && modalPosition && selectedRectangle && (
        <div
          id="annotation-modal"
          style={{
            position: "absolute",
            backgroundColor: "black",
            border: "1px solid gray",
            borderRadius: "8px",
            padding: "8px",
            zIndex: 1000,
            top: `${modalPosition?.y + 10}px`,
            left: `${modalPosition?.x}px`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "0.5rem", // Tailwind's space-x-2 corresponds to 0.5rem, not 0.5px
            }}
          >
            <button
              className="px-4 py-2 text-white bg-yellow-500 rounded"
              onClick={() => applyAnnotation("highlight")}
            >
              <FaHighlighter />
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded ml-2"
              onClick={() => {
                setCommentModal(true);
              }}
            >
              <FaComment />
            </button>
            {selectedRectangle.type === "highlight" && (
              <button
                className="px-4 py-2 bg-red-500 rounded text-white"
                onClick={removeHighlight}
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        </div>
      )}


      {commentModal  && modalPosition &&(
        <div style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid gray",
          borderRadius: "8px",
          padding: "8px",
          zIndex: 1001, // Ensure comment modal is above annotation modal
          top: `${modalPosition.y + 10 + 40}px`,  // 40px offset below annotation modal
          left: `${modalPosition.x}px`,
          width: "auto",
        }}>
          <textarea
                style={{
                  padding: "0.5rem",  
                  width: "100%",  
                  borderRadius: "0.375rem",  
                  border: "1px solid #D1D5DB",
                  color:"black",
                }}value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter comment here..."
              />
              <button
                style={{
                  marginTop: "0.5rem",  // equivalent to mt-2
                  backgroundColor: "#10B981",  // equivalent to bg-green-500
                  color: "black",  // equivalent to text-white
                  borderRadius: "0.375rem",  // equivalent to rounded
                  padding: "0.25rem 0.5rem",  // equivalent to p-1
                }}onClick={() => {
                  if (comment.trim()) {
                    applyAnnotation("comment", comment); // Apply comment to selected rectangle
                  }
                  if(comment !== ""){
                    setComment(comment);
                  }
                }}
              >
                Submit
              </button>
              <button
                style={{
                  marginTop: "0.5rem",  // equivalent to mt-2
                  backgroundColor: "#6B7280",  // equivalent to bg-gray-500
                  color: "white",  // equivalent to text-white
                  borderRadius: "0.375rem", 
                  padding: "0.25rem 0.5rem",
                  marginLeft:"0.5 rem"
                }}
                onClick={() => setCommentModal(false)} // Close the comment modal
              >
                Cancel
              </button>
        </div>
      )}

      
    </div>
  );
};

export default RectangleDrawer;
