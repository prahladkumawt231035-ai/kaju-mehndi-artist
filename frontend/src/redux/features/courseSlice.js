import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchCourses = createAsyncThunk(
    "courses/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/courses");
            return data.courses;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
        }
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
