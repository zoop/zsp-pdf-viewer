// app/pdf-preview/[file].tsx
"use client";

import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

//import { usePathname } from 'next/navigation';

type Params = {
  params: {
    filename: string;
  };
};

const PdfPreview = ({ params }: Params) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/documents/${params.filename}`);
        if (response.ok) {
          const base64String = await response.text();
          console.info(base64String);
          const base64WithoutPrefix = base64String.substr(
            "data:application/pdf;base64,".length
          );
          console.info(base64WithoutPrefix);
          const bytes = atob(base64WithoutPrefix);
          const length = bytes.length;
          const out = new Uint8Array(length);

          for (let i = 0; i < length; i++) {
            out[i] = bytes.charCodeAt(i);
          }

          const blob = new Blob([out], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);
          setBlobUrl(blobUrl);
        } else {
          console.error("Failed to fetch Preview");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchPdf();
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [params.filename]);
  if (!blobUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Preview Document</h2>
      <div className="h-[90vh] w-full">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={blobUrl} />
        </Worker>
      </div>
    </div>
  );
};
export default PdfPreview;
