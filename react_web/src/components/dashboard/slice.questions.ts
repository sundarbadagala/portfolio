import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./interface";

const initialState: IInitialState = {
    data: [],
    isLoading: false,
    error: "",
};

const blogsSlice = createSlice({
    name: "dashboard/questions",
    initialState,
    reducers: {
        blogsRequest(state: IInitialState) {
            state.isLoading = true;
        },
        blogsSuccess(state: IInitialState, action: PayloadAction<string[]>) {
            state.isLoading = false;
            state.data = action.payload;
        },
        blogsError(state: IInitialState, action: PayloadAction<string>) {
            state.isLoading = false;
            state.data = [];
            state.error = action.payload;
        },
    },
});

export const { blogsRequest, blogsSuccess, blogsError } = blogsSlice.actions;
export default blogsSlice.reducer;
