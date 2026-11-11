import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Users, GraduationCap, DollarSign, Image as ImageIcon,
    CheckCircle, XCircle, Search, Plus, RefreshCw, Edit2, Trash2,
    MessageSquare, BookOpen, Layers, Eye, X, Save, ChevronDown,
    CreditCard, LogOut, ExternalLink, MessageCircle, Phone, Mail, MapPin, Clock,
    Star
} from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo";
import API from "../../api/axios";
import { logout } from "../../redux/features/auth/authSlice.js";
import "./AdminDashboard.css";

/* ───────────────────────────────────────────
   TINY MODAL COMPONENT (inline)
─────────────────────────────────────────── */
const Modal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: "#FFFDF8", borderRadius: "14px", width: "100%",
                    maxWidth: "640px", maxHeight: "90vh", overflowY: "auto",
                    boxShadow: "0 24px 80px rgba(61,33,23,0.35)"
                }}
            >
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", borderBottom: "1px solid #E8D5BD",
                    background: "linear-gradient(135deg,#3D2117,#70452C)", borderRadius: "14px 14px 0 0"
                }}>
                    <h3 style={{ color: "#FFFDF8", margin: 0, fontFamily: "'Playfair Display',serif", fontSize: "1.1rem" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#B89A70" }}>
                        <X size={20} />
                    </button>
                </div>
                <div style={{ padding: "24px" }}>{children}</div>
            </motion.div>
        </div>
    );
};

/* ───────────────────────────────────────────
   FORM INPUT HELPER
─────────────────────────────────────────── */
const FormGroup = ({ label, children }) => (
    <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: 600, color: "#3D2117", marginBottom: "6px", fontSize: "0.88rem" }}>{label}</label>
        {children}
    </div>
);

const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1.5px solid #E8D5BD", fontSize: "0.9rem", color: "#3D2117",
    background: "#F4EBDD", outline: "none", boxSizing: "border-box"
};

const textareaStyle = { ...inputStyle, minHeight: "90px", resize: "vertical" };

/* ───────────────────────────────────────────
   STATUS BADGE HELPER
─────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        pending:   { bg: "#fff3cd", color: "#856404", label: "Pending" },
        confirmed: { bg: "#d1e7dd", color: "#0a3622", label: "Confirmed" },
        completed: { bg: "#cff4fc", color: "#055160", label: "Completed" },
        cancelled: { bg: "#f8d7da", color: "#58151c", label: "Cancelled" },
        paid:      { bg: "#d1e7dd", color: "#0a3622", label: "Paid" },
        created:   { bg: "#fff3cd", color: "#856404", label: "Created" },
        failed:    { bg: "#f8d7da", color: "#58151c", label: "Failed" },
        new:       { bg: "#dbeafe", color: "#1e3a8a", label: "New" },
        read:      { bg: "#f3f4f6", color: "#374151", label: "Read" },
        replied:   { bg: "#d1e7dd", color: "#0a3622", label: "Replied" },
        closed:    { bg: "#f8d7da", color: "#58151c", label: "Closed" },
    };
    const s = map[status] || { bg: "#f3f4f6", color: "#374151", label: status };
    return (
        <span style={{
            background: s.bg, color: s.color, padding: "3px 10px",
            borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700
        }}>{s.label}</span>
    );
};

/* ═══════════════════════════════════════════
   MAIN ADMIN DASHBOARD
═══════════════════════════════════════════ */
const AdminDashboard = () => {
    const TABS = ["bookings", "services", "courses", "students", "enquiries", "payments", "gallery", "reviews"];

    const [activeTab, setActiveTab]   = useState("bookings");
    const [loading, setLoading]       = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Data states
    const [stats, setStats]           = useState({});
    const [bookings, setBookings]     = useState([]);
    const [services, setServices]     = useState([]);
    const [courses, setCourses]       = useState([]);
    const [students, setStudents]     = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [enquiries, setEnquiries]   = useState([]);
    const [payments, setPayments]     = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [reviews, setReviews]       = useState([]);

    // Modal state
    const [modal, setModal] = useState({ open: false, type: "", data: null });
    // type: "addService" | "editService" | "addCourse" | "editCourse" | "viewEnquiry" | "viewBooking"

    // Form states
    const [svcForm, setSvcForm] = useState({ title: "", description: "", startingPrice: "", duration: "", features: "" });
    const [courseForm, setCourseForm] = useState({ title: "", description: "", level: "Beginner", duration: "", mode: "Online & Offline", fees: "", curriculum: "" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch(logout());
            navigate("/admin-login");
        }
    };

    /* ─── FETCH ALL DATA ─── */
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [
                statsRes,
                bookingsRes,
                servicesRes,
                coursesRes,
                studentsRes,
                enquiriesRes,
                paymentsRes,
                galleryRes,
                enrollmentsRes,
                reviewsRes,
            ] = await Promise.allSettled([
                API.get("/dashboard/stats"),
                API.get("/bookings"),
                API.get("/services"),
                API.get("/courses"),
                API.get("/auth/users?role=student").catch(() => null),
                API.get("/enquiries"),
                API.get("/payments").catch(() => null),
                API.get("/gallery").catch(() => null),
                API.get("/enrollments").catch(() => null),
                API.get("/reviews/all").catch(() => null),
            ]);

            if (statsRes.status === "fulfilled") setStats(statsRes.value.data.stats || {});
            if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value.data.bookings || []);
            if (servicesRes.status === "fulfilled") setServices(servicesRes.value.data.services || []);
            if (coursesRes.status === "fulfilled") setCourses(coursesRes.value.data.courses || []);
            if (studentsRes.status === "fulfilled" && studentsRes.value?.data?.users) {
                setStudents(studentsRes.value.data.users);
            }
            if (enquiriesRes.status === "fulfilled") setEnquiries(enquiriesRes.value.data.enquiries || []);
            if (paymentsRes.status === "fulfilled" && paymentsRes.value?.data?.payments) {
                setPayments(paymentsRes.value.data.payments);
            }
            if (galleryRes.status === "fulfilled" && galleryRes.value?.data?.items) {
                setGalleryItems(galleryRes.value.data.items);
            }
            if (enrollmentsRes.status === "fulfilled" && enrollmentsRes.value?.data?.enrollments) {
                setEnrollments(enrollmentsRes.value.data.enrollments);
            }
            if (reviewsRes.status === "fulfilled" && reviewsRes.value?.data?.reviews) {
                setReviews(reviewsRes.value.data.reviews);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ─── BOOKING STATUS UPDATE ─── */
    const updateBookingStatus = async (id, newStatus) => {
        try {
            await API.patch(`/bookings/${id}/status`, { status: newStatus });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
            fetchAll(); // refresh stats
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update booking");
        }
    };

    /* ─── ENQUIRY STATUS UPDATE ─── */
    const updateEnquiryStatus = async (id, status) => {
        try {
            await API.patch(`/enquiries/${id}`, { status });
            setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
            setModal(m => ({ ...m, data: { ...m.data, status } }));
        } catch (err) {
            alert("Failed to update enquiry");
        }
    };

    /* ─── DELETE ENQUIRY ─── */
    const deleteEnquiry = async (id) => {
        if (!window.confirm("Is enquiry ko delete karein?")) return;
        try {
            await API.delete(`/enquiries/${id}`);
            setEnquiries(prev => prev.filter(e => e._id !== id));
            setModal({ open: false, type: "", data: null });
        } catch (err) {
            alert("Failed to delete enquiry");
        }
    };

    /* ─── DELETE GALLERY DESIGN ─── */
    const deleteGalleryDesign = async (id) => {
        if (!window.confirm("Kya aap sach me is Mehndi design ko Gallery se delete karna chahte hain?")) return;
        try {
            await API.delete(`/gallery/${id}`);
            setGalleryItems(prev => prev.filter(g => g._id !== id));
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete design");
        }
    };

    /* ─── SERVICE SAVE (create/update) ─── */
    const openAddService = () => {
        setSvcForm({ title: "", description: "", startingPrice: "", duration: "", features: "" });
        setFormError("");
        setModal({ open: true, type: "addService", data: null });
    };
    const openEditService = (svc) => {
        setSvcForm({
            title: svc.title,
            description: svc.description,
            startingPrice: svc.startingPrice,
            duration: svc.duration || "",
            features: Array.isArray(svc.features) ? svc.features.join("\n") : "",
        });
        setFormError("");
        setModal({ open: true, type: "editService", data: svc });
    };
    const saveService = async () => {
        if (!svcForm.title || !svcForm.description || !svcForm.startingPrice) {
            setFormError("Title, description aur price required hai!"); return;
        }
        setSaving(true); setFormError("");
        try {
            const payload = {
                title: svcForm.title,
                description: svcForm.description,
                startingPrice: Number(svcForm.startingPrice),
                duration: svcForm.duration,
                features: svcForm.features.split("\n").map(f => f.trim()).filter(Boolean),
            };
            if (modal.type === "addService") {
                const { data } = await API.post("/services", payload);
                setServices(prev => [...prev, data.service]);
            } else {
                const { data } = await API.put(`/services/${modal.data._id}`, payload);
                setServices(prev => prev.map(s => s._id === modal.data._id ? data.service : s));
            }
            setModal({ open: false, type: "", data: null });
            fetchAll();
        } catch (err) {
            setFormError(err.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };
    const deleteService = async (id) => {
        if (!window.confirm("Is service ko delete karein?")) return;
        try {
            await API.delete(`/services/${id}`);
            setServices(prev => prev.filter(s => s._id !== id));
        } catch (err) { alert("Delete failed"); }
    };

    /* ─── COURSE SAVE (create/update) ─── */
    const openAddCourse = () => {
        setCourseForm({ title: "", description: "", level: "Beginner", duration: "", mode: "Online & Offline", fees: "", curriculum: "" });
        setFormError("");
        setModal({ open: true, type: "addCourse", data: null });
    };
    const openEditCourse = (course) => {
        setCourseForm({
            title: course.title,
            description: course.description,
            level: course.level || "Beginner",
            duration: course.duration,
            mode: course.mode || "Online & Offline",
            fees: course.fees,
            curriculum: Array.isArray(course.curriculum) ? course.curriculum.join("\n") : "",
        });
        setFormError("");
        setModal({ open: true, type: "editCourse", data: course });
    };
    const saveCourse = async () => {
        if (!courseForm.title || !courseForm.description || !courseForm.fees || !courseForm.duration) {
            setFormError("Title, description, duration aur fees required hai!"); return;
        }
        setSaving(true); setFormError("");
        try {
            const payload = {
                title: courseForm.title,
                description: courseForm.description,
                level: courseForm.level,
                duration: courseForm.duration,
                mode: courseForm.mode,
                fees: Number(courseForm.fees),
                curriculum: courseForm.curriculum.split("\n").map(c => c.trim()).filter(Boolean),
            };
            if (modal.type === "addCourse") {
                const { data } = await API.post("/courses", payload);
                setCourses(prev => [...prev, data.course]);
            } else {
                const { data } = await API.put(`/courses/${modal.data._id}`, payload);
                setCourses(prev => prev.map(c => c._id === modal.data._id ? data.course : c));
            }
            setModal({ open: false, type: "", data: null });
            fetchAll();
        } catch (err) {
            setFormError(err.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };
    const deleteCourse = async (id) => {
        if (!window.confirm("Is course ko delete karein?")) return;
        try {
            await API.delete(`/courses/${id}`);
            setCourses(prev => prev.filter(c => c._id !== id));
        } catch (err) { alert("Delete failed"); }
    };

    /* ─── FILTER ─── */
    const filteredBookings = bookings.filter(b => {
        const q = searchTerm.toLowerCase();
        const matchSearch =
            (b.fullName || b.clientName || "").toLowerCase().includes(q) ||
            (b.phone || "").includes(q) ||
            (b.service || "").toLowerCase().includes(q) ||
            (b.email || "").toLowerCase().includes(q);
        const matchStatus = filterStatus === "all" || b.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const filteredEnquiries = enquiries.filter(e => {
        const q = searchTerm.toLowerCase();
        return (e.name || "").toLowerCase().includes(q) ||
            (e.email || "").toLowerCase().includes(q) ||
            (e.subject || "").toLowerCase().includes(q);
    });

    const filteredPayments = payments.filter(p => {
        const q = searchTerm.toLowerCase();
        return (p.user?.name || "").toLowerCase().includes(q) ||
            (p.user?.email || "").toLowerCase().includes(q) ||
            (p.razorpayOrderId || "").toLowerCase().includes(q) ||
            (p.razorpayPaymentId || "").toLowerCase().includes(q) ||
            String(p.amount || "").includes(q);
    });

    const filteredReviews = reviews.filter(r => {
        const q = searchTerm.toLowerCase();
        return (r.user?.name || "").toLowerCase().includes(q) ||
            (r.comment || "").toLowerCase().includes(q) ||
            (r.serviceName || "").toLowerCase().includes(q);
    });

    /* ─── DELETE REVIEW (Admin) ─── */
    const deleteReview = async (id) => {
        if (!window.confirm("Is review ko delete karein?")) return;
        try {
            await API.delete(`/reviews/${id}`);
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    /* ─── TOGGLE REVIEW APPROVAL (Admin) ─── */
    const toggleReviewApproval = async (id, isApproved) => {
        try {
            const { data } = await API.patch(`/reviews/${id}/approve`, { isApproved });
            setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: data.review.isApproved } : r));
        } catch (err) {
            alert("Failed to update review approval");
        }
    };

    /* ─── STAT CARD ─── */
    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div className="astat-card" whileHover={{ y: -4 }}>
            <div className={`astat-icon ${color}`}><Icon size={22} /></div>
            <div className="astat-info">
                <span>{label}</span>
                <strong>{value ?? 0}</strong>
            </div>
        </motion.div>
    );

    /* ─── BOOKING DETAIL MODAL ─── */
    const BookingModal = () => {
        const b = modal.data;
        if (!b) return null;
        return (
            <Modal open={modal.open && modal.type === "viewBooking"} onClose={() => setModal({ open: false, type: "", data: null })} title="Booking Full Details">
                <div style={{ lineHeight: "1.9", fontSize: "0.92rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div><strong>Client Name:</strong> {b.fullName || b.clientName}</div>
                        <div><strong>Contact Phone:</strong> {b.phone}</div>
                        <div><strong>Email Address:</strong> {b.email || "—"}</div>
                        <div><strong>Event Type:</strong> <span style={{ background: "#E8D5BD", color: "#70452C", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{b.eventType || "Mehndi Function"}</span></div>
                        <div><strong>Service:</strong> {b.service || "—"}</div>
                        <div><strong>Preferred Time:</strong> {b.preferredTime || b.eventTime || "—"}</div>
                        <div><strong>Event Date:</strong> {b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-IN") : "—"}</div>
                        <div>
                            <strong>Advance Payment:</strong>{" "}
                            {b.advancePaid ? (
                                <span className="badge-advance-paid">₹ Advance Paid ({b.razorpayPaymentId ? "Razorpay" : "Confirmed"})</span>
                            ) : (
                                <span className="badge-advance-pending">Unpaid (Cash / On-Site)</span>
                            )}
                        </div>
                    </div>
                    <p style={{ margin: "10px 0 4px" }}><strong>Event Address / Venue:</strong></p>
                    <div style={{ background: "#F4EBDD", borderRadius: "8px", padding: "12px", color: "#3D2117" }}>
                        {b.eventLocation || b.location || "Location not provided"}
                    </div>
                    {b.additionalRequirements && (
                        <>
                            <p style={{ margin: "12px 0 4px" }}><strong>Additional Requirements / Special Notes:</strong></p>
                            <div style={{ background: "#FFF3CD", borderRadius: "8px", padding: "12px", color: "#856404" }}>
                                {b.additionalRequirements}
                            </div>
                        </>
                    )}
                    <p style={{ marginTop: "14px" }}><strong>Status:</strong> <StatusBadge status={b.status} /></p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E8D5BD" }}>
                    {b.status !== "confirmed" && (
                        <button className="btn-edit" onClick={() => { updateBookingStatus(b._id, "confirmed"); setModal({ open: false, type: "", data: null }); }}>
                            Mark as Confirmed
                        </button>
                    )}
                    {b.status !== "completed" && (
                        <button className="btn-edit" onClick={() => { updateBookingStatus(b._id, "completed"); setModal({ open: false, type: "", data: null }); }} style={{ background: "#0a3622", color: "#fff" }}>
                            Mark Completed
                        </button>
                    )}
                    {b.status !== "cancelled" && (
                        <button className="btn-delete" onClick={() => { updateBookingStatus(b._id, "cancelled"); setModal({ open: false, type: "", data: null }); }}>
                            Cancel Booking
                        </button>
                    )}
                    <a
                        href={`https://wa.me/91${b.phone?.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(b.fullName || b.clientName)}!%20Kaju%20Mehndi%20Artist%20se%20aapki%20${encodeURIComponent(b.service)}%20booking%20ki%20details%20confirm%20karne%20ke%20liye%20message%20kar%20rahe%20hain.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-sm"
                        style={{ marginLeft: "auto", padding: "8px 16px", fontSize: "13px" }}
                    >
                        <MessageCircle size={15} /> WhatsApp Client
                    </a>
                </div>
            </Modal>
        );
    };

    /* ─── SERVICE FORM MODAL ─── */
    const ServiceFormModal = () => (
        <Modal
            open={modal.open && (modal.type === "addService" || modal.type === "editService")}
            onClose={() => setModal({ open: false, type: "", data: null })}
            title={modal.type === "addService" ? "Nayi Service Add Karo" : "Service Edit Karo"}
        >
            {formError && <div style={{ background: "#f8d7da", color: "#58151c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.88rem" }}>{formError}</div>}
            <FormGroup label="Service Title *">
                <input style={inputStyle} value={svcForm.title} onChange={e => setSvcForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Royal Bridal Mehndi" />
            </FormGroup>
            <FormGroup label="Description *">
                <textarea style={textareaStyle} value={svcForm.description} onChange={e => setSvcForm(p => ({ ...p, description: e.target.value }))} placeholder="Service ki detail..." />
            </FormGroup>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormGroup label="Starting Price (₹) *">
                    <input style={inputStyle} type="number" value={svcForm.startingPrice} onChange={e => setSvcForm(p => ({ ...p, startingPrice: e.target.value }))} placeholder="e.g. 5100" />
                </FormGroup>
                <FormGroup label="Duration">
                    <input style={inputStyle} value={svcForm.duration} onChange={e => setSvcForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 4-6 Hours" />
                </FormGroup>
            </div>
            <FormGroup label="Features (ek line me ek feature)">
                <textarea style={textareaStyle} value={svcForm.features} onChange={e => setSvcForm(p => ({ ...p, features: e.target.value }))} placeholder={"Natural organic henna\nFree aftercare kit\nHome service available"} />
            </FormGroup>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button onClick={() => setModal({ open: false, type: "", data: null })} style={{ padding: "10px 22px", borderRadius: "8px", border: "1.5px solid #B89A70", background: "transparent", cursor: "pointer", color: "#70452C", fontWeight: 600 }}>Cancel</button>
                <button onClick={saveService} disabled={saving} style={{ padding: "10px 22px", borderRadius: "8px", background: "#70452C", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Save size={15} /> {saving ? "Saving..." : "Save Service"}
                </button>
            </div>
        </Modal>
    );

    /* ─── COURSE FORM MODAL ─── */
    const CourseFormModal = () => (
        <Modal
            open={modal.open && (modal.type === "addCourse" || modal.type === "editCourse")}
            onClose={() => setModal({ open: false, type: "", data: null })}
            title={modal.type === "addCourse" ? "Naaya Course Add Karo" : "Course Edit Karo"}
        >
            {formError && <div style={{ background: "#f8d7da", color: "#58151c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.88rem" }}>{formError}</div>}
            <FormGroup label="Course Title *">
                <input style={inputStyle} value={courseForm.title} onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Professional Bridal Mehndi Artistry" />
            </FormGroup>
            <FormGroup label="Description *">
                <textarea style={textareaStyle} value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} placeholder="Course ki detail..." />
            </FormGroup>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormGroup label="Level">
                    <select style={inputStyle} value={courseForm.level} onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All-in-One</option>
                    </select>
                </FormGroup>
                <FormGroup label="Mode">
                    <select style={inputStyle} value={courseForm.mode} onChange={e => setCourseForm(p => ({ ...p, mode: e.target.value }))}>
                        <option>Online & Offline</option>
                        <option>Online</option>
                        <option>Offline</option>
                    </select>
                </FormGroup>
                <FormGroup label="Duration *">
                    <input style={inputStyle} value={courseForm.duration} onChange={e => setCourseForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 4 Weeks (20 Sessions)" />
                </FormGroup>
                <FormGroup label="Fees (₹) *">
                    <input style={inputStyle} type="number" value={courseForm.fees} onChange={e => setCourseForm(p => ({ ...p, fees: e.target.value }))} placeholder="e.g. 6999" />
                </FormGroup>
            </div>
            <FormGroup label="Curriculum Highlights (ek line me ek topic)">
                <textarea style={textareaStyle} value={courseForm.curriculum} onChange={e => setCourseForm(p => ({ ...p, curriculum: e.target.value }))} placeholder={"Cone rolling & henna paste\nBasic strokes & spirals\nBridal portrait techniques"} />
            </FormGroup>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button onClick={() => setModal({ open: false, type: "", data: null })} style={{ padding: "10px 22px", borderRadius: "8px", border: "1.5px solid #B89A70", background: "transparent", cursor: "pointer", color: "#70452C", fontWeight: 600 }}>Cancel</button>
                <button onClick={saveCourse} disabled={saving} style={{ padding: "10px 22px", borderRadius: "8px", background: "#70452C", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Save size={15} /> {saving ? "Saving..." : "Save Course"}
                </button>
            </div>
        </Modal>
    );

    /* ─── ENQUIRY VIEW MODAL ─── */
    const EnquiryModal = () => {
        const e = modal.data;
        if (!e) return null;
        return (
            <Modal open={modal.open && modal.type === "viewEnquiry"} onClose={() => setModal({ open: false, type: "", data: null })} title="Enquiry Detail">
                <div style={{ lineHeight: "1.9" }}>
                    <p><strong>Name:</strong> {e.name}</p>
                    <p><strong>Email:</strong> {e.email}</p>
                    <p><strong>Phone:</strong> {e.phone || "—"}</p>
                    <p><strong>Subject:</strong> {e.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style={{ background: "#F4EBDD", borderRadius: "8px", padding: "14px", whiteSpace: "pre-wrap", fontSize: "0.9rem", color: "#3D2117" }}>{e.message}</div>
                    <p style={{ marginTop: "14px" }}><strong>Status:</strong> <StatusBadge status={e.status} /></p>
                    <p><strong>Received:</strong> {new Date(e.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                    {["new", "read", "replied", "closed"].map(s => (
                        <button key={s} onClick={() => updateEnquiryStatus(e._id, s)}
                            style={{ padding: "7px 16px", borderRadius: "50px", border: "1.5px solid #B89A70", background: e.status === s ? "#70452C" : "transparent", color: e.status === s ? "#fff" : "#70452C", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", textTransform: "capitalize" }}>
                            {s}
                        </button>
                    ))}
                    <a href={`https://wa.me/91${e.phone?.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(e.name)}!%20Aapki%20enquiry%20ke%20baare%20mein%20baat%20karna%20tha.`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ padding: "7px 16px", borderRadius: "50px", background: "#25D366", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "5px" }}>
                        WhatsApp Reply
                    </a>
                    <button onClick={() => deleteEnquiry(e._id)}
                        style={{ padding: "7px 16px", borderRadius: "50px", border: "1.5px solid #dc3545", background: "transparent", color: "#dc3545", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", marginLeft: "auto" }}>
                        Delete
                    </button>
                </div>
            </Modal>
        );
    };

    /* ─────────── RENDER ─────────── */
    return (
        <div className="admin-page">
            <BookingModal />
            <ServiceFormModal />
            <CourseFormModal />
            <EnquiryModal />

            {/* ── TOP BAR ── */}
            <div className="admin-header">
                <div>
                    <span className="admin-badge">👑 BUSINESS ADMIN PORTAL</span>
                    <h1>Kaju Mehndi Management Suite</h1>
                    <p>Live business performance — bookings, services, courses, payments & enquiries.</p>
                </div>
                <div className="admin-header-actions">
                    <Link to="/" className="admin-header-btn" title="Open Public Website">
                        <ExternalLink size={14} /> View Website
                    </Link>
                    <Link to="/gallery" className="admin-header-btn" title="Manage Gallery Photos">
                        <ImageIcon size={14} /> Gallery Studio
                    </Link>
                    <button onClick={fetchAll} className="admin-header-btn" title="Refresh Live Data">
                        <RefreshCw size={14} className={loading ? "spin-anim" : ""} /> Refresh
                    </button>
                    <button onClick={handleLogout} className="admin-header-btn logout" title="Sign Out of Portal">
                        <LogOut size={14} /> Sign Out
                    </button>
                    <BrandLogo size="small" showTagline={false} />
                </div>
            </div>

            <div className="admin-body">

                {/* ── STATS GRID ── */}
                <div className="admin-stats-grid">
                    <StatCard icon={DollarSign}    label="Total Revenue"   value={`₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`} color="gold" />
                    <StatCard icon={Calendar}       label="Total Bookings"  value={stats.totalBookings}    color="brown" />
                    <StatCard icon={CheckCircle}    label="Confirmed"       value={stats.confirmedBookings} color="green" />
                    <StatCard icon={Users}          label="Customers"       value={stats.totalCustomers}   color="blue" />
                    <StatCard icon={GraduationCap}  label="Students"        value={stats.totalStudents}    color="purple" />
                    <StatCard icon={BookOpen}       label="Courses"         value={stats.totalCourses}     color="brown" />
                    <StatCard icon={CreditCard}     label="Online Orders"   value={payments.length}        color="gold" />
                    <StatCard icon={MessageSquare}  label="Enquiries"       value={enquiries.length}       color="blue" />
                </div>

                {/* ── TABS ── */}
                <div className="admin-tabs">
                    {TABS.map(tab => (
                        <button key={tab} className={`admin-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => { setActiveTab(tab); setSearchTerm(""); setFilterStatus("all"); }}>
                            {tab === "bookings"  && <Calendar size={14} />}
                            {tab === "services"  && <Layers size={14} />}
                            {tab === "courses"   && <BookOpen size={14} />}
                            {tab === "students"  && <GraduationCap size={14} />}
                            {tab === "enquiries" && <MessageSquare size={14} />}
                            {tab === "payments"  && <CreditCard size={14} />}
                            {tab === "gallery"   && <ImageIcon size={14} />}
                            {tab === "reviews"   && <Star size={14} />}
                            <span style={{ textTransform: "capitalize" }}>{tab}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#70452C" }}>
                        <RefreshCw size={32} className="spin-anim" />
                        <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading latest studio data...</p>
                    </div>
                ) : (

                <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                {/* ════════════ BOOKINGS TAB ════════════ */}
                {activeTab === "bookings" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Live Bookings ({bookings.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>Manage appointments, confirm dates, and contact brides directly via WhatsApp.</p>
                            </div>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <div style={{ position: "relative" }}>
                                    <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#B89A70" }} />
                                    <input style={{ ...inputStyle, paddingLeft: "32px", width: "200px", background: "#F4EBDD" }} placeholder="Search name, phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <select style={{ ...inputStyle, width: "140px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p style={{ color: "#8B6A4E", textAlign: "center", padding: "40px" }}>Koi booking nahi mili.</p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Service & Event</th>
                                            <th>Event Date & Time</th>
                                            <th>Advance Status</th>
                                            <th>Status</th>
                                            <th>Quick Contact & Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map(b => (
                                            <tr key={b._id}>
                                                <td>
                                                    <strong>{b.fullName || b.clientName}</strong><br />
                                                    <small style={{ color: "#8B6A4E" }}>{b.phone}</small><br />
                                                    <small style={{ color: "#8B6A4E" }}>{b.email}</small>
                                                </td>
                                                <td>
                                                    <strong style={{ color: "#70452C" }}>{b.service || "—"}</strong><br />
                                                    <span style={{ fontSize: "11px", background: "#E8D5BD", color: "#3D2117", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                                                        {b.eventType || "Event"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-IN") : "—"}</strong><br />
                                                    <small style={{ color: "#8B6A4E" }}>🕒 {b.preferredTime || b.eventTime || "Flexible"}</small>
                                                </td>
                                                <td>
                                                    {b.advancePaid ? (
                                                        <span className="badge-advance-paid">₹ Advance Paid</span>
                                                    ) : (
                                                        <span className="badge-advance-pending">Unpaid (Cash/Direct)</span>
                                                    )}
                                                </td>
                                                <td><StatusBadge status={b.status} /></td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                                        <button
                                                            className="btn-view-sm"
                                                            onClick={() => setModal({ open: true, type: "viewBooking", data: b })}
                                                            title="View full booking & venue details"
                                                        >
                                                            <Eye size={12} /> View
                                                        </button>

                                                        <a
                                                            href={`https://wa.me/91${b.phone?.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(b.fullName || b.clientName)}!%20Kaju%20Mehndi%20Artist%20se%20aapki%20${encodeURIComponent(b.service)}%20booking%20ki%20details%20confirm%20karne%20ke%20liye%20message%20kar%20rahe%20hain.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn-whatsapp-sm"
                                                            title="Chat directly on WhatsApp"
                                                        >
                                                            <MessageCircle size={12} /> WhatsApp
                                                        </a>

                                                        {b.status !== "confirmed" && (
                                                            <button className="btn-edit" onClick={() => updateBookingStatus(b._id, "confirmed")}>
                                                                Confirm
                                                            </button>
                                                        )}
                                                        {b.status !== "completed" && (
                                                            <button className="btn-edit" onClick={() => updateBookingStatus(b._id, "completed")} style={{ background: "#0a3622", color: "#fff" }}>
                                                                Done
                                                            </button>
                                                        )}
                                                        {b.status !== "cancelled" && (
                                                            <button className="btn-delete" onClick={() => updateBookingStatus(b._id, "cancelled")}>
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ SERVICES TAB ════════════ */}
                {activeTab === "services" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Mehndi Services ({services.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>Update package prices and descriptions live on your public Services page.</p>
                            </div>
                            <button onClick={openAddService} className="primary-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Plus size={15} /> Add Service
                            </button>
                        </div>
                        {services.length === 0 ? (
                            <p style={{ color: "#8B6A4E", textAlign: "center", padding: "40px" }}>Koi service nahi mili. Nayi service add karo.</p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Service Name</th>
                                            <th>Starting Price</th>
                                            <th>Duration</th>
                                            <th>Features</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(svc => (
                                            <tr key={svc._id}>
                                                <td><strong>{svc.title}</strong><br /><small style={{ color: "#8B6A4E" }}>{(svc.description || "").slice(0, 60)}...</small></td>
                                                <td><strong style={{ color: "#70452C", fontSize: "1.05rem" }}>₹{svc.startingPrice?.toLocaleString("en-IN")}</strong></td>
                                                <td>{svc.duration || "—"}</td>
                                                <td>{(svc.features || []).length} features listed</td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button className="btn-edit" onClick={() => openEditService(svc)} style={{ display: "flex", alignItems: "center", gap: "4px" }}><Edit2 size={13} /> Edit</button>
                                                        <button className="btn-delete" onClick={() => deleteService(svc._id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}><Trash2 size={13} /> Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ COURSES TAB ════════════ */}
                {activeTab === "courses" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Academy Courses ({courses.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>Manage professional Mehndi training syllabus, course fees and batch timings.</p>
                            </div>
                            <button onClick={openAddCourse} className="primary-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Plus size={15} /> Add Course
                            </button>
                        </div>
                        {courses.length === 0 ? (
                            <p style={{ color: "#8B6A4E", textAlign: "center", padding: "40px" }}>Koi course nahi mila. Naya course add karo.</p>
                        ) : (
                            <div className="admin-courses-grid">
                                {courses.map(c => (
                                    <div key={c._id} className="admin-course-item">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                            <span style={{ background: "#E8D5BD", color: "#70452C", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px" }}>{c.level}</span>
                                            <span style={{ background: "#F4EBDD", color: "#3D2117", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px" }}>{c.mode}</span>
                                        </div>
                                        <h4 style={{ margin: "0 0 6px", color: "#3D2117", fontFamily: "'Playfair Display', serif" }}>{c.title}</h4>
                                        <p style={{ color: "#8B6A4E", fontSize: "0.85rem", marginBottom: "10px" }}>{(c.description || "").slice(0, 80)}...</p>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                            <span style={{ fontSize: "0.82rem", color: "#70452C" }}>⏱ {c.duration}</span>
                                            <strong style={{ color: "#70452C", fontSize: "1.05rem" }}>₹{c.fees?.toLocaleString("en-IN")}</strong>
                                        </div>
                                        {(c.curriculum || []).length > 0 && (
                                            <ul style={{ paddingLeft: "16px", margin: "0 0 12px", color: "#70452C", fontSize: "0.82rem" }}>
                                                {c.curriculum.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                                                {c.curriculum.length > 3 && <li style={{ color: "#B89A70" }}>+{c.curriculum.length - 3} more...</li>}
                                            </ul>
                                        )}
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button className="btn-edit" onClick={() => openEditCourse(c)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}><Edit2 size={13} /> Edit</button>
                                            <button className="btn-delete" onClick={() => deleteCourse(c._id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ STUDENTS TAB (with Enrollment Data) ════════════ */}
                {activeTab === "students" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Academy Students & Enrollments ({students.length || stats.totalStudents || 0})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>
                                    Students registered for Academy courses with their enrollment progress.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span style={{ fontSize: "0.82rem", color: "#8B6A4E", background: "#F4EBDD", padding: "4px 12px", borderRadius: "50px", border: "1px solid #D8C4B6" }}>
                                    {enrollments.length} Enrollments Active
                                </span>
                            </div>
                        </div>

                        {/* Enrollment Cards */}
                        {enrollments.length > 0 && (
                            <div style={{ marginBottom: "24px" }}>
                                <h4 style={{ color: "#70452C", fontFamily: "'Playfair Display', serif", marginBottom: "14px", fontSize: "1rem" }}>
                                    📚 Active Course Enrollments
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
                                    {enrollments.map(en => (
                                        <div key={en._id} style={{
                                            background: "#FFFDF8", border: "1.5px solid #E8D5BD",
                                            borderRadius: "12px", padding: "16px",
                                            borderLeft: en.status === "completed" ? "4px solid #0a3622" : en.status === "active" ? "4px solid #B89A70" : "4px solid #dc3545"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <div>
                                                    <strong style={{ color: "#3D2117", fontSize: "0.95rem" }}>
                                                        {en.student?.name || "Unknown Student"}
                                                    </strong>
                                                    <p style={{ fontSize: "0.78rem", color: "#8B6A4E", margin: "2px 0 0" }}>
                                                        {en.student?.email}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px",
                                                    borderRadius: "50px", height: "fit-content",
                                                    background: en.status === "completed" ? "#d1e7dd" : en.status === "active" ? "#fff3cd" : "#f8d7da",
                                                    color: en.status === "completed" ? "#0a3622" : en.status === "active" ? "#856404" : "#58151c",
                                                }}>
                                                    {en.status?.toUpperCase()}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#70452C", margin: "0 0 10px" }}>
                                                📖 {en.course?.title || "Unknown Course"} {en.course?.level && `(${en.course.level})`}
                                            </p>

                                            {/* Progress Bar */}
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                    <span style={{ fontSize: "0.75rem", color: "#8B6A4E" }}>Progress</span>
                                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#70452C" }}>{en.progressPercentage || 0}%</span>
                                                </div>
                                                <div style={{ background: "#E8D5BD", borderRadius: "50px", height: "8px", overflow: "hidden" }}>
                                                    <div style={{
                                                        width: `${en.progressPercentage || 0}%`,
                                                        background: en.progressPercentage >= 100 ? "#0a3622" : "linear-gradient(90deg, #B89A70, #70452C)",
                                                        height: "100%", borderRadius: "50px",
                                                        transition: "width 0.5s ease"
                                                    }} />
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.75rem", color: "#8B6A4E" }}>
                                                <span>✅ {en.completedLessons?.length || 0} Lessons Done</span>
                                                {en.certificateIssued && (
                                                    <span style={{ color: "#0a3622", fontWeight: 700 }}>🏆 Certificate Issued</span>
                                                )}
                                                {en.student?.phone && (
                                                    <a
                                                        href={`https://wa.me/91${en.student.phone.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(en.student.name)}!%20Kaju%20Mehndi%20Academy%20se%20aapka%20course%20progress%20update%20share%20kar%20rahe%20hain.`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        style={{ color: "#25D366", fontWeight: 700, textDecoration: "none" }}
                                                    >
                                                        💬 WhatsApp
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Students Table */}
                        {students.length > 0 ? (
                            <div>
                                <h4 style={{ color: "#70452C", fontFamily: "'Playfair Display', serif", marginBottom: "12px", fontSize: "1rem" }}>
                                    👩‍🎓 All Registered Students ({students.length})
                                </h4>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="admin-table">
                                        <thead><tr><th>Student Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Direct Contact</th></tr></thead>
                                        <tbody>
                                            {students.map(s => (
                                                <tr key={s._id}>
                                                    <td><strong>{s.name}</strong></td>
                                                    <td>{s.email}</td>
                                                    <td>{s.phone || "—"}</td>
                                                    <td>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                                                    <td><StatusBadge status={s.isActive ? "confirmed" : "cancelled"} /></td>
                                                    <td>
                                                        {s.phone && (
                                                            <a
                                                                href={`https://wa.me/91${s.phone.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(s.name)}!%20Kaju%20Mehndi%20Academy%20se%20aapka%20batch%20schedule%20share%20kar%20rahe%20hain.`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn-whatsapp-sm"
                                                            >
                                                                <MessageCircle size={12} /> WhatsApp
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px", color: "#8B6A4E" }}>
                                <GraduationCap size={48} color="#B89A70" style={{ marginBottom: "12px" }} />
                                <p>Abhi koi student enrolled nahi hai.</p>
                                <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Jab koi student register karega tab yahan dikhega.</p>
                                <p style={{ fontSize: "0.82rem", color: "#B89A70", marginTop: "16px" }}>
                                    Default seeded student: <strong>ananya@example.com</strong> (password: Student@123)
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ ENQUIRIES TAB ════════════ */}
                {activeTab === "enquiries" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Customer Enquiries ({enquiries.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>Messages received through the Contact Us form on your website.</p>
                            </div>
                            <div style={{ position: "relative" }}>
                                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#B89A70" }} />
                                <input style={{ ...inputStyle, paddingLeft: "32px", width: "220px", background: "#F4EBDD" }} placeholder="Search name, subject..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        {filteredEnquiries.length === 0 ? (
                            <p style={{ color: "#8B6A4E", textAlign: "center", padding: "40px" }}>Koi enquiry nahi mili.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {filteredEnquiries.map(e => (
                                    <div key={e._id} style={{
                                        background: "#FFFDF8", border: "1.5px solid #E8D5BD",
                                        borderRadius: "12px", padding: "16px 20px",
                                        display: "flex", gap: "16px", alignItems: "flex-start",
                                        borderLeft: e.status === "new" ? "4px solid #B89A70" : "4px solid transparent"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                                <strong style={{ color: "#3D2117" }}>{e.name}</strong>
                                                <StatusBadge status={e.status} />
                                            </div>
                                            <p style={{ fontSize: "0.82rem", color: "#8B6A4E", margin: "2px 0" }}>{e.email} {e.phone ? `• ${e.phone}` : ""}</p>
                                            <p style={{ fontWeight: 600, color: "#70452C", fontSize: "0.9rem", margin: "6px 0 4px" }}>{e.subject}</p>
                                            <p style={{ color: "#3D2117", fontSize: "0.85rem" }}>{(e.message || "").slice(0, 100)}...</p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                                            <span style={{ fontSize: "0.75rem", color: "#B89A70" }}>{new Date(e.createdAt).toLocaleDateString("en-IN")}</span>
                                            <button className="btn-edit" onClick={() => setModal({ open: true, type: "viewEnquiry", data: e })} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Eye size={13} /> View & Reply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ PAYMENTS TAB ════════════ */}
                {activeTab === "payments" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Razorpay & Online Payments ({payments.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>Real-time transaction history from online course enrollments and booking advances.</p>
                            </div>
                            <div style={{ position: "relative" }}>
                                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#B89A70" }} />
                                <input style={{ ...inputStyle, paddingLeft: "32px", width: "240px", background: "#F4EBDD" }} placeholder="Search order, user, amount..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        {filteredPayments.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "50px", color: "#8B6A4E" }}>
                                <CreditCard size={48} color="#B89A70" style={{ marginBottom: "12px" }} />
                                <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>Abhi koi online payment record nahi mila.</p>
                                <p style={{ fontSize: "0.88rem" }}>Jab koi user course buy karega ya booking advance dega, yahan unka Razorpay transaction show hoga.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Payer / Customer</th>
                                            <th>Purpose</th>
                                            <th>Amount</th>
                                            <th>Razorpay Order / Txn</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map(p => (
                                            <tr key={p._id}>
                                                <td>
                                                    <strong>{p.user?.name || "Guest Customer"}</strong><br />
                                                    <small style={{ color: "#8B6A4E" }}>{p.user?.email || "—"}</small>
                                                </td>
                                                <td>
                                                    <span style={{ textTransform: "capitalize", fontWeight: 600, color: "#70452C" }}>
                                                        {p.type?.replace("_", " ")}
                                                    </span><br />
                                                    <small style={{ color: "#8B6A4E" }}>
                                                        {p.course?.title || p.booking?.service || "—"}
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong style={{ color: "#0a3622", fontSize: "1.05rem" }}>
                                                        ₹{p.amount?.toLocaleString("en-IN")}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <code style={{ fontSize: "11px", background: "#F4EBDD", padding: "2px 6px", borderRadius: "4px" }}>
                                                        {p.razorpayOrderId || "—"}
                                                    </code>
                                                    {p.razorpayPaymentId && (
                                                        <><br /><small style={{ color: "#8B6A4E", fontSize: "10.5px" }}>ID: {p.razorpayPaymentId}</small></>
                                                    )}
                                                </td>
                                                <td><StatusBadge status={p.status} /></td>
                                                <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ GALLERY TAB ════════════ */}
                {activeTab === "gallery" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>Gallery Designs ({galleryItems.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>
                                    Live designs stored on Cloudinary and displayed to website visitors.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <Link to="/gallery" className="primary-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <Plus size={15} /> Upload via Gallery Studio
                                </Link>
                            </div>
                        </div>

                        {galleryItems.length === 0 ? (
                            <div style={{ background: "#F4EBDD", border: "2px dashed #B89A70", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
                                <ImageIcon size={48} color="#B89A70" style={{ marginBottom: "12px" }} />
                                <p style={{ color: "#70452C", fontWeight: 600, marginBottom: "8px" }}>Gallery Studio me koi design nahi hai</p>
                                <Link to="/gallery" style={{ background: "#70452C", color: "#fff", padding: "10px 24px", borderRadius: "50px", textDecoration: "none", fontWeight: 600 }}>
                                    Upload First Design →
                                </Link>
                            </div>
                        ) : (
                            <div className="admin-gallery-grid">
                                {galleryItems.map(item => (
                                    <div key={item._id} className="admin-gallery-card">
                                        <div className="admin-gallery-thumb-wrap">
                                            {item.isVideo || item.mediaUrl?.includes("/video/") || item.mediaUrl?.endsWith(".mp4") ? (
                                                <video
                                                    src={item.mediaUrl}
                                                    className="admin-gallery-thumb"
                                                    muted
                                                    playsInline
                                                    autoPlay
                                                    loop
                                                />
                                            ) : (
                                                <img
                                                    src={item.mediaUrl || item.imageUrl || "/assets/bridal-mehndi.jpg"}
                                                    alt={item.title}
                                                    className="admin-gallery-thumb"
                                                    onError={(e) => { e.target.src = "/assets/bridal-mehndi.jpg"; }}
                                                />
                                            )}
                                            <span className="admin-gallery-badge">{item.category}</span>
                                        </div>
                                        <div className="admin-gallery-details">
                                            <h4>{item.title}</h4>
                                            {item.price && (
                                                <span className="admin-gallery-price">₹{Number(item.price).toLocaleString("en-IN")}</span>
                                            )}
                                            <div className="admin-gallery-actions">
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => deleteGalleryDesign(item._id)}
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                                                >
                                                    <Trash2 size={13} /> Delete Design
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════ REVIEWS TAB ════════════ */}
                {activeTab === "reviews" && (
                    <div className="admin-content-box">
                        <div className="box-header-row">
                            <div>
                                <h3>⭐ Client Reviews & Testimonials ({reviews.length})</h3>
                                <p style={{ color: "#8B6A4E", fontSize: "0.85rem", margin: "4px 0 0" }}>
                                    Reviews submitted by verified clients. Approved reviews appear on the Home page.
                                </p>
                            </div>
                            <div style={{ position: "relative" }}>
                                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#B89A70" }} />
                                <input
                                    style={{ ...inputStyle, paddingLeft: "32px", width: "220px", background: "#F4EBDD" }}
                                    placeholder="Search name, comment..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Reviews Stats Row */}
                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "20px" }}>
                            {[
                                { label: "Total Reviews", value: reviews.length, bg: "#F4EBDD", color: "#70452C" },
                                { label: "Approved (Live)", value: reviews.filter(r => r.isApproved).length, bg: "#d1e7dd", color: "#0a3622" },
                                { label: "Pending Approval", value: reviews.filter(r => !r.isApproved).length, bg: "#fff3cd", color: "#856404" },
                                { label: "Avg Rating", value: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) + " ★" : "—", bg: "#E8D5BD", color: "#3D2117" },
                            ].map(item => (
                                <div key={item.label} style={{ background: item.bg, borderRadius: "10px", padding: "10px 18px", textAlign: "center", minWidth: "120px" }}>
                                    <strong style={{ color: item.color, fontSize: "1.3rem", display: "block" }}>{item.value}</strong>
                                    <span style={{ color: item.color, fontSize: "0.72rem", fontWeight: 600 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {filteredReviews.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#8B6A4E" }}>
                                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⭐</div>
                                <p style={{ fontWeight: 600, marginBottom: "8px" }}>Koi review nahi mili.</p>
                                <p style={{ fontSize: "0.85rem" }}>Jab customers apna experience share karenge, reviews yahan dikhenge.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {filteredReviews.map(r => (
                                    <div key={r._id} style={{
                                        background: "#FFFDF8",
                                        border: `1.5px solid ${r.isApproved ? "#B89A70" : "#ffc107"}`,
                                        borderRadius: "12px",
                                        padding: "16px 20px",
                                        borderLeft: `4px solid ${r.isApproved ? "#0a3622" : "#ffc107"}`,
                                        display: "flex",
                                        gap: "16px",
                                        alignItems: "flex-start",
                                    }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: "44px", height: "44px", borderRadius: "50%",
                                            background: "linear-gradient(135deg,#B89A70,#70452C)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#fff", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0
                                        }}>
                                            {(r.user?.name || "C").charAt(0).toUpperCase()}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                <strong style={{ color: "#3D2117", fontSize: "0.95rem" }}>{r.user?.name || "Verified Client"}</strong>
                                                {/* Star Rating */}
                                                <span style={{ color: "#F1C40F", fontSize: "0.9rem", letterSpacing: "1px" }}>
                                                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                                </span>
                                                <span style={{
                                                    fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px",
                                                    borderRadius: "50px",
                                                    background: r.isApproved ? "#d1e7dd" : "#fff3cd",
                                                    color: r.isApproved ? "#0a3622" : "#856404"
                                                }}>
                                                    {r.isApproved ? "✓ LIVE ON SITE" : "⏳ PENDING"}
                                                </span>
                                                <span style={{ fontSize: "0.72rem", background: "#E8D5BD", color: "#70452C", padding: "2px 8px", borderRadius: "50px", fontWeight: 600 }}>
                                                    {r.type === "course" ? `🎓 ${r.course?.title || "Course"}` : `✨ ${r.serviceName || "Mehndi Service"}`}
                                                </span>
                                            </div>

                                            <p style={{ color: "#3D2117", fontSize: "0.9rem", margin: "6px 0 4px", fontStyle: "italic", lineHeight: "1.5" }}>
                                                "{r.comment}"
                                            </p>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "8px" }}>
                                                <span style={{ fontSize: "0.75rem", color: "#B89A70" }}>
                                                    {r.user?.email && `📧 ${r.user.email} • `}
                                                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button
                                                        onClick={() => toggleReviewApproval(r._id, !r.isApproved)}
                                                        style={{
                                                            padding: "5px 12px", borderRadius: "50px",
                                                            border: `1.5px solid ${r.isApproved ? "#ffc107" : "#0a3622"}`,
                                                            background: "transparent",
                                                            color: r.isApproved ? "#856404" : "#0a3622",
                                                            cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                                                            display: "flex", alignItems: "center", gap: "4px"
                                                        }}
                                                    >
                                                        {r.isApproved ? "🙈 Hide from Site" : "✅ Approve & Publish"}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReview(r._id)}
                                                        className="btn-delete"
                                                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", fontSize: "0.78rem" }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                </motion.div>
                </AnimatePresence>                )} {/* end loading check */}

            </div>
        </div>
    );
};

export default AdminDashboard;
