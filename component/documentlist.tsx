
"use client";
import React, { useEffect } from 'react';
import { Worker, Viewer} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin, } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { highlightPlugin,MessageIcon,RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

// import { highlightPlugin } from '@react-pdf-viewer/highlight';
// import '@react-pdf-viewer/highlight/lib/styles/index.css';
// import { MessageIcon, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
 import { Button, Position, Tooltip } from '@react-pdf-viewer/core';
import openLinksPlugin from './openLinksPlugin';


export default function DocumentsPage() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const openLinksPluginInstance = openLinksPlugin();
  // To highlight text
   const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
     <div
        className={`bg-gray-200 flex absolute`}
        style={{
            left: `${props.selectionRegion.left}%`,
            top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
            transform: 'translate(0, 8px)',
        }}
    >
        <Tooltip
            position={Position.TopCenter}
            target={
               <div className="p-2 bg-blue-500 text-white rounded  transition duration-300">
               <Button onClick={props.toggle}>
                   <MessageIcon />
               </Button>
           </div>
             }
             content={() => <div className="w-24 text-center">Add a note</div>} // 100px width converted to Tailwind width
             offset={{ left: 0, top: -8 }}
         />
     </div>
 );
const highlightPluginInstance = highlightPlugin({
  renderHighlightTarget,
});




  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          //setFiles(data.files);
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
  <div className="min-h-screen flex items-center justify-center">
     {/* <div className='border border-[rgba(0,0,0,0.3)] w-[750px] h-[7x50px] '> */}
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div
    style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        height: '950px',
        width:'950px'
    }}
>
      <Viewer
      fileUrl={"/uploads/5606f9de-521a-418c-9cec-b5b2c2eacc1a.pdf"}
      plugins={[defaultLayoutPluginInstance,highlightPluginInstance,openLinksPluginInstance]}
      />
       </div>
    </Worker>
  </div>
);
};




















// "use client";
// import React, { useEffect,useState } from 'react';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';



// export default function DocumentsPage() {
//   const [files, setFiles] = useState<string[]>([]);
//   const [selectedFile, setSelectedFile] = useState<string | null>(null); // State to manage the selected file
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
//   // Fetch the list of files from the API
//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await fetch("/api/documents");
//         if (response.ok) {
//           const data = await response.json();
//           setFiles(data.files);
//         } else {
//           console.error("Failed to fetch files");
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };

//     fetchFiles();
//   }, []);


//   const handlePreview = (file: string) => {
//     setSelectedFile(file); // Set the selected file
//     setIsPreviewOpen(true); // Open the preview modal
//   };

//   const handleClosePreview = () => {
//     setIsPreviewOpen(false); // Close the preview modal
//     setSelectedFile(null); // Reset the selected file
//   };


  

//   return (
//     <div className="min-h-screen flex flex-col p-6">
//   <h1 className="text-2xl font-bold mb-4 text-center">Uploaded Documents</h1>

//   {files.length > 0 ? (
//     <ul className="list-disc pl-6">
//       {files.map((file) => (
//         <li key={file} className="mb-4"> {/* Increased margin for more spacing */}
//           {/* Preview or download link */}
//           <a
//             href={`/uploads/${file}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-blue-600 hover:underline hover:text-blue-800 transition duration-300 ease-in-out p-2 rounded shadow-md"
//           >
//             {file}
//           </a>
//           <button
//                onClick={() => handlePreview(file)}
//                 className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
//               >
//                 Preview
//               </button>
//         </li>
//       ))}
//     </ul>
//   ) : (
//     <p>No files uploaded yet.</p>
//   )}
//   {isPreviewOpen && selectedFile && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"> 
//           <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full relative">
//             <button
//               onClick={handleClosePreview}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               &times; {/* Close button */}
//             </button>
//             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//                 <div style={{ height: '750px' }}>
//                 <Viewer
//                   fileUrl={`/uploads/${selectedFile}`}
//                   plugins={[
//                     defaultLayoutPluginInstance,
//                   ]}
//                 />
//                </div>
//             </Worker>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// "use client";
// import React, { useEffect, useState } from 'react';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// //import { useRouter } from 'next/router';

// export default function DocumentsPage() {
//   const [files, setFiles] = useState<string[]>([]);
//   //const router = useRouter();

//   // Fetch the list of files from the API
//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await fetch("/api/documents");
//         if (response.ok) {
//           const data = await response.json();
//           setFiles(data.files);
//         } else {
//           console.error("Failed to fetch files");
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };

//     fetchFiles();
//   }, []);

//   const convertFileToBase64 = (fileUrl: string) => {
//     return new Promise<string>((resolve, reject) => {
//       fetch(fileUrl)
//         .then((response) => response.blob())
//         .then((blob) => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             resolve(reader.result as string);
//           };
//           reader.onerror = reject;
//           reader.readAsDataURL(blob); // Converts the blob to base64
//         })
//         .catch(reject);
//     });
//   };

//   // Handle preview
//   const handlePreviewClick = async (file: string) => {
//     const fileUrl = `/uploads/${file}`;
//     try {
//       const base64File = await convertFileToBase64(fileUrl);
      
//       // Open the PDF in a new tab with base64 data
//       const newTab = window.open();
//       if (newTab) {
//         newTab.document.body.innerHTML = `<div id="pdf-viewer-root"></div>`;
//         newTab.document.write(`
//           <script src="https://unpkg.com/react/umd/react.development.js"></script>
//           <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
//           <script src="https://unpkg.com/@react-pdf-viewer/core@latest"></script>
//           <link rel="stylesheet" href="https://unpkg.com/@react-pdf-viewer/core@latest/lib/styles/index.css" />
//           <script>
//             const { Viewer } = window["react-pdf-viewer"].Core;
//             const container = document.getElementById('pdf-viewer-root');
//             ReactDOM.render(
//               React.createElement(Viewer, { fileUrl: "${base64File}" }),
//               container
//             );
//           </script>
//         `);
//       }
//     } catch (error) {
//       console.error("Error converting file to base64:", error);
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">Uploaded Documents</h1>

//       {files.length > 0 ? (
//         <ul className="list-disc pl-6">
//           {files.map((file) => (
//             <li key={file} className="mb-4">
//               {/* Preview or download link */}
//               <a
//                 href={`/uploads/${file}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-semibold text-blue-600 hover:underline hover:text-blue-800 transition duration-300 ease-in-out p-2 rounded shadow-md"
//               >
//                 {file}
//               </a>
//               <button
//                 onClick={() => handlePreviewClick(file)}
//                 className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
//               >
//                 Preview
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No files uploaded yet.</p>
//       )}
//     </div>
//   );
//  }



















  
  // const handlePreview = () => {
  //   // Open new tab with the PDF viewer without passing file
  //   window.open(`/pdf`, "_blank");
  // };

  // const handleClosePreview=()=>{
  //   setPreview(null)
  // }

 // return (
    // <div className="min-h-screen flex flex-col p-6">
    //   <h1 className="text-2xl font-bold mb-4 text-center">Uploaded Documents</h1>
    //   {files.length > 0 ? (
    //     <ul className="list-disc pl-6">
    //       {files.map((file) => (
    //         <li key={`${file}`} className="mb-4">
    //           {/* Preview or download link */}
    //           <a
    //             href={`/uploads/${file}`}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="font-semibold text-blue-600 hover:underline hover:text-blue-800 transition duration-300 ease-in-out p-2 rounded shadow-md"
    //           >
    //             {file as string}
    //           </a>
    //           <button
    //             onClick={() => handlePreview()}
    //             className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
    //           >
    //             Preview
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p>No files uploaded yet.</p>
    //   )}
    // </div>





  // {preview && (
  //       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  //         <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full relative">
  //           <button
  //             onClick={handleClosePreview}
  //             className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
  //           >
  //             &times; {/* Close button */}
  //           </button>
  //           <h2 className="text-xl font-bold mb-4">Preview Document</h2>
  //           <div className="h-[750px] w-full">
  //             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
  //               <Viewer fileUrl={""} />
  //             </Worker>
  //           </div>
  //         </div>
  //       </div>
  //     )}