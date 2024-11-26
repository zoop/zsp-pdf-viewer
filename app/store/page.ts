
import {configureStore} from "@reduxjs/toolkit";
import * as Canvas from "./canvas/canvas";
import * as CustomModel from "../store/customModel/customModel";
import * as Documents from "./documents/documents";
import * as Predictions from "../store/predicitions/predicitions";
import * as Portal from "./portal/portal";

// The top-level state object
export interface ApplicationState {
    canvas: Canvas.CanvasState;
    customModel: CustomModel.CustomModelState;
    documents: Documents.DocumentsState;
    predictions: Predictions.PredictionsState;
    portal: Portal.PortalState;
}
export const reducers = {
    canvas: Canvas.reducer,
    customModel: CustomModel.reducer,
    documents: Documents.reducer,
    predictions: Predictions.reducer,
    portal: Portal.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type AppThunkAction<TAction>= (
    
        dispatch: (action: TAction) => void,
        getState: () => ApplicationState
    )=>void;

export const store = configureStore({
    reducer:reducers,
});
