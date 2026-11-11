import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import BrandLogo from "../common/BrandLogo";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice.js";
import API from "../../api/axios.js";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [academyOpen, setAcademyOpen] = useState(false);

    // Redux se logged-in user ki information
    const { user: currentUser, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();


    // Check login state on mount & route change
    // useEffect(() => {
    //     const userStr = localStorage.getItem("user");
    //     if (userStr) {
    //         try {
    //             setCurrentUser(JSON.parse(userStr));
    //         } catch (e) {
    //             setCurrentUser(null);
    //         }
    //     } else {
    //         setCurrentUser(null);
    //     }
    // }, [location]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setAcademyOpen(false);
    }, [location]);

    // const handleLogout = () => {
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("token");
    //     setCurrentUser(null);
    //     navigate("/login");
    // };
    
const handleLogout = async () => {
    try {
        await API.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
    }
};


    const isActive = (path) => location.pathname === path;

    // Public navigation links (Admin is NOT exposed here!)
    const navLinks = [
        { label: "Home", path: "/" },
        { label: "About Kaju", path: "/about" },
        { label: "Gallery", path: "/gallery" },
        { label: "Services", path: "/services" },
        {
            label: "Mehndi Academy",
            path: "/academy",
            dropdown: [
                { label: "All Courses", path: "/academy" },
                { label: "Bridal Course", path: "/academy" },
                { label: "Arabic Mehndi", path: "/academy" },
                { label: "Basic Course", path: "/academy" },
            ],
        },
        { label: "Contact", path: "/contact" },
    ];

    return (
        <motion.nav
            className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Custom Brand Logo */}
            <BrandLogo size="normal" showTagline={false} />

            {/* Desktop Nav Links */}
            <div className="nav-links">
                {navLinks.map((link) =>
                    link.dropdown ? (
                        <div
                            key={link.label}
                            className="nav-dropdown-wrapper"
                            onMouseEnter={() => setAcademyOpen(true)}
                            onMouseLeave={() => setAcademyOpen(false)}
                        >
                            <Link
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                            >
                                {link.label}
                                <ChevronDown size={13} className={`chevron ${academyOpen ? "chevron-open" : ""}`} />
                            </Link>
                            <AnimatePresence>
                                {academyOpen && (
                                    <motion.div
                                        className="dropdown-menu"
                                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {link.dropdown.map((item) => (
                                            <Link key={item.label} to={item.path} className="dropdown-item">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            key={link.label}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                        >
                            {link.label}
                        </Link>
                    )
                )}
            </div>

            {/* CTA & Auth Buttons */}
            <div className="nav-actions">
                <a
                    href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20want%20to%20inquire%20about%20Mehndi%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-whatsapp-btn"
                    title="WhatsApp Inquiry"
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>WhatsApp</span>
                </a>

                {/* Dynamic Auth or Dashboard Button */}
               {isAuthenticated && currentUser ? (
                    <div className="nav-user-cluster">
                        {currentUser.role === "admin" && (
                            <Link to="/admin" className="nav-admin-badge" title="Go to Admin Dashboard">
                                <Shield size={14} /> Admin
                            </Link>
                        )}
                        {currentUser.role === "student" && (
                            <Link to="/student" className="nav-portal-badge" title="Go to Classroom">
                                🎓 Classroom
                            </Link>
                        )}
                        {currentUser.role === "customer" && (
                            <Link to="/customer" className="nav-portal-badge" title="My Bookings">
                                <User size={14} /> Bookings
                            </Link>
                        )}

                        <button onClick={handleLogout} className="nav-logout-btn" title="Sign Out">
                            <LogOut size={15} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="nav-signin-btn">
                        <User size={15} />
                        <span>Sign In</span>
                    </Link>
                )}

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/booking" className="book-btn">
                        Book Now →
                    </Link>
                </motion.div>

                {/* Mobile Hamburger */}
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <AnimatePresence mode="wait">
                        {menuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={22} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={22} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            className="mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.div
                            className="mobile-drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="drawer-header">
                                <BrandLogo size="normal" showTagline={true} />
                            </div>

                            <div className="drawer-links">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ x: 30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className={`drawer-link ${isActive(link.path) ? "drawer-link-active" : ""}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {isAuthenticated && currentUser ? (
                                    <>
                                        {currentUser.role === "admin" && (
                                            <Link to="/admin" className="drawer-link" style={{ color: "#70452C", fontWeight: "700" }}>
                                                👑 Admin Dashboard
                                            </Link>
                                        )}
                                        {currentUser.role === "student" && (
                                            <Link to="/student" className="drawer-link">
                                                🎓 Student LMS Classroom
                                            </Link>
                                        )}
                                        {currentUser.role === "customer" && (
                                            <Link to="/customer" className="drawer-link">
                                                👤 My Bookings Portal
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="drawer-link" style={{ border: "none", background: "none", textAlign: "left", color: "#e74c3c", cursor: "pointer" }}>
                                            🚪 Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="drawer-link" style={{ fontWeight: "700", color: "#70452C" }}>
                                        👤 Sign In / Register
                                    </Link>
                                )}
                            </div>

                            <div className="drawer-cta">
                                <Link to="/booking" className="drawer-book-btn">
                                    Book Your Mehndi →
                                </Link>
                                <a
                                    href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20want%20to%20book%20Mehndi."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="drawer-whatsapp-btn"
                                >
                                    WhatsApp Us
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
