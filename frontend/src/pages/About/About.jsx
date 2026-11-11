import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Award, Heart, Sparkles, BookOpen, CheckCircle,
    Star, Users, Clock, ShieldCheck
} from "lucide-react";
import "./About.css";
import kajuPortrait from "../../assets/kaju-about.jpg";
import kajuHero from "../../assets/kaju-hero.jpg";

const About = () => {
    const specializations = [
        {
            title: "Traditional Bridal Mehndi",
            desc: "Dulha-Dulhan figures, barati processions, doli, shehnai, and intricate lace filler work.",
        },
        {
            title: "Royal Rajasthani & Marwari",
            desc: "Dense heritage peacock, jharokha, elephant, and royal palace motifs.",
        },
        {
            title: "Arabic & Indo-Western",
            desc: "Flowing bold vines, 3D shaded florals, negative space, and modern minimal charms.",
        },
        {
            title: "Customized Story Mehndi",
            desc: "Couples' love story, skyline silhouettes, wedding date, and secret hashtags woven into design.",
        },
    ];

    const milestones = [
        { year: "2016", title: "The Artistic Genesis", desc: "Started personal artistic journey with pure natural hennas." },
        { year: "2019", title: "Bridal Specialist", desc: "Completed 200+ exclusive bridal bookings across multiple states." },
        { year: "2021", title: "Academy Launch", desc: "Founded Kaju Mehndi Academy to empower aspiring artists." },
        { year: "2024", title: "500+ Students Mentored", desc: "Trained students worldwide through online & offline masterclasses." },
    ];

    return (
        <div className="about-page">
            {/* Header Banner */}
            <div className="about-hero-banner">
                <motion.div
                    className="about-hero-content"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="banner-tag">✦ THE ARTIST & MENTOR ✦</span>
                    <h1>The Soul Behind the Art</h1>
                    <p className="banner-sub">
                        "Every stroke of henna carries a blessing, every pattern whispers a memory."
                    </p>
                </motion.div>
            </div>

            {/* Main Biography Section */}
            <section className="about-bio-section">
                <div className="bio-container">
                    <motion.div
                        className="bio-photo-card"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bio-photo-frame">
                            <img src={kajuPortrait} alt="Kaju - Lead Mehndi Artist" />
                        </div>
                        <div className="bio-experience-badge">
                            <strong>8+</strong>
                            <span>Years of Artistry</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bio-info"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-tag">HER STORY</span>
                        <h2>Meet Kaju</h2>
                        <h4 className="artist-title">Master Mehndi Artist & Founder of Kaju Mehandi Academy</h4>

                        <p className="bio-lead">
                            For Kaju, Mehndi is not merely an ornament—it is a sacred cultural heritage
                            and a medium of storytelling.
                        </p>

                        <p>
                            Starting her journey with an innate passion for fine traditional patterns,
                            Kaju has spent years perfecting the rhythm of the henna cone. Her signature
                            style balances the grandeur of royal heritage Indian aesthetics with the elegance
                            of modern clean lines.
                        </p>

                        <p>
                            She is renowned for her unwavering commitment to using only 100% triple-filtered
                            organic Rajasthani Sojat henna, infused with pure essential oils like eucalyptus
                            and cajeput to ensure a deep, mahogany bridal stain with no harsh chemicals.
                        </p>

                        <div className="bio-stats-grid">
                            <div className="bio-stat-box">
                                <Users size={22} color="#B89A70" />
                                <strong>800+</strong>
                                <span>Delighted Brides</span>
                            </div>
                            <div className="bio-stat-box">
                                <BookOpen size={22} color="#B89A70" />
                                <strong>500+</strong>
                                <span>Academy Students</span>
                            </div>
                            <div className="bio-stat-box">
                                <ShieldCheck size={22} color="#B89A70" />
                                <strong>100%</strong>
                                <span>Organic Henna</span>
                            </div>
                        </div>

                        <div className="bio-actions">
                            <a
                                href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20would%20love%20to%20discuss%20bridal%20Mehndi%20with%20you."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bio-wa-btn"
                            >
                                Chat on WhatsApp →
                            </a>
                            <Link to="/booking" className="primary-btn">
                                Reserve an Event Date
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Specializations Section */}
            <section className="about-specialties-section">
                <div className="section-heading-centered">
                    <span className="section-tag">ARTISTIC REPERTOIRE</span>
                    <h2>Signature Specializations</h2>
                    <p>Meticulous attention to detail for life's most precious celebrations</p>
                </div>

                <div className="specialties-grid">
                    {specializations.map((spec, i) => (
                        <motion.div
                            key={spec.title}
                            className="specialty-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -6, borderColor: "#B89A70" }}
                        >
                            <div className="spec-icon">
                                <Sparkles size={20} color="#70452C" />
                            </div>
                            <h3>{spec.title}</h3>
                            <p>{spec.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Journey Timeline */}
            <section className="about-timeline-section">
                <div className="section-heading-centered">
                    <span className="section-tag">THE JOURNEY</span>
                    <h2>Milestones of Art & Passion</h2>
                </div>

                <div className="timeline-container">
                    {milestones.map((item, i) => (
                        <motion.div
                            key={item.year}
                            className="timeline-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                        >
                            <div className="timeline-year">{item.year}</div>
                            <div className="timeline-content">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision-section">
                <div className="mission-vision-grid">
                    <motion.div
                        className="mv-card"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Heart size={28} color="#B89A70" />
                        <h3>Our Mission</h3>
                        <p>
                            To enrich every bride’s momentous day with unmatched handcrafted art,
                            honoring timeless traditions while prioritizing skin-safe natural ingredients
                            and authentic human connection.
                        </p>
                    </motion.div>

                    <motion.div
                        className="mv-card"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Award size={28} color="#B89A70" />
                        <h3>Our Vision</h3>
                        <p>
                            To nurture the next generation of professional henna artists through
                            structured academy education, turning creative passion into viable,
                            respected entrepreneurial careers worldwide.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Call to action */}
            <section className="about-cta-bar">
                <div className="cta-bar-inner">
                    <div>
                        <h2>Ready to learn or book with Kaju?</h2>
                        <p>Let's create timeless art together.</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Link to="/booking" className="primary-btn">
                            Book Mehndi Now
                        </Link>
                        <Link to="/academy" className="secondary-btn">
                            Join Academy Classes
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
