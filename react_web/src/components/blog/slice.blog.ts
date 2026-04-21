import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  isLoading: false,
  error: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    blogRequest(state) {
      state.isLoading = true;
    },
    blogSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    blogError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { blogRequest, blogSuccess, blogError } = blogSlice.actions;
export default blogSlice.reducer;
