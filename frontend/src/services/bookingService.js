import API from "../api/axios";

export const createBooking = async (bookingData) => {
    const { data } = await API.post("/bookings", bookingData);
    return data;
};

export const getMyBookings = async () => {
    const { data } = await API.get("/bookings/my-bookings");
    return data;
};

export const getAllBookings = async () => {
    const { data } = await API.get("/bookings");
    return data;
};

export const updateBookingStatus = async (id, status) => {
    const { data } = await API.patch(`/bookings/${id}/status`, { status });
    return data;
};
