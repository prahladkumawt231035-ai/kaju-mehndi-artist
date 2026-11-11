
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axios";

// Backend se check karna ki user already logged in hai ya nahi
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/auth/me");
            return data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Not authenticated"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,
        initialized: false,
    },

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.initialized = true;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.initialized = true;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.initialized = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.initialized = true;
            });
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
