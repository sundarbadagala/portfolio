import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: {},
    error: ""
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginRequest(state, _action) {
            state.isLoading = true;
        },
        loginSuccess(state, action) {
            state.isLoading = false;
            state.data = action.payload;
        },
        loginError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
})

export const { loginRequest, loginError, loginSuccess } = loginSlice.actions
export default loginSlice.reducer