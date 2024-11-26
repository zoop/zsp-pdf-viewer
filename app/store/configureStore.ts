import { configureStore  as toolkitConfigureStore} from "@reduxjs/toolkit";
import { ApplicationState, reducers } from "./page"; // Import your reducers

export default function configureStore(initialState?: ApplicationState) {
    return toolkitConfigureStore({
        reducer: reducers,  // Use your existing reducers
        preloadedState: initialState,  // Optional initial state
    });
}
