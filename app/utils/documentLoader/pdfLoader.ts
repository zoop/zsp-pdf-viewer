import * as pdfjsLib from "pdfjs-dist";

import { PDFDocumentProxy } from "pdfjs-dist";
import { DocumentStatus, IDocument, IRawDocument } from "../../store/documents/documentsTypes";
import { loadCanvasToBlob } from "../page"; 
import { ICanvas } from "../../store/canvas/canvas";
import { IDocumentLoader } from "./page";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export class PdfLoader implements IDocumentLoader {
    private readonly PDF_SCALE = 2;

    private document: IRawDocument;
    private pdf: PDFDocumentProxy | null = null; // Explicitly set to null initially

    constructor(document: IRawDocument) {
        this.document = document;
    }

    public async setup(): Promise<void> {
        this.pdf = await pdfjsLib.getDocument({
            url: this.document.url,
            cMapUrl: "/fonts/pdfjs-dist/cmaps/",
            cMapPacked: true,
        }).promise;
    }

    public async loadDocumentMeta(): Promise<IDocument> {
        if (!this.pdf) {
            throw new Error("PDF is not loaded. Call setup() first.");
        }
        const firstPage = await this.loadDocumentPage(1, 1);
        return {
            ...this.document,
            thumbnail: firstPage.imageUrl,
            numPages: this.pdf.numPages,
            currentPage: 1,
            states: { loadingStatus: DocumentStatus.Loaded },
        };
    }

    public async loadDocumentPage(pageNumber: number, scale = this.PDF_SCALE): Promise<ICanvas> {
        if (!this.pdf) {
            throw new Error("PDF is not loaded. Call setup() first.");
        }
        const page = await this.pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        // Prepare canvas using PDF page dimensions.
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get canvas rendering context.");
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context.
        const renderContext = {
            canvasContext: context,
            viewport,
        };
        await page.render(renderContext).promise;

        const blob = await loadCanvasToBlob(canvas);
        return { imageUrl: window.URL.createObjectURL(blob), width: canvas.width, height: canvas.height, angle: 0 };
    }
}
