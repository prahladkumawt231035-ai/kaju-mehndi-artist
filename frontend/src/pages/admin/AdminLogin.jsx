import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo";
import API from "../../api/axios";
import { setCredentials } from "../../redux/features/auth/authSlice";
import "./AdminLogin.css";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const { data } = await API.post("/auth/login", {
                email: email.trim(),
                password,
            });

            if (data.user.role !== "admin") {
                setErrorMsg("Access Denied: Administrative privileges required. Normal accounts cannot access this portal.");
                setLoading(false);
                return;
            }

            // Save token and state
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch(setCredentials(data.user));

            navigate("/admin");
        } catch (error) {
            if (!error.response) {
                setErrorMsg("Backend server connect nahi ho paya. Backend server check karein (Port 5000).");
            } else {
                setErrorMsg(
                    error.response?.data?.message ||
                    "Authentication failed. Please verify administrative credentials."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div
                className="admin-login-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="admin-login-badge-wrap">
                    <span className="admin-login-badge">
                        <ShieldCheck size={14} /> ADMINISTRATIVE CONTROL PORTAL
                    </span>
                </div>

                <div className="admin-logo-center">
                    <BrandLogo size="medium" showTagline={false} />
                </div>

                <div className="admin-login-heading">
                    <h2>Studio Management Suite</h2>
                    <p>Restricted access for Kaju Mehndi business administration</p>
                </div>

                {errorMsg && (
                    <div className="admin-error-banner">
                        <AlertCircle size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleAdminLogin} className="admin-login-form">
                    <div className="admin-field">
                        <label>Administrative Email</label>
                        <div className="input-with-icon">
                            <Mail size={16} />
                            <input
                                type="email"
                                required
                                placeholder="kajal.kumawat.mehndi@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label>Security Password</label>
                        <div className="input-with-icon">
                            <Lock size={16} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            "Authenticating Administrative Access..."
                        ) : (
                            <>
                                Enter Management Console <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-security-note">
                    <p>🔒 256-bit encrypted administrative session. All activities are recorded.</p>
                    <Link to="/" className="back-to-site-link">
                        ← Return to Kaju Mehndi Website
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
