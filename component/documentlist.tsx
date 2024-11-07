
"use client";

import { useEffect, useState } from "react";


export default function DocumentsPage() {
    const [files,setFiles]=useState<{ name: string; base64: string }[]>([]);
    
    
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
          console.log(data);
        } else {
          console.error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const renderPdf = (base64String: string) => {
    const bin = atob(base64String);
    const arrayBuffer = new ArrayBuffer(bin.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bin.length; i++) {
      uint8Array[i] = bin.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    console.log(blobUrl);
    return blobUrl;
  };

  const handlepreviewclick=(file:{ name:string,base64:string})=>{
    const pdfUrl=renderPdf(file.base64);
    console.log(pdfUrl);
    window.open(pdfUrl,"noopener");
  }

  return (
    <>
      <h1>Document List</h1>
      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file.name} className="bg-white">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-lg font-medium">{file.name}</h2>
              <button onClick={()=>{handlepreviewclick(file)}}  className="bg-blue-500 text-white p-2 rounded">
                  Preview
              </button>
              </div>
              
            </li>
          ))
        ) : (
          <h1>No documents uploaded</h1>
        )}
      </ul>
    </>
  );
}