import { createSlice } from "@reduxjs/toolkit";
import { clearCurrentDocument, setCurrentDocument, setCurrentPage } from "store/documents/documents";
import { IRawDocument } from "store/documents/documentsTypes";

// Define the Canvas State interface
export interface ICanvas {
    imageUrl: string;
    width: number;
    height: number;
    angle: number;
}

// Enum for visible analyzed elements
export enum VisibleAnalyzedElementEnum {
    KeyValuePairs = "KeyValuePairs",
    Entities = "Entities",
    PagedLabelResult = "PagedLabelResult",
    Lines = "Lines",
    Words = "Words",
    Paragraphs = "Paragraphs",
    SelectionMarks = "SelectionMarks",
    Tables = "Tables",
}

// Type for the visibility of analyzed elements
export type VisibleAnalyzedElement = {
    [VisibleAnalyzedElementEnum.KeyValuePairs]?: boolean;
    [VisibleAnalyzedElementEnum.Entities]?: boolean;
    [VisibleAnalyzedElementEnum.PagedLabelResult]?: boolean;
    [VisibleAnalyzedElementEnum.Lines]?: boolean;
    [VisibleAnalyzedElementEnum.Words]: boolean;
    [VisibleAnalyzedElementEnum.Paragraphs]?: boolean;
    [VisibleAnalyzedElementEnum.Tables]?: boolean;
    [VisibleAnalyzedElementEnum.SelectionMarks]?: boolean;
};

// Type for loading document page payload
export interface loadDocumentPagePayload {
    document: IRawDocument;
    pageNumber: number;
}

export interface SetVisibleAnalyzedElementPayload {
    element: VisibleAnalyzedElementEnum; // This ensures 'element' is one of the enum keys
    value: boolean;
}

// Define the Canvas state
export type CanvasState = {
    canvas: ICanvas;
    visibleAnalyzedElement: VisibleAnalyzedElement;
    hoveredBoundingBoxIds: string[];
    hoveredLabelName: string;
    documentSelectIndex: number;
    shouldResizeImageMap: boolean;
};

// Initial state of Canvas
export const initialState: CanvasState = {
    canvas: { imageUrl: "", width: 0, height: 0, angle: 0 },
    documentSelectIndex: 0,
    visibleAnalyzedElement: { [VisibleAnalyzedElementEnum.Words]: true },
    hoveredBoundingBoxIds: [],
    hoveredLabelName: "",
    shouldResizeImageMap: false,
};

// Create the Canvas slice
const canvasSlice = createSlice({
    name: "canvas",
    initialState,
    reducers: {
        setAngle(state, action) {
            state.canvas.angle = action.payload;
        },
        setVisibleAnalyzedElement(state, action:  { payload: SetVisibleAnalyzedElementPayload }) {
            const { element, value } = action.payload;
            state.visibleAnalyzedElement[element] = value;
        },
        setHoveredBoundingBoxIds(state, action) {
            state.hoveredBoundingBoxIds = action.payload;
        },
        setHoveredLabelName(state, action) {
            state.hoveredLabelName = action.payload;
        },
        setDocumentSelectIndex(state, action) {
            state.documentSelectIndex = action.payload;
        },
        setShouldResizeImageMap(state, action) {
            state.shouldResizeImageMap = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearCurrentDocument, (state) => {
                state.canvas = { imageUrl: "", width: 0, height: 0, angle: 0 };
                state.hoveredBoundingBoxIds = [];
                state.hoveredLabelName = "";
                state.documentSelectIndex = 0;
            })
            .addCase(setCurrentDocument.fulfilled, (state, action) => {
                const { imageUrl, width, height, angle } = action.payload.documentPage;
                state.canvas = { imageUrl, width, height, angle };
                state.hoveredBoundingBoxIds = [];
                state.hoveredLabelName = "";
                state.documentSelectIndex = 0;
            })
            .addCase(setCurrentPage.fulfilled, (state, action) => {
                state.canvas = action.payload.documentPage;
                state.hoveredBoundingBoxIds = [];
                state.hoveredLabelName = "";
            });
    },
});

export const {
    setAngle,
    setVisibleAnalyzedElement,
    setHoveredBoundingBoxIds,
    setHoveredLabelName,
    setDocumentSelectIndex,
    setShouldResizeImageMap,
} = canvasSlice.actions;

export const reducer = canvasSlice.reducer;
