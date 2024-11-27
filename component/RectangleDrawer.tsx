"use client";

import React, { useState, useEffect } from "react";

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
  }


const RectangleDrawer: React.FC<RectangleDrawerProps> = ({ canvas }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });


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
      if (!isDrawing || !canvas || ! context ) return;
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;
        const width = currentX - startPoint.x;
        const height = currentY - startPoint.y;

        context.clearRect(0,0, canvas.width, canvas.height);

        rectangles.forEach(({ start, end }) => {
            context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        });

        context.fillStyle = "rgba(255, 0, 0, 0.5)";
        context.fillRect(startPoint.x, startPoint.y, width, height); 
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(startPoint.x, startPoint.y, width,height);
      };

    const handleMouseUp = (event: MouseEvent) => {
        if(!context || !canvas) return;
        setIsDrawing(false);
        const rect = canvas.getBoundingClientRect();
        const endPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        setRectangles((prev) => [...prev, { start: startPoint, end: endPoint }]);
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

  return (
    <div>
      
    </div>
  );
};

export default RectangleDrawer;
