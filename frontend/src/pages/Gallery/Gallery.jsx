import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Upload, Film, Image as ImageIcon, Sparkles, Check, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import BrandMediaCard from "../../components/common/BrandMediaCard";
import API from "../../api/axios";
import "./Gallery.css";

// Sample fallback designs
import bridalImg from "../../assets/bridal-mehndi.jpg";
import arabicImg from "../../assets/arabic-mehndi.jpg";
import rajasthaniImg from "../../assets/rajasthani-mehndi.jpg";
import minimalImg from "../../assets/minimal-mehndi.jpg";
import kajuHero from "../../assets/kaju-hero.jpg";
import kajuAbout from "../../assets/kaju-about.jpg";

const INITIAL_GALLERY = [
    {
        _id: "init-1",
        title: "Royal Marwari Bridal Mehndi",
        category: "Bridal",
        mediaUrl: kajuHero,
        price: 7500,
        isVideo: false,
    },
    {
        _id: "init-2",
        title: "Intricate Full Hand Bridal",
        category: "Bridal",
        mediaUrl: bridalImg,
        price: 5500,
        isVideo: false,
    },
    {
        _id: "init-3",
        title: "Floral Flow Arabic Mehndi",
        category: "Arabic",
        mediaUrl: arabicImg,
        price: 1500,
        isVideo: false,
    },
    {
        _id: "init-4",
        title: "Traditional Rajasthani Jharokha",
        category: "Rajasthani",
        mediaUrl: rajasthaniImg,
        price: 3500,
        isVideo: false,
    },
    {
        _id: "init-5",
        title: "Delicate Minimalist Backhand",
        category: "Minimal",
        mediaUrl: minimalImg,
        price: 800,
        isVideo: false,
    },
    {
        _id: "init-6",
        title: "Engagement Royal Portrait Style",
        category: "Engagement",
        mediaUrl: kajuAbout,
        price: 4000,
        isVideo: false,
    },
];

const CATEGORIES = [
    "All Designs",
    "Bridal",
    "Arabic",
    "Rajasthani",
    "Engagement",
    "Minimal",
    "Festival",
    "Videos",
];

const Gallery = () => {
    const authUser = useSelector((state) => state.auth?.user);
    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();
    const currentUser = authUser || storedUser;
    const isAdmin = currentUser?.role === "admin";

    const [selectedCategory, setSelectedCategory] = useState("All Designs");
    const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        title: "",
        category: "Bridal",
        price: "",
        mediaUrl: "",
        isVideo: false,
        file: null,
        previewUrl: "",
    });

    // Fetch real gallery items from MongoDB API
    useEffect(() => {
        let isMounted = true;

        const loadGallery = async () => {
            try {
                const { data } = await API.get("/gallery");
                if (!isMounted) return;

                const dbItems = data?.items || [];
                if (dbItems.length > 0) {
                    const existingUrls = new Set(dbItems.map((i) => i.mediaUrl));
                    const remainingInitial = INITIAL_GALLERY.filter((i) => !existingUrls.has(i.mediaUrl));
                    setGalleryItems([...dbItems, ...remainingInitial]);
                } else {
                    setGalleryItems(INITIAL_GALLERY);
                }
            } catch (err) {
                if (isMounted) {
                    console.warn("Could not load gallery from backend, using default items:", err);
                    setGalleryItems(INITIAL_GALLERY);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadGallery();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter items based on active category tab
    const filteredItems = galleryItems.filter((item) => {
        if (selectedCategory === "All Designs") return true;
        if (selectedCategory === "Videos") return item.isVideo;
        return (item.category || "").toLowerCase() === selectedCategory.toLowerCase();
    });

    // Handle local file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isVid = file.type.startsWith("video");
            const preview = URL.createObjectURL(file);
            setUploadForm((prev) => ({
                ...prev,
                file,
                previewUrl: preview,
                isVideo: isVid,
            }));
            setUploadError("");
        }
    };

    // Submit upload to Backend (Cloudinary + MongoDB)
    const handleAddMedia = async (e) => {
        e.preventDefault();
        setUploadError("");

        if (!isAdmin) {
            setUploadError("Design upload karne ke liye aapko Admin account se login hona zaroori hai.");
            return;
        }

        if (!uploadForm.title.trim()) {
            setUploadError("Please provide a title for the design");
            return;
        }

        if (!uploadForm.file && !uploadForm.mediaUrl) {
            setUploadError("Please select an image/video file or enter an image URL");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", uploadForm.title.trim());
            formData.append("category", uploadForm.category);
            if (uploadForm.price) formData.append("price", uploadForm.price);
            formData.append("isVideo", uploadForm.isVideo);

            if (uploadForm.file) {
                formData.append("file", uploadForm.file);
            } else if (uploadForm.mediaUrl) {
                formData.append("mediaUrl", uploadForm.mediaUrl.trim());
            }

            const { data } = await API.post("/gallery/upload", formData);

            if (data?.success && data?.item) {
                // Prepend newly saved MongoDB item so it shows immediately
                setGalleryItems((prev) => [data.item, ...prev]);
                setUploadSuccess(true);

                setTimeout(() => {
                    setUploadSuccess(false);
                    setShowUploadModal(false);
                    setUploadForm({
                        title: "",
                        category: "Bridal",
                        price: "",
                        mediaUrl: "",
                        isVideo: false,
                        file: null,
                        previewUrl: "",
                    });
                }, 1200);
            }
        } catch (err) {
            console.error("Gallery upload failed:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setUploadError("Session expired ya Admin access nahi hai. Kripya /admin-login par login karein.");
            } else {
                const msg = err.response?.data?.message || err.message || "Failed to upload design. Please try again.";
                setUploadError(msg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete design from MongoDB & Cloudinary (Admin only)
    const handleDeleteMedia = async (id) => {
        if (!window.confirm("Are you sure you want to delete this design from the gallery?")) return;

        try {
            await API.delete(`/gallery/${id}`);
            setGalleryItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete item from database");
        }
    };

    return (
        <div className="gallery-page">
            {/* Header */}
            <div className="gallery-hero">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="gallery-tag">✧ ARTWORK SHOWCASE ✧</span>
                    <h1>Our Mehndi Gallery</h1>
                    <p>Every design is a masterpiece crafted with precision, patience, and love.</p>
                </motion.div>

                {/* Admin Quick Upload Button (Visible ONLY to Admin) */}
                {isAdmin && (
                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => {
                                setUploadError("");
                                setShowUploadModal(true);
                            }}
                            className="admin-upload-btn"
                        >
                            <PlusCircle size={18} />
                            <span>Admin Studio: Upload New Design</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Category Filter Bar */}
            <div className="gallery-categories-bar">
                <div className="cat-scroll">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="gallery-container">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#70452C" }}>
                        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "14px", fontWeight: 600 }}>Loading gallery designs...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="empty-gallery">
                        <p>No designs found in this category.</p>
                    </div>
                ) : (
                    <motion.div layout className="gallery-grid">
                        <AnimatePresence>
                            {filteredItems.map((item) => {
                                const itemId = item._id || item.id;
                                const isDbItem = typeof itemId === "string" && !itemId.startsWith("init-");

                                return (
                                    <motion.div
                                        key={itemId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.35 }}
                                        style={{ position: "relative" }}
                                    >
                                        <BrandMediaCard
                                            mediaUrl={item.mediaUrl}
                                            title={item.title}
                                            category={item.category}
                                            price={item.price}
                                            isVideo={item.isVideo}
                                        />

                                        {/* Admin Delete Icon for MongoDB items */}
                                        {isAdmin && isDbItem && (
                                            <button
                                                onClick={() => handleDeleteMedia(itemId)}
                                                title="Delete from database"
                                                style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    right: "10px",
                                                    background: "rgba(220, 53, 69, 0.9)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "32px",
                                                    height: "32px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                                    zIndex: 10,
                                                }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Admin Upload Modal (Only accessible to Admin) */}
            <AnimatePresence>
                {isAdmin && showUploadModal && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            if (!isSubmitting) setShowUploadModal(false);
                        }}
                    >
                        <motion.div
                            className="admin-modal-card"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div>
                                    <span className="modal-tag">STUDIO ASSET MANAGER</span>
                                    <h2>Upload Design to Database</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!isSubmitting) setShowUploadModal(false);
                                    }}
                                    className="modal-close-btn"
                                >
                                    ✕
                                </button>
                            </div>

                            {uploadError && (
                                <div
                                    style={{
                                        background: "#f8d7da",
                                        color: "#842029",
                                        border: "1px solid #f5c2c7",
                                        borderRadius: "8px",
                                        padding: "10px 14px",
                                        marginBottom: "16px",
                                        fontSize: "0.88rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <AlertCircle size={18} />
                                    <span>{uploadError}</span>
                                </div>
                            )}

                            <form onSubmit={handleAddMedia} className="modal-form">
                                <div className="form-group">
                                    <label>Design Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Royal Rajwada Dulhan Portrait"
                                        required
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={uploadForm.category}
                                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                            disabled={isSubmitting}
                                        >
                                            <option value="Bridal">Bridal Mehndi</option>
                                            <option value="Arabic">Arabic Mehndi</option>
                                            <option value="Rajasthani">Rajasthani Mehndi</option>
                                            <option value="Engagement">Engagement Mehndi</option>
                                            <option value="Minimal">Minimal Mehndi</option>
                                            <option value="Festival">Festival Mehndi</option>
                                            <option value="Videos">Video Reel</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Starting Price (Optional ₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 5000"
                                            value={uploadForm.price}
                                            onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* File Dropzone */}
                                <div className="form-group">
                                    <label>Select Photo or Video File *</label>
                                    <div className="dropzone-box">
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileSelect}
                                            id="file-input"
                                            style={{ display: "none" }}
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="file-input" className="dropzone-label">
                                            {uploadForm.previewUrl ? (
                                                <div className="preview-indicator">
                                                    {uploadForm.isVideo ? <Film size={32} color="#25D366" /> : <ImageIcon size={32} color="#B89A70" />}
                                                    <span style={{ fontWeight: 600 }}>File Selected: {uploadForm.file?.name}</span>
                                                    <small style={{ color: "#70452C" }}>Click to change file</small>
                                                </div>
                                            ) : (
                                                <div className="dropzone-prompt">
                                                    <Upload size={32} color="#70452C" />
                                                    <span>Click or drop image/video here</span>
                                                    <small>Uploaded directly to Cloudinary & saved in MongoDB</small>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Brand Auto-properties note */}
                                <div className="auto-brand-note">
                                    <Sparkles size={16} color="#B89A70" />
                                    <span>
                                        <strong>Permanent Cloud Storage:</strong> Photo Cloudinary pe secure upload hogi aur MongoDB database ke <code>galleries</code> collection me save hogi.
                                    </span>
                                </div>

                                {uploadSuccess ? (
                                    <div className="upload-success-badge">
                                        <Check size={18} />
                                        <span>Uploaded & Saved to Database Successfully!</span>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="upload-submit-btn"
                                        disabled={isSubmitting}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            opacity: isSubmitting ? 0.7 : 1,
                                            cursor: isSubmitting ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                                                <span>Uploading to Cloudinary & Saving...</span>
                                            </>
                                        ) : (
                                            <span>Publish & Save to Database →</span>
                                        )}
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
