import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Play, CheckCircle2, Lock, Award, BookOpen, Clock,
    MessageSquare, Download, ChevronRight, Loader, AlertCircle, RefreshCw
} from "lucide-react";
import "./StudentDashboard.css";
import kajuHero from "../../assets/kaju-hero.jpg";
import API from "../../api/axios";

// Fallback lessons shown when no enrollment data from server
const FALLBACK_LESSONS = [
    { id: "L1", title: "Introduction to Organic Henna Chemistry & Paste Making", duration: "25 mins", completed: false },
    { id: "L2", title: "Cone Rolling, Sizing & Pressure Calibration", duration: "32 mins", completed: false },
    { id: "L3", title: "Mastering Basic Strokes: Spirals, Lines & Teardrops", duration: "40 mins", completed: false },
    { id: "L4", title: "Classic Rajasthani Peacock & Floral Shading Technique", duration: "45 mins", completed: false },
    { id: "L5", title: "Intricate Grid Jaal & Negative Space Fillers", duration: "50 mins", completed: false },
    { id: "L6", title: "Bridal Figure Drawing: Dulha & Dulhan Portraiture", duration: "60 mins", completed: false },
    { id: "L7", title: "Full Hand Bridal Composition & Symmetry", duration: "75 mins", completed: false },
];

const StudentDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [activeEnrollment, setActiveEnrollment] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Fetch student enrollments from API
    const fetchEnrollments = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await API.get("/enrollments/my-courses");
            const list = data.enrollments || [];
            setEnrollments(list);

            if (list.length > 0) {
                const first = list[0];
                setActiveEnrollment(first);
                // Build lesson list from completedLessons + course syllabus
                buildLessonsFromEnrollment(first);
            } else {
                // No enrollments: show placeholder lessons
                setLessons(FALLBACK_LESSONS);
                setCurrentLesson(FALLBACK_LESSONS[0]);
            }
        } catch (err) {
            console.error("Failed to fetch enrollments:", err);
            setError("Could not load your courses. Please try again.");
            setLessons(FALLBACK_LESSONS);
            setCurrentLesson(FALLBACK_LESSONS[0]);
        } finally {
            setLoading(false);
        }
    };

    // Build lesson list from enrollment data
    const buildLessonsFromEnrollment = (enrollment) => {
        const course = enrollment.course;
        // If course has syllabus/curriculum, map them to lessons
        const rawLessons = course?.curriculum?.length > 0
            ? course.curriculum.map((item, idx) => ({
                id: `L${idx + 1}`,
                title: typeof item === "string" ? item : (item.title || `Lesson ${idx + 1}`),
                duration: item.duration || "—",
                completed: enrollment.completedLessons?.some(
                    (cl) => cl.lessonId === `L${idx + 1}`
                ) || false,
            }))
            : FALLBACK_LESSONS.map((l) => ({
                ...l,
                completed: enrollment.completedLessons?.some(
                    (cl) => cl.lessonId === l.id
                ) || false,
            }));

        setLessons(rawLessons);
        // Set current lesson to first incomplete
        const firstIncomplete = rawLessons.find((l) => !l.completed);
        setCurrentLesson(firstIncomplete || rawLessons[rawLessons.length - 1]);
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // Calculate progress
    const completedCount = lessons.filter((l) => l.completed).length;
    const totalLessons = lessons.length;
    const progressPercent = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : (activeEnrollment?.progressPercentage || 0);

    // Toggle lesson complete — saves to DB if enrolled
    const toggleComplete = async (lessonId) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) return;

        // Optimistic update in UI
        const updatedLessons = lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: !l.completed } : l
        );
        setLessons(updatedLessons);
        if (currentLesson?.id === lessonId) {
            setCurrentLesson((prev) => ({ ...prev, completed: !prev.completed }));
        }

        // Save to backend if we have an enrollment
        if (activeEnrollment?._id) {
            setUpdating(true);
            try {
                const newCompleted = updatedLessons.filter((l) => l.completed).length;
                const newProgress = Math.round((newCompleted / updatedLessons.length) * 100);

                await API.patch(`/enrollments/${activeEnrollment._id}/progress`, {
                    lessonId,
                    progressPercentage: newProgress,
                });
            } catch (err) {
                console.error("Failed to save progress:", err);
            } finally {
                setUpdating(false);
            }
        }
    };

    // ---- Loading State ----
    if (loading) {
        return (
            <div className="student-page">
                <div className="student-hero">
                    <span className="student-tag">🎓 STUDENT LMS LEARNING PORTAL</span>
                    <h1>My Mehndi Classroom</h1>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", gap: "12px", color: "#70452C" }}>
                    <Loader size={28} className="spin-icon" />
                    <span style={{ fontSize: "1.1rem" }}>Loading your courses...</span>
                </div>
            </div>
        );
    }

    // ---- No Enrollments ----
    if (!loading && enrollments.length === 0 && !error) {
        return (
            <div className="student-page">
                <div className="student-hero">
                    <span className="student-tag">🎓 STUDENT LMS LEARNING PORTAL</span>
                    <h1>My Mehndi Classroom</h1>
                    <p>Welcome! Enroll in a course to start your Mehndi journey.</p>
                </div>
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#70452C" }}>
                    <BookOpen size={56} color="#B89A70" style={{ marginBottom: "16px" }} />
                    <h2 style={{ marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
                        You haven't enrolled in any course yet
                    </h2>
                    <p style={{ color: "#8B6A4E", marginBottom: "28px" }}>
                        Browse our Mehndi courses and begin your artistic journey today!
                    </p>
                    <a
                        href="/academy"
                        style={{
                            background: "#70452C", color: "#fff",
                            padding: "12px 32px", borderRadius: "50px",
                            textDecoration: "none", fontWeight: 600,
                        }}
                    >
                        Explore Courses
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="student-page">
            <div className="student-hero">
                <span className="student-tag">🎓 STUDENT LMS LEARNING PORTAL</span>
                <h1>My Mehndi Classroom</h1>
                <p>Welcome back! Continue your lessons, submit assignments, and earn your diploma.</p>
            </div>

            <div className="student-container">

                {/* Error Banner */}
                {error && (
                    <div style={{
                        background: "#fff3cd", border: "1px solid #ffc107",
                        borderRadius: "10px", padding: "14px 20px",
                        marginBottom: "20px", display: "flex",
                        alignItems: "center", gap: "10px", color: "#856404"
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                        <button
                            onClick={fetchEnrollments}
                            style={{ marginLeft: "auto", background: "none", border: "1px solid #ffc107", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", color: "#856404" }}
                        >
                            <RefreshCw size={14} style={{ marginRight: "4px" }} />
                            Retry
                        </button>
                    </div>
                )}

                {/* Multiple Enrollments Selector */}
                {enrollments.length > 1 && (
                    <div style={{ marginBottom: "24px" }}>
                        <p style={{ color: "#70452C", fontWeight: 600, marginBottom: "10px" }}>
                            📚 Your Enrolled Courses ({enrollments.length}):
                        </p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {enrollments.map((enr) => (
                                <button
                                    key={enr._id}
                                    onClick={() => {
                                        setActiveEnrollment(enr);
                                        buildLessonsFromEnrollment(enr);
                                    }}
                                    style={{
                                        padding: "8px 20px",
                                        borderRadius: "50px",
                                        border: "2px solid",
                                        borderColor: activeEnrollment?._id === enr._id ? "#70452C" : "#B89A70",
                                        background: activeEnrollment?._id === enr._id ? "#70452C" : "transparent",
                                        color: activeEnrollment?._id === enr._id ? "#fff" : "#70452C",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {enr.course?.title || "Course"}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Course Overview Banner */}
                <div className="lms-overview-card">
                    <div className="lms-header-info">
                        <div>
                            <span className="lms-enrolled-badge">
                                {activeEnrollment
                                    ? `ENROLLED • ${new Date(activeEnrollment.enrolledAt || activeEnrollment.createdAt).getFullYear()}`
                                    : "ENROLLED"}
                            </span>
                            <h2>
                                {activeEnrollment?.course?.title || "Professional Bridal Mehndi Artistry Masterclass"}
                            </h2>
                            <p>
                                Mentor: Master Artist Kaju •{" "}
                                {activeEnrollment?.course?.mode || "Online & Offline"} •{" "}
                                {activeEnrollment?.course?.duration || "Lifetime Access"}
                            </p>
                        </div>

                        <div className="lms-certificate-status">
                            <Award size={28} color="#B89A70" />
                            <div>
                                <span>Certificate Status</span>
                                <strong>
                                    {activeEnrollment?.certificateIssued
                                        ? "Ready to Download 🏆"
                                        : progressPercent >= 100
                                            ? "Processing Certificate..."
                                            : `Unlocks at 100%`}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-label-row">
                            <span>Your Course Completion</span>
                            <strong>
                                {progressPercent}% Complete ({completedCount}/{totalLessons} Lessons)
                                {updating && <span style={{ color: "#B89A70", fontSize: "0.8rem", marginLeft: "8px" }}>Saving...</span>}
                            </strong>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>

                {/* LMS Main Interactive Area */}
                {currentLesson && (
                    <div className="lms-workspace-grid">
                        {/* Left: Player & Lesson Notes */}
                        <div className="lms-player-col">
                            <div className="lms-video-screen">
                                <img src={kajuHero} alt="Lesson Cover" className="lms-cover-bg" />
                                <div className="lms-play-overlay">
                                    <motion.div
                                        className="lms-big-play-btn"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Play size={28} fill="white" />
                                    </motion.div>
                                    <span className="lms-video-title">
                                        Now Playing: {currentLesson.title}
                                    </span>
                                </div>
                            </div>

                            <div className="lms-lesson-meta-card">
                                <div className="lms-meta-header">
                                    <div>
                                        <h3>{currentLesson.title}</h3>
                                        <span className="lms-duration">
                                            <Clock size={13} />
                                            {currentLesson.duration !== "—" ? ` ${currentLesson.duration}` : " Duration N/A"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => toggleComplete(currentLesson.id)}
                                        className={`btn-mark-done ${currentLesson.completed ? "done" : ""}`}
                                        disabled={updating}
                                    >
                                        {updating
                                            ? "Saving..."
                                            : currentLesson.completed
                                                ? "✓ Lesson Completed"
                                                : "Mark as Completed"}
                                    </button>
                                </div>

                                <p className="lesson-description">
                                    In this lesson, Kaju demonstrates the exact angles and hand posture needed for
                                    flawless pressure consistency. Practice drawing 5 consecutive spirals and upload your
                                    photo to the student WhatsApp review group.
                                </p>

                                <div className="lms-downloads-row">
                                    <a href="#download" className="download-sheet-btn">
                                        <Download size={15} /> Download Practice PDF Sheet
                                    </a>
                                    <a
                                        href={`https://wa.me/919244836867?text=Hi%20Kaju!%20I%20have%20a%20doubt%20in%20${encodeURIComponent(currentLesson.title)}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="doubt-wa-btn"
                                    >
                                        <MessageSquare size={15} /> Ask Mentor Doubt on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right: Lesson Syllabus Checklist */}
                        <div className="lms-syllabus-col">
                            <h3>Curriculum Lessons</h3>
                            <div className="lessons-checklist">
                                {lessons.map((lesson, idx) => {
                                    const isCurrent = currentLesson.id === lesson.id;

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`lesson-item ${isCurrent ? "active-lesson" : ""}`}
                                            onClick={() => setCurrentLesson(lesson)}
                                        >
                                            <div className="lesson-num">{idx + 1}</div>
                                            <div className="lesson-info">
                                                <h4>{lesson.title}</h4>
                                                {lesson.duration !== "—" && (
                                                    <span><Clock size={11} /> {lesson.duration}</span>
                                                )}
                                            </div>
                                            <button
                                                className={`checkbox-circle ${lesson.completed ? "checked" : ""}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleComplete(lesson.id);
                                                }}
                                                disabled={updating}
                                            >
                                                {lesson.completed && <CheckCircle2 size={16} color="#25D366" />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
