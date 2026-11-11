import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo";
import API from "../../api/axios";
import { setCredentials } from "../../redux/features/auth/authSlice";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const { data } = await API.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });

            // Persist token & user for authentication
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            localStorage.setItem("user", JSON.stringify(data.user));

            // Update Redux state
            dispatch(setCredentials(data.user));

            // Check if user came from a specific page (e.g. /booking)
            const redirectUrl = new URLSearchParams(location.search).get("redirect") || location.state?.from;

            if (redirectUrl) {
                navigate(redirectUrl);
            } else if (data.user.role === "admin") {
                navigate("/admin");
            } else if (data.user.role === "student") {
                navigate("/student");
            } else {
                navigate("/customer");
            }
        } catch (error) {
            if (!error.response) {
                setErrorMsg("Backend server se connect nahi ho paya. Backend port 5000 check karein.");
            } else {
                setErrorMsg(
                    error.response?.data?.message ||
                    "Failed to sign in. Please verify your email and password."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="auth-logo-center">
                    <BrandLogo size="large" showTagline={true} />
                </div>

                <div className="auth-heading">
                    <h2>Sign In to Your Account</h2>
                    <p>Track your appointments or access your academy classroom</p>
                </div>

                {errorMsg && (
                    <div className="auth-error-banner">
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Role Tabs for Public Visitors */}
                <div className="auth-role-tabs">
                    <button
                        type="button"
                        className={`role-tab ${role === "customer" ? "active" : ""}`}
                        onClick={() => {
                            setRole("customer");
                            setErrorMsg("");
                        }}
                    >
                        Customer (Bookings)
                    </button>

                    <button
                        type="button"
                        className={`role-tab ${role === "student" ? "active" : ""}`}
                        onClick={() => {
                            setRole("student");
                            setErrorMsg("");
                        }}
                    >
                        Academy Student
                    </button>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="auth-field">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={16} />
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={16} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                        <ArrowRight size={16} />
                    </button>
                </form>

                <div className="auth-footer-links">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="auth-switch-link">
                        Create an account →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
