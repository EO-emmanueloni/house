import { createSlice } from "@reduxjs/toolkit";
import { deleteUser } from "firebase/auth";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = {
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
                photoURL: action.payload.photoURL
            };
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
        SignOutUserStart: (state) => {
            state.loading = true;
        },
        SignOutUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        SignOutUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    }
});

 export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure,deleteUserStart, deleteUserSuccess, deleteUserFailure, SignOutUserStart, SignOutUserFailure, SignOutUserSuccess } = userSlice.actions;

export default userSlice.reducer;
