
"use client";

import { useEffect, useState } from "react";


export default function DocumentsPage() {
    const [files,setFiles]=useState<File[]>([]);
    
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
return (
  <>
      <h1>Document List</h1>
      <ul>
      {files.length>0?
        (files.map((file)=>
          (
          <li key={file.name} className="bg-white">
              {file.name}
          </li>
        )
      )):(
        <h1>No documents Uploded</h1>
      )
      }
      </ul>
  </>
)
};
