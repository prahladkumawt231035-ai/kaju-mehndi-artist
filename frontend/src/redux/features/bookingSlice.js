import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchBookings = createAsyncThunk(
    "bookings/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/bookings");
            return data.bookings;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
        }
    }
);

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        addBookingLocally: (state, action) => {
            state.items.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addBookingLocally } = bookingSlice.actions;
export default bookingSlice.reducer;
