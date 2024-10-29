"use client"
import Link from "next/link";
import React, { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(file);
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">File Uploader</h1>
      <div className="flex-row ">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-400 rounded"
      />
      <Link href={"/documents"}>
      <button
        onClick={handleUpload}
        className="px-4 py-3 m-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload
      </button>
      </Link>
      
      </div>
    </div>
  );
}
