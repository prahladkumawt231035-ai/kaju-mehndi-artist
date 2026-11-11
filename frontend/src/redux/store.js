import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import bookingReducer from "./features/bookingSlice";
import courseReducer from "./features/courseSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingReducer,
        courses: courseReducer,
    },
});
