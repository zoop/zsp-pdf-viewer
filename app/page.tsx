"use client"
//import Link from "next/link";
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";



export default function Home() {
  // //const [file, setFile] = useState<File | null>(null);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0] || null;
  //   setFile(selectedFile);
  // };

  // const handleUpload = async () => {
  //   if (!file) {
  //     alert("Please select a file to upload.");
  //     return;
  //   }
  //   const base64String = await fileToBase64(file);
  //   const formData = new FormData();
  //   formData.append("file", base64String);
  //   const filename = file.name;
  //   formData.append("filename", filename); 

  //   console.log(filename);
  //   console.log(base64String);

  //   try {
  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       alert("File uploaded successfully!");
  //     } else {
  //       alert("File upload failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     alert("An error occurred while uploading the file.");
  //   }
  // };

  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64 = reader.result?.toString().replace(/^data:.+;base64,/, '') || '';
  //       resolve(base64); // Return the Base64 string
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pdfDoc,setPdfDoc]=useState<PDFDocumentProxy | null>(null);

  const handleFileChange=async(event: React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0] || null;
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
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

    const canvas = document.getElementById("pdfCanvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if(context){
    canvas.height = viewport.height;
    canvas.width = viewport.width;

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
      {/* <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-400 rounded"
      /> */}
      <input type="file" id="pdfUpload" accept="application/pdf" onChange={handleFileChange}  className="mb-4 p-2 border border-gray-400 rounded"/>
      <canvas id="pdfCanvas" className="border border-gray-300 shadow-lg"></canvas>
{/* 
      <Link href={"/documents"}>
      <button
        onClick={handleUpload}
        className="px-4 py-3 m-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload
      </button>
      </Link> */}
      
      </div>
    </div>
  );
}
