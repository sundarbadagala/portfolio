import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  data: [],
  isLoading: false,
  error: "",
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    tagsRequest(state) {
      state.isLoading = true;
    },
    tagsSucccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    tagsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { tagsRequest, tagsSucccess, tagsError } = tagsSlice.actions;
export default tagsSlice.reducer;
