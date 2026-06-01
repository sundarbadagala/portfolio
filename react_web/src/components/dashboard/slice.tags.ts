import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./interface";

const initialState: IInitialState = {
    data: [],
    isLoading: false,
    error: "",
};

const tagsSlice = createSlice({
    name: "dashboard/tags",
    initialState,
    reducers: {
        tagsRequest(state: IInitialState) {
            state.isLoading = true;
        },
        tagsSuccess(state: IInitialState, action: PayloadAction<string[]>) {
            state.isLoading = false;
            state.data = action.payload;
        },
        tagsError(state: IInitialState, action: PayloadAction<string>) {
            state.isLoading = false;
            state.data = [];
            state.error = action.payload;
        },
    },
});

export const { tagsRequest, tagsSuccess, tagsError } = tagsSlice.actions;
export default tagsSlice.reducer;
