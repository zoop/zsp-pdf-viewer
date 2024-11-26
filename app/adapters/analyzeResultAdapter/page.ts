import {
    StudioDocumentEntity,
    StudioDocumentKeyValuePair,
    StudioDocumentPage,
    StudioDocumentResult,
    StudioDocumentTable,
    ParsedContentPagedText,
    ParsedContentPagedSelectionMarks,
    ParsedContentPagedTables,
} from "../../models/analyzeResult/page";
import { V3_0_3_AnalyzeResultAdapter } from "../analyzeResultAdapter/v3_0_3_AnalyzeResultAdapter";

export interface IAnalyzeResultAdapter {
    getDocumentPage: (pageNumber: number) => StudioDocumentPage | undefined;
    getDocumentPages: () => StudioDocumentPage[];
    getDocumentTables: () => StudioDocumentTable[];
    getDocumentResults: () => StudioDocumentResult[];
    getDocumentKeyValuePairs: () => StudioDocumentKeyValuePair[];
    getDocumentEntities: () => StudioDocumentEntity[];
    getDocumentPagedText: () => ParsedContentPagedText;
    getDocumentPagedTables: () => ParsedContentPagedTables;
    getDocumentPagedSelectionMarks: () => ParsedContentPagedSelectionMarks;
}

export class AnalyzeResultAdapterFactory {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static create(analyzeResult: any): IAnalyzeResultAdapter {
        return new V3_0_3_AnalyzeResultAdapter(analyzeResult);
    }
}
