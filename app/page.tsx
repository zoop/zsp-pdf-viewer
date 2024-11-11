"use client"
//import Link from "next/link";
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";



export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pdfDoc,setPdfDoc]=useState<PDFDocumentProxy | null>(null);

  const handleFileChange=async(event: React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0] || null;
    // used pdfjs lib to preview pdf and not writing any backend api to handle the
    if(file && file.type==="application/pdf"){
      const arrayBuffer=await file.arrayBuffer();
      const loaded=await pdfjsLib.getDocument({
        data:arrayBuffer,
        cMapUrl:"/path/to/cmaps/",
        cMapPacked:true,
      }).promise;
      setPdfDoc(loaded);
      renderPdf(loaded,1);
    }else{
      alert("upload valid pdf");
    }
  }

  const renderPdf=async(pdfDoc: PDFDocumentProxy,pageNumber: number)=>{
    //load the page
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
    // canvas context for pdf
    const canvas = document.getElementById("pdfCanvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if(context){
    canvas.height = viewport.height;
    canvas.width = viewport.width;
      // render pdf in canvas context
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    await page.render(renderContext).promise;
  }else{
    console.error("Falied to get canvas context");
  }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
      <div className="flex-row ">
      <input type="file" id="pdfUpload" accept="application/pdf" onChange={handleFileChange}  className="mb-4 p-2 border border-gray-400 rounded"/>
      <canvas id="pdfCanvas" className="border border-gray-300 shadow-lg"></canvas>
      </div>
    </div>
  );
}
