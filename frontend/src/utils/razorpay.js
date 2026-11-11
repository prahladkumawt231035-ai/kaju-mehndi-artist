/**
 * Dynamically loads the official Razorpay Checkout SDK
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * Opens Razorpay Checkout modal
 */
export const openRazorpayModal = async ({
    orderId,
    amount,
    currency = "INR",
    name = "Kaju Mehndi Artist",
    description = "Payment",
    prefill = {},
    onSuccess,
    onError,
}) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        if (onError) onError("SDK failed to load");
        return;
    }

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount,
        currency,
        name,
        description,
        order_id: orderId,
        prefill: {
            name: prefill.name || "Customer",
            email: prefill.email || "customer@example.com",
            contact: prefill.phone || "+919244836867",
        },
        theme: {
            color: "#70452C",
        },
        handler: function (response) {
            if (onSuccess) onSuccess(response);
        },
        modal: {
            ondismiss: function () {
                if (onError) onError("Payment modal dismissed by user");
            },
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};
