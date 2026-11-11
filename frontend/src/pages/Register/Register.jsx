import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo";
import API from "../../api/axios";
import { setCredentials } from "../../redux/features/auth/authSlice";
import "./Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const validateForm = () => {
        if (!name.trim() || name.trim().length < 2) {
            setErrorMsg("Please enter a valid full name (at least 2 characters)");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
            setErrorMsg("Please enter a valid email address");
            return false;
        }

        const cleanPhone = phone.replace(/[^0-9]/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            setErrorMsg("Please enter a valid 10-digit mobile number");
            return false;
        }

        if (!password || password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long");
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const { data } = await API.post("/auth/register", {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                password,
                role,
            });

            // Store token for persistence across sessions
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
                    "Registration failed. Please check your information and try again."
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
                    <h2>Join Kaju Mehndi</h2>
                    <p>Create an account to book Mehndi or enroll in our Academy</p>
                </div>

                {errorMsg && (
                    <div className="auth-error-banner">
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Account Type Selection */}
                <div className="auth-role-tabs">
                    <button
                        type="button"
                        className={`role-tab ${role === "customer" ? "active" : ""}`}
                        onClick={() => {
                            setRole("customer");
                            setErrorMsg("");
                        }}
                    >
                        Customer (Book Mehndi)
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

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="auth-field">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <User size={16} />
                            <input
                                type="text"
                                required
                                placeholder="Priya Sharma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

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
                        <label>Mobile / WhatsApp Number</label>
                        <div className="input-with-icon">
                            <Phone size={16} />
                            <input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Password (Min. 6 Characters)</label>
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
                        {loading ? "Creating Account..." : `Register as ${role === "student" ? "Student" : "Customer"}`}
                        <ArrowRight size={16} />
                    </button>
                </form>

                <div className="auth-footer-links">
                    <span>Already have an account?</span>
                    <Link to="/login" className="auth-switch-link">
                        Sign In here →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
