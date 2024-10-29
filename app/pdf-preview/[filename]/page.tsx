import PDFViewer from "@/component/pdf";

type Params = {
  params: {
    filename: string;
  };
};

const PreviewPDF = async ({ params }: Params) => {
  let blobUrl: Uint8Array | string = new Uint8Array();

  if (params.filename === null) {
    return (
      <div>
        <p>PDF document not found</p>
      </div>
    );
  } else {
    const filename = params?.filename?.split(".pdf")[0];
    const response = await fetch(`http://localhost:3000/api/documents/get?filename=${filename}`);
    console.info(filename);
    if (response.ok) {
      const base64String = await response.text();
      console.info(base64String);
      debugger;
      const base64WithoutPrefix = base64String.substr(
        "data:application/pdf;base64,".length
      );
      const bytes = atob(base64WithoutPrefix);
      const length = bytes.length;
      const out = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        out[i] = bytes.charCodeAt(i);
      }
      const blob = new Blob([out], { type: "application/pdf" });
      //   blobUrl = out;
      blobUrl = URL.createObjectURL(blob);
    }

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Preview Document</h2>
        <div className="h-[90vh] w-full">
          <PDFViewer url={blobUrl} />
        </div>
      </div>
    );
  }
};

export default PreviewPDF;
