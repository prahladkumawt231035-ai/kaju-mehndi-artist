import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Award, Clock, BookOpen, Users, Video, Loader, AlertCircle } from "lucide-react";
import "./Academy.css";
import kajuHero from "../../assets/kaju-hero.jpg";
import kajuAbout from "../../assets/kaju-about.jpg";
import API from "../../api/axios";

// Fallback course data (shown while API loads or if offline)
const FALLBACK_COURSES = [
    {
        _id: "basic",
        title: "Basic to Semi-Pro Mehndi Course",
        level: "Beginner",
        duration: "3 Weeks (15 Sessions)",
        mode: "Online & Offline",
        fees: 2999,
        description: "Ideal for beginners starting from zero. Master cone pressure, perfect clean lines, circular spirals, paisley, leaves, and basic shading.",
        curriculum: [
            "Henna paste consistency & rolling perfect cones",
            "Core strokes, dots, tear drops & thin-thick lines",
            "Classic Indian florals, leaves & mango/paisley motifs",
            "Grid layout, shading techniques & hand spacing",
            "Practice sheets, daily review & completion certificate",
        ],
        thumbnail: null,
    },
    {
        _id: "arabic",
        title: "Advanced Arabic & Indo-Western Masterclass",
        level: "Intermediate",
        duration: "2 Weeks (10 Sessions)",
        mode: "Online & Offline",
        fees: 3499,
        description: "Learn modern Gulf style, bold outline shading, negative fill, rose motifs, and aesthetic jewellery belts that brides adore.",
        curriculum: [
            "Bold 3D contour lines & organic shading gradients",
            "Modern rose, lotus & chandelier vine patterns",
            "Negative space reverse Mehndi techniques",
            "Wrist bracelets & ring finger connection chains",
            "Speed improvement & professional photo portfolio",
        ],
        thumbnail: null,
    },
    {
        _id: "bridal",
        title: "Professional Bridal Mehndi Artistry",
        level: "Advanced",
        duration: "4 Weeks (20 Sessions)",
        mode: "Online & Offline",
        fees: 6999,
        description: "Become an in-demand bridal artist. Master human portraits (Dulha, Dulhan, Radha-Krishna), processions, musical instruments, and feet symmetry.",
        curriculum: [
            "Facial anatomy, bride & groom portrait sketching",
            "Wedding procession elements (Doli, Shehnai, Kalash, Baraat)",
            "Intricate elbow & mid-calf bridal composition layout",
            "Symmetrical feet bridal designs & ankle straps",
            "Organic chemical-free bridal henna mixing secrets",
        ],
        thumbnail: null,
    },
    {
        _id: "master",
        title: "Complete Professional Mehndi Diploma",
        level: "All-in-One Career Track",
        duration: "8 Weeks (Full Mastery)",
        mode: "Online & Offline",
        fees: 11999,
        description: "Everything from basic to high-end bridal, plus business mentoring, client handling, pricing, social media marketing, and certification.",
        curriculum: [
            "Full syllabus of Basic + Arabic + Bridal Masterclasses",
            "High-speed bridal application techniques under 4 hours",
            "Commercial Henna Cone business setup & preservation",
            "Instagram marketing, reels creation & bridal client booking",
            "Official Kaju Academy Diploma & lifetime mentorship access",
        ],
        thumbnail: null,
    },
];

// Pick a local fallback image based on index
const LOCAL_IMGS = [kajuAbout, kajuHero, kajuHero, kajuAbout];

const WhatsAppIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const Academy = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const { data } = await API.get("/courses");
                const list = data.courses || data.data || [];
                if (list.length > 0) {
                    setCourses(list);
                    setUsingFallback(false);
                } else {
                    // No courses in DB yet — use fallback
                    setCourses(FALLBACK_COURSES);
                    setUsingFallback(true);
                }
            } catch (err) {
                console.error("Failed to load courses:", err);
                setError("Could not connect to server. Showing cached data.");
                setCourses(FALLBACK_COURSES);
                setUsingFallback(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="academy-page">
            {/* Header */}
            <div className="academy-hero">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="academy-tag">✦ EMPOWER YOUR PASSION ✦</span>
                    <h1>Kaju Mehndi Academy</h1>
                    <p>
                        Transform your passion into an artistic and entrepreneurial career.
                        Learn under the personal mentorship of Master Artist Kaju.
                    </p>
                </motion.div>
            </div>

            {/* Why Academy Highlights */}
            <div className="academy-highlights-strip">
                <div className="highlight-item">
                    <Award size={24} color="#B89A70" />
                    <div>
                        <strong>Govt / Academy Certified</strong>
                        <span>Recognized certificate upon course completion</span>
                    </div>
                </div>
                <div className="highlight-item">
                    <Video size={24} color="#B89A70" />
                    <div>
                        <strong>Online & Offline Classes</strong>
                        <span>Join live interactive classes or in-studio batches</span>
                    </div>
                </div>
                <div className="highlight-item">
                    <Users size={24} color="#B89A70" />
                    <div>
                        <strong>500+ Alumni Network</strong>
                        <span>Personal feedback on every practice assignment</span>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="academy-courses-container">
                <div className="section-heading-centered">
                    <span className="section-tag">CHOOSE YOUR PATH</span>
                    <h2>Featured Mehndi Courses</h2>
                    <p>Structured from fundamental cone control to high-paying bridal masterclasses.</p>
                </div>

                {/* Error / Fallback Notice */}
                {error && (
                    <div style={{
                        background: "#fff3cd", border: "1px solid #ffc107",
                        borderRadius: "10px", padding: "12px 20px",
                        marginBottom: "24px", display: "flex",
                        alignItems: "center", gap: "10px", color: "#856404",
                        maxWidth: "700px", margin: "0 auto 24px"
                    }}>
                        <AlertCircle size={16} />
                        <span style={{ fontSize: "0.9rem" }}>{error}</span>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", gap: "12px", color: "#70452C" }}>
                        <Loader size={28} className="spin-icon" />
                        <span style={{ fontSize: "1.1rem" }}>Loading courses...</span>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course, i) => {
                            const courseImg = course.thumbnail || LOCAL_IMGS[i % LOCAL_IMGS.length];
                            const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
                            const waMsg = encodeURIComponent(
                                `🎓 *Academy Course Admission Inquiry* 🎓\n\n` +
                                `📚 *Course:* ${course.title}\n` +
                                `⏳ *Duration:* ${course.duration || "N/A"}\n` +
                                `💰 *Fees:* ₹${course.fees || course.price || "N/A"}\n` +
                                `I want to enroll in this course. Please share upcoming batch dates and admission procedure! 🙏`
                            );

                            return (
                                <motion.div
                                    key={course._id}
                                    className="course-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(61,33,23,0.18)" }}
                                >
                                    <div className="course-card-top">
                                        <img src={courseImg} alt={course.title} />
                                        <span className="course-level-badge">
                                            {course.level || course.category || "Course"}
                                        </span>
                                    </div>

                                    <div className="course-card-body">
                                        <div className="course-header-row">
                                            <h3>{course.title}</h3>
                                            <div className="course-price">
                                                <span>Fees</span>
                                                <strong>₹{course.fees || course.price || "—"}</strong>
                                            </div>
                                        </div>

                                        <div className="course-meta">
                                            {course.duration && (
                                                <span><Clock size={12} /> {course.duration}</span>
                                            )}
                                            {course.mode && (
                                                <span><BookOpen size={12} /> {course.mode}</span>
                                            )}
                                        </div>

                                        <p className="course-desc">
                                            {course.description || course.desc}
                                        </p>

                                        {curriculum.length > 0 && (
                                            <div className="course-curriculum-box">
                                                <h4>Syllabus Highlights:</h4>
                                                <ul>
                                                    {curriculum.slice(0, 5).map((item, idx) => (
                                                        <li key={idx}>
                                                            <CheckCircle2 size={13} color="#B89A70" />
                                                            <span>{typeof item === "string" ? item : item.title || item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="course-actions">
                                            <a
                                                href={`https://wa.me/919244836867?text=${waMsg}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="course-wa-enroll"
                                            >
                                                <WhatsAppIcon />
                                                Enroll via WhatsApp
                                            </a>

                                            <Link to="/contact" className="course-contact-btn">
                                                Request Syllabus Call
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Academy;
