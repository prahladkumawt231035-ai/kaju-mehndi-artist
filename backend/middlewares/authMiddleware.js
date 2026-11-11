// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // Verify user is authenticated
// export const protect = async (req, res, next) => {
//     let token;

//     // Check cookie first, then Bearer header
//     if (req.cookies && req.cookies.token) {
//         token = req.cookies.token;
//     } else if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//     ) {
//         token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token || token === "none") {
//         return res.status(401).json({
//             success: false,
//             message: "Not authorized to access this route. Please log in.",
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "kaju5201314");
//         req.user = await User.findById(decoded.id).select("-password");

//         if (!req.user || !req.user.isActive) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User account no longer active or exists.",
//             });
//         }

//         next();
//     } catch (err) {
//         return res.status(401).json({
//             success: false,
//             message: "Session expired or invalid token. Please log in again.",
//         });
//     }
// };

// // Grant access to specific roles (RBAC)
// export const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!req.user || !roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 success: false,
//                 message: `User role '${req.user?.role}' is unauthorized to access this route.`,
//             });
//         }
//         next();
//     };
// };
// *********************



import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify Authentication
export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (
            req.headers.authorization?.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User not found or account inactive",
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please login again.",
        });
    }
};

// Verify Authorization
export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
        }

        next();
    };
};


