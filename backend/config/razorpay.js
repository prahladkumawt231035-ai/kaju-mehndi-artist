// import Razorpay from "razorpay";
// import dotenv from "dotenv";

// dotenv.config();

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
//     key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
// });

// export default razorpay;

import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    })
    : null;

export const isRazorpayEnabled = Boolean(razorpay);

export default razorpay;
