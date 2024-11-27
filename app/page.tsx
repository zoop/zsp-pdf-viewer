"use client";
//import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

import { PDFDocumentProxy, TextContent } from "pdfjs-dist/types/src/display/api";
import RectangleDrawer from "@/component/RectangleDrawer";
import { usePdfDoc } from "@/app/context/PdfDocContext";
import TextCanvas from "@/component/TextCanvas";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pdfDoc, setPdfDoc } = usePdfDoc();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [overlayCanvas, setOverlayCanvas] = useState<HTMLCanvasElement | null>(
    null
  );
  const [textContent, setTextContent] = useState<null | TextContent>(null);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    // used pdfjs lib to preview pdf and not writing any backend api to handle the
    if (file && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const loaded = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: "/path/to/cmaps/",
        cMapPacked: true,
      }).promise;
      setPdfDoc(loaded);
      renderPdf(loaded, 1);
    } else {
      alert("upload valid pdf");
    }
  };

  const renderPdf = async (pdfDoc: PDFDocumentProxy, pageNumber: number) => {
    if (canvasRef.current && overlayCanvasRef.current && textCanvasRef.current) {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const context = canvasRef.current.getContext("2d");
      const overlayContext = overlayCanvasRef.current.getContext("2d");

      if (context && overlayContext) {
        canvasRef.current.height = viewport.height;
        canvasRef.current.width = viewport.width;
        overlayCanvasRef.current.height = viewport.height;
        overlayCanvasRef.current.width = viewport.width;
        textCanvasRef.current.height = viewport.height;
        textCanvasRef.current.width = viewport.width;
        // render pdf in canvas context
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;

        const fetchedTextContent = await page.getTextContent();
        setTextContent(fetchedTextContent);
      }
    } else {
      console.error("Falied to get canvas context");
    }
  };

  useEffect(() => {
    if (canvasRef.current && textCanvasRef.current && overlayCanvasRef.current) {
      setCanvas(canvasRef.current);
      setOverlayCanvas(overlayCanvasRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
      <div className="flex flex-col items-center ">
        <input
          type="file"
          id="pdfUpload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-400 rounded"
        />
        <div className="relative inline-block">
          <canvas
            id="ZoopPDFCanvas"
            ref={canvasRef}
            className="block border border-gray-300 shadow-lg"
          ></canvas>
          {textContent && canvas && ( <TextCanvas textCanvas={textCanvasRef.current} textContent={textContent} />)}
          <canvas
            id="ZoopTextCanvas"
            ref={textCanvasRef}
            className="absolute top-0 left-0"
          />
          {overlayCanvas && canvas && pdfDoc && (<RectangleDrawer canvas={overlayCanvas} />)}
          <canvas
            id="ZoopOverlayCanvas"
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 "
          ></canvas>
        </div>
      </div>
    </div>
  );
}
