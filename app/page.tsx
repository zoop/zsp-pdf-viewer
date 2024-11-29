"use client";
//import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import RectangleDrawer from "@/component/RectangleDrawer";
import { usePdfDoc } from "@/app/context/PdfDocContext";
import { useTextCanvas } from "./context/TextCanvasContext";
//import AnnotationCanvas from "@/component/AnnotationCanvas";


export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pdfDoc, setPdfDoc } = usePdfDoc();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [overlayCanvas, setOverlayCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [annotationCanvas, setAnnotationCanvas]=useState<HTMLCanvasElement | null>(null);
  
  const { setTextContent } = useTextCanvas();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
  //const annotationCanvasRef=useRef<HTMLCanvasElement | null>(null);
  // const textBoundsRef = useRef<
  //   Array<{ x: number; y: number; width: number; height: number }>
  // >([]);

  // useEffect(()=>{
  //   if(annotationCanvasRef.current){
  //     setAnnotationCanvas(annotationCanvasRef.current);
  //   }
  // },[]);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [viewPort,setViewPort] = useState<any | undefined>();

  // const setViewPortValue = async ()=>{
  //   if(pdfDoc){
  //     const page = await pdfDoc.getPage(1);
  //     const viewport = page.getViewport({ scale: 1.5 });
  //     setViewPort(viewport)
  //   }
    
  // }
  // useEffect(()=>{
  //    setViewPortValue()
  // },[pdfDoc, setViewPortValue])
 



  const renderPdf = async (pdfDoc: PDFDocumentProxy, pageNumber: number) => {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
    if (
      canvasRef.current &&
       overlayCanvasRef.current &&
      textCanvasRef.current 
    ) {
      

      const context = canvasRef.current.getContext("2d");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const overlayContext = overlayCanvasRef.current.getContext("2d");

      if (context) {
        canvasRef.current.height = viewport.height;
        canvasRef.current.width = viewport.width;
        textCanvasRef.current.height = viewport.height;
        textCanvasRef.current.width = viewport.width;
        // annotationCanvasRef.current.height = viewport.height;
        // annotationCanvasRef.current.width = viewport.width;
        overlayCanvasRef.current.height = viewport.height;
        overlayCanvasRef.current.width = viewport.width;

        // render pdf in canvas context
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        const renderPromise = await page.render(renderContext).promise;
        const textContentPromise = await page.getTextContent();
        // Wait for both rendering and text fetching to complete
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, fetchedTextContent] = await Promise.all([
          renderPromise,
          textContentPromise,
        ]);
        setTextContent(fetchedTextContent);
        console.log(fetchedTextContent);

        // Text Bounds for texts
        // textBoundsRef.current = fetchedTextContent.items.map((item) => {
        //   if ("str" in item) {
        //     const { transform, width } = item as TextItem;
        //     if (transform) {
        //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //       const [fontScaleX, , , fontScaleY, originalX, originalY] =
        //         transform;
        //       const scaledX =
        //         viewport.transform[0] * originalX + viewport.transform[4];
        //       const scaledY =
        //         viewport.transform[3] * originalY + viewport.transform[5];
        //       const height = fontScaleY * 1.2;
              
        //       return {
        //         x: scaledX,
        //         y: scaledY - height,
        //         width: width,
        //         height,
        //       };
        //     }
        //   }
        //   return { x: 0, y: 0, width: 0, height: 0 };
        // });

        // overlayContext.clearRect(
        //   0,
        //   0,
        //   overlayCanvasRef.current.width,
        //   overlayCanvasRef.current.height
        // ); // Clear previous drawings
        // console.log(textBoundsRef.current);
        // textBoundsRef.current.forEach((bound) => {
        //   overlayContext.beginPath();
        //   overlayContext.rect(bound.x, bound.y, bound.width, bound.height);
        //   overlayContext.strokeStyle = "rgba(255, 0, 0, 0.7)"; // red color with transparency
        //   overlayContext.lineWidth = 1;
        //   overlayContext.stroke();
        // });
      }
    } else {
      console.error("Falied to get canvas context");
    }
  };

  useEffect(() => {
    if (
      canvasRef.current &&
      textCanvasRef.current &&
      overlayCanvasRef.current
    ) {
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
            id="zsp_PDFCanvas_layer"
            ref={canvasRef}
            className="block border border-gray-300 shadow-lg"
          ></canvas>
          <canvas
            id="zsp_TextCanvas_layer"
            ref={textCanvasRef}
            className="absolute top-0 left-0"
          />
          <canvas
            id="zsp_OverlayCanvas_layer"
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 "
          ></canvas> 
          {overlayCanvas && canvas && pdfDoc && (
            <RectangleDrawer
            canvas={overlayCanvas} />
          )}
          
          {/* 
          <canvas
          id="zsp_annotation_layer"
          ref={annotationCanvasRef}
          className="absolute top-0 left-0"
          >
          </canvas>
          <><<AnnotationCanvas
                canvas={annotationCanvas} />>*/}
          
        </div>
      </div>
    </div>
  );
}
