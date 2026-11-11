import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
    Diamond, GraduationCap, CalendarCheck, SmilePlus,
    Star, ArrowRight, CheckCircle2, Sparkles
} from "lucide-react";
import InstagramIcon from "../../components/common/InstagramIcon";
import API from "../../api/axios";
import "./Home.css";

// Images from user upload
import kajuHero from "../../assets/kaju-hero.jpg";
import kajuAbout from "../../assets/kaju-about.jpg";
import bridalImg from "../../assets/bridal-mehndi.jpg";
import arabicImg from "../../assets/arabic-mehndi.jpg";
import rajasthaniImg from "../../assets/rajasthani-mehndi.jpg";
import minimalImg from "../../assets/minimal-mehndi.jpg";
import GallerySection from "../../components/ui/GallerySection";

/* ======== ANIMATION VARIANTS ======== */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const AnimatedSection = ({ children, variants = fadeUp, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const Home = () => {
    const [dbReviews, setDbReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await API.get("/reviews");
                if (data.reviews && data.reviews.length > 0) {
                    setDbReviews(data.reviews);
                }
            } catch (err) {
                console.warn("Could not load reviews from API:", err);
            }
        };
        fetchReviews();
    }, []);

    const services = [
        { title: "Bridal Mehndi", desc: "Special royal bridal intricate motifs", img: bridalImg },
        { title: "Engagement Mehndi", desc: "Modern delicate and charming patterns", img: arabicImg },
        { title: "Arabic Mehndi", desc: "Bold floral shading & flowing vines", img: rajasthaniImg },
        { title: "Festival Mehndi", desc: "Auspicious traditional Indian designs", img: minimalImg },
        { title: "Custom Designs", desc: "Portraits, wedding hashtags & personalized story", img: bridalImg },
    ];

    return (
        <div className="home">

            {/* ===== HERO SECTION ===== */}
            <section className="hero">
                <motion.div
                    className="hero-content"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="hero-emblem-badge" variants={fadeUp}>
                        <span className="crown-icon">👑</span>
                        <span className="hero-tag">THE ART OF TRADITION</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp}>
                        Beautiful Mehndi,
                        <span>Beautiful Memories.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="hero-desc">
                        Creating art on your hands, and happiness in your heart.
                        Explore breathtaking bridal designs, book your appointment,
                        and learn the art of Mehndi with Kaju.
                    </motion.p>

                    <motion.div className="hero-buttons" variants={fadeUp}>
                        <motion.a
                            href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20want%20to%20book%20Mehndi%20appointment."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-wa-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Book on WhatsApp →
                        </motion.a>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                            <Link to="/booking" className="primary-btn">
                                Online Booking Form
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                            <Link to="/academy" className="secondary-btn">
                                🎓 Join Our Academy
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Quick Stats Badges matching user's Image 1 & 2 */}
                    <motion.div className="hero-stats-row" variants={fadeUp}>
                        <div className="stat-pill">
                            <Diamond size={17} color="#B89A70" />
                            <span>Bridal Mehndi</span>
                        </div>
                        <div className="stat-pill">
                            <GraduationCap size={17} color="#B89A70" />
                            <span>Mehndi Classes</span>
                        </div>
                        <div className="stat-pill">
                            <CalendarCheck size={17} color="#B89A70" />
                            <span>Book Appointment</span>
                        </div>
                        <div className="stat-pill">
                            <SmilePlus size={17} color="#B89A70" />
                            <span>Happy Clients</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Hero Showcase Image (Kaju in Bridal Attire) */}
                <motion.div
                    className="hero-image-container"
                    variants={fadeRight}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                >
                    <div className="hero-artist-card">
                        <img
                            src={kajuHero}
                            alt="Kaju Mehndi Artist with intricate bridal mehndi"
                            className="hero-artist-img"
                        />
                        <div className="hero-floating-badge">
                            <span className="badge-title">Kaju Mehndi Artist</span>
                            <span className="badge-subtitle">Every Stroke Tells a Story ♡</span>
                            <Link to="/gallery" className="badge-action">
                                Explore My Work →
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ===== ABOUT ARTIST PREVIEW SECTION ===== */}
            <section className="about-section">
                <div className="about-container">
                    <AnimatedSection variants={fadeLeft} className="about-image-wrapper">
                        <div className="about-portrait-frame">
                            <img
                                src={kajuAbout}
                                alt="Artist Kaju portrait"
                                className="about-portrait-img"
                            />
                            <div className="gold-seal">
                                <span>Master Artist</span>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection variants={fadeRight} className="about-text-content">
                        <span className="section-tag">MEET THE ARTIST</span>
                        <h2>
                            Where Tradition Meets <span>Creativity</span>
                        </h2>
                        <p className="lead-text">
                            "Mehndi is not just body art—it is an emotion, an auspicious blessing,
                            and a timeless celebration."
                        </p>
                        <p>
                            Welcome to Kaju Mehndi Artist. With dedicated mastery over intricate
                            Indian, Rajasthani, Arabic, and Contemporary bridal motifs, Kaju crafts
                            every stroke with utmost precision, dark staining organic hennas, and pure love.
                        </p>

                        <div className="about-perks">
                            <div className="perk-item">
                                <CheckCircle2 size={18} color="#B89A70" />
                                <span>100% Organic & Chemical-Free Henna</span>
                            </div>
                            <div className="perk-item">
                                <CheckCircle2 size={18} color="#B89A70" />
                                <span>Dark Stain & Long Lasting Guaranteed</span>
                            </div>
                            <div className="perk-item">
                                <CheckCircle2 size={18} color="#B89A70" />
                                <span>Custom Bridal Story Figures & Hashes</span>
                            </div>
                        </div>

                        <div style={{ marginTop: "25px" }}>
                            <Link to="/about" className="primary-btn">
                                Discover Kaju's Journey →
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ===== OUR SERVICES SECTION (from user design mockup) ===== */}
            <section className="services-section">
                <AnimatedSection variants={fadeUp}>
                    <div className="section-heading-centered">
                        <span className="section-tag">OUR SERVICES</span>
                        <h2>For Every Occasion, A Touch of Mehndi Magic</h2>
                        <p>From royal bridal extravaganzas to chic minimal party designs.</p>
                    </div>
                </AnimatedSection>

                <div className="services-horizontal-cards">
                    {services.map((svc, i) => (
                        <AnimatedSection key={svc.title} delay={i * 0.1} variants={scaleIn}>
                            <motion.div
                                className="service-thumb-card"
                                whileHover={{ y: -6, boxShadow: "0 15px 40px rgba(61,33,23,0.15)" }}
                            >
                                <div className="service-thumb-img-box">
                                    <img src={svc.img} alt={svc.title} />
                                </div>
                                <div className="service-thumb-info">
                                    <h3>{svc.title}</h3>
                                    <p>{svc.desc}</p>
                                    <Link to="/booking" className="service-arrow-btn">
                                        →
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatedSection>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "35px" }}>
                    <Link to="/services" className="text-link">
                        Explore All Services & Pricing Details →
                    </Link>
                </div>
            </section>

            {/* ===== GALLERY HIGHLIGHTS ===== */}
            <GallerySection />

            {/* ===== MEHNDI ACADEMY SECTION (from user mockup) ===== */}
            <section className="academy-section">
                <div className="academy-inner">
                    <AnimatedSection variants={fadeLeft}>
                        <div className="academy-content">
                            <span className="section-tag light">OUR MEHNDI ACADEMY</span>
                            <h2>Learn • Practice • Grow</h2>
                            <p className="academy-sub">
                                Professional Mehndi Classes for All Skill Levels.
                                From foundational cone handling to master-level bridal figures.
                            </p>

                            <ul className="academy-checklist">
                                <li>
                                    <CheckCircle2 size={16} color="#B89A70" />
                                    <span>Basic to Advanced Courses</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} color="#B89A70" />
                                    <span>Online & Offline Classes</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} color="#B89A70" />
                                    <span>Professional Certificate Provided</span>
                                </li>
                                <li>
                                    <CheckCircle2 size={16} color="#B89A70" />
                                    <span>Personalized Expert Guidance & Live Doubt Sessions</span>
                                </li>
                            </ul>

                            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "24px" }}>
                                <Link to="/academy" className="academy-cta-btn">
                                    Explore Courses →
                                </Link>
                                <a
                                    href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20want%20to%20know%20more%20about%20academy%20courses."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="academy-wa-btn"
                                >
                                    WhatsApp Enquiry
                                </a>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection variants={fadeRight}>
                        <div className="academy-art-card">
                            <img src={kajuHero} alt="Academy Instructor Kaju" />
                            <div className="academy-tag-card">
                                <strong>500+ Students Certified</strong>
                                <span>Join the upcoming batch today</span>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ===== WHAT OUR CLIENTS SAY (from user mockup) ===== */}
            <section className="testimonials-section">
                <AnimatedSection variants={fadeUp}>
                    <div className="section-heading-centered">
                        <span className="section-tag">TESTIMONIALS</span>
                        <h2>What Our Clients Say</h2>
                        <p>Real Stories, Real Happiness</p>
                    </div>
                </AnimatedSection>

                <div className="testimonials-grid">
                    {dbReviews.length > 0 ? (
                        dbReviews.slice(0, 6).map((rev, idx) => (
                            <AnimatedSection key={rev._id || idx} delay={idx * 0.1} variants={scaleIn}>
                                <div className="testimonial-bubble">
                                    <div className="quote-icon">“</div>
                                    <p>"{rev.comment}"</p>
                                    <div className="testimonial-user">
                                        <div className="user-avatar">
                                            {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "C"}
                                        </div>
                                        <div>
                                            <h4>{rev.user?.name || "Verified Client"}</h4>
                                            <div className="stars">
                                                {"★".repeat(rev.rating || 5)}
                                                {"☆".repeat(Math.max(0, 5 - (rev.rating || 5)))}
                                            </div>
                                            <span style={{ fontSize: "0.72rem", color: "#8B6A4E", display: "block", marginTop: "2px", fontWeight: 600 }}>
                                                {rev.type === "course" ? `🎓 ${rev.course?.title || rev.serviceName || "Academy Student"}` : `✨ ${rev.serviceName || "Bridal Mehndi"}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))
                    ) : (
                        <>
                            <AnimatedSection delay={0.1} variants={scaleIn}>
                                <div className="testimonial-bubble">
                                    <div className="quote-icon">“</div>
                                    <p>
                                        "Kaju ma'am ne bahut achhe se Mehndi sikhaya. Ek ek trick aur cone grip
                                        detail me samjhaya. Ab main khud bridal designs confident hoke bana sakti hoon!"
                                    </p>
                                    <div className="testimonial-user">
                                        <div className="user-avatar">N</div>
                                        <div>
                                            <h4>Neha Sharma</h4>
                                            <div className="stars">★★★★★</div>
                                            <span style={{ fontSize: "0.72rem", color: "#8B6A4E", display: "block", marginTop: "2px" }}>🎓 Academy Student</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.2} variants={scaleIn}>
                                <div className="testimonial-bubble">
                                    <div className="quote-icon">“</div>
                                    <p>
                                        "My wedding bridal mehndi was so dark and intricate! Everyone in the family
                                        was mesmerized. Thank you Kaju for making my special day unforgettable."
                                    </p>
                                    <div className="testimonial-user">
                                        <div className="user-avatar">P</div>
                                        <div>
                                            <h4>Pooja Khandelwal</h4>
                                            <div className="stars">★★★★★</div>
                                            <span style={{ fontSize: "0.72rem", color: "#8B6A4E", display: "block", marginTop: "2px" }}>✨ Bridal Client</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.3} variants={scaleIn}>
                                <div className="testimonial-bubble">
                                    <div className="quote-icon">“</div>
                                    <p>
                                        "Superb professionalism, punctual, and the stain lasted for over two weeks!
                                        Best Mehndi artist in town without any doubt."
                                    </p>
                                    <div className="testimonial-user">
                                        <div className="user-avatar">R</div>
                                        <div>
                                            <h4>Ritu Rathore</h4>
                                            <div className="stars">★★★★★</div>
                                            <span style={{ fontSize: "0.72rem", color: "#8B6A4E", display: "block", marginTop: "2px" }}>✨ Engagement Client</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </>
                    )}
                </div>
            </section>

            {/* ===== INSTAGRAM SHOWCASE SECTION (from user mockup) ===== */}
            <section className="instagram-section">
                <div className="insta-header">
                    <div>
                        <span className="section-tag">GALLERY ON INSTAGRAM</span>
                        <h2>Follow Us on Instagram</h2>
                    </div>
                    <a
                        href="https://www.instagram.com/kajal.mehndi_art_315/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="insta-follow-btn"
                    >
                        <InstagramIcon size={17} />
                        kajal.mehndi_art_315 
                    </a>
                </div>

                <div className="insta-grid">
                    {[bridalImg, arabicImg, rajasthaniImg, minimalImg].map((img, i) => (
                        <motion.a
                            key={i}
                            href="https://www.instagram.com/kajal.mehndi_art_315/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="insta-card"
                            whileHover={{ scale: 1.03 }}
                        >
                            <img src={img} alt={`Mehndi showcase ${i + 1}`} />
                            <div className="insta-hover-overlay">
                                <InstagramIcon size={24} color="#FFFDF8" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* ===== QUICK BOOKING CALL TO ACTION ===== */}
            <section className="home-cta">
                <AnimatedSection variants={scaleIn}>
                    <div className="home-cta-box">
                        <h2>Ready to Create Beautiful Memories?</h2>
                        <p>
                            Book your bridal or event mehndi with Kaju today, or get enrolled in our academy.
                        </p>
                        <div className="home-cta-buttons">
                            <a
                                href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20want%20to%20book%20an%20appointment."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cta-wa-btn"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Instant WhatsApp Booking
                            </a>
                            <Link to="/booking" className="cta-online-btn">
                                Open Booking Form →
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

        </div>
    );
};

export default Home;
