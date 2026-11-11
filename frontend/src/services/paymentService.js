import API from "../api/axios";

export const createRazorpayOrder = async (orderData) => {
    const { data } = await API.post("/payments/create-order", orderData);
    return data;
};

export const verifyPayment = async (paymentData) => {
    const { data } = await API.post("/payments/verify", paymentData);
    return data;
};
