import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    data: [],
    isLoading: false,
    error: ''
}

const newsSlice = createSlice({
    name: 'news',
    initialState: initialState,
    reducers: {
        newsRequest(state) {
            state.isLoading = true
        },
        newsSuccess(state, action) {
            state.isLoading = false,
                state.data = action.payload
        },
        newsError(state, action) {
            state.isLoading = false,
                state.error = action.payload
        }

    }
})

export const { newsRequest, newsSuccess, newsError } = newsSlice.actions

export default newsSlice.reducer