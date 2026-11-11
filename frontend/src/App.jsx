import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";
import Services from "./pages/Services/Services";
import Academy from "./pages/Academy/Academy";
import Booking from "./pages/Booking/Booking";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminLogin from "./pages/admin/AdminLogin";

// Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

// Protected Route Guard
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/features/auth/authSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <MainLayout>
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Public Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/academy" element={<Academy />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Secret Admin Login Portals */}
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/kaju-admin-login" element={<AdminLogin />} />

                        {/* Protected Portals with Role-Based Access Control */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customer"
                            element={
                                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student"
                            element={
                                <ProtectedRoute allowedRoles={["student", "admin"]}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </MainLayout>
        </BrowserRouter>
    );
}

export default App;
