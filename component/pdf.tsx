"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={"/uploads/7bc93c54-af90-4da9-9d40-bb60f0fb95c1.pdf"} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
