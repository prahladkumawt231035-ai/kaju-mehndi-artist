import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Clock, Loader, AlertCircle } from "lucide-react";
import "./Services.css";

import bridalImg from "../../assets/bridal-mehndi.jpg";
import arabicImg from "../../assets/arabic-mehndi.jpg";
import rajasthaniImg from "../../assets/rajasthani-mehndi.jpg";
import minimalImg from "../../assets/minimal-mehndi.jpg";
import kajuHero from "../../assets/kaju-hero.jpg";
import kajuAbout from "../../assets/kaju-about.jpg";
import API from "../../api/axios";

// Fallback data shown when API is unavailable
const FALLBACK_SERVICES = [
    {
        _id: "bridal",
        title: "Royal Bridal Mehndi",
        tag: "MOST POPULAR",
        startingPrice: 5100,
        duration: "4 - 6 Hours",
        image: null,
        description: "Exclusive customized bridal artistry featuring intricate Dulha-Dulhan portraits, Baraat, Shehnai, Kalash, and couple's love story motifs on both hands and feet.",
        features: [
            "Elbow length arms & mid-calf feet coverage",
            "Custom wedding portrait & couple hashtag",
            "100% natural organic dark staining henna",
            "Complimentary aftercare sealant application",
        ],
    },
    {
        _id: "engagement",
        title: "Engagement & Roka Mehndi",
        tag: "ELEGANT",
        startingPrice: 2500,
        duration: "2 - 3 Hours",
        image: null,
        description: "Graceful contemporary patterns blending floral chandeliers, delicate lace netting, and customized ring ceremony symbols.",
        features: [
            "Forearm front & back coverage",
            "Modern aesthetic with negative space",
            "Ideal for engagement rings photoshoot",
            "Fast drying organic henna paste",
        ],
    },
    {
        _id: "arabic",
        title: "Arabic & Indo-Western",
        tag: "TRENDING",
        startingPrice: 1500,
        duration: "1 - 2 Hours",
        image: null,
        description: "Bold floral shading, flowing vines, leaf clusters, and modern gulf motifs that make a striking statement.",
        features: [
            "Distinct 3D shading technique",
            "Bold contours & fine mesh filling",
            "Quick application for modern events",
            "Long-lasting rich brown stain",
        ],
    },
    {
        _id: "rajasthani",
        title: "Heritage Rajasthani Mehndi",
        tag: "TRADITIONAL",
        startingPrice: 3100,
        duration: "3 - 4 Hours",
        image: null,
        description: "Authentic Marwari heritage designs with peacocks, jharokha arches, royal palace pillars, and fine geometric jaal.",
        features: [
            "Dense traditional Indian filler work",
            "Classical auspicious motifs",
            "Traditional royal bride preference",
            "Deep mahogany stain guarantee",
        ],
    },
    {
        _id: "party",
        title: "Party & Bridesmaid Mehndi",
        tag: "GROUP PACKAGES",
        startingPrice: 500,
        duration: "15 - 30 Mins / person",
        image: null,
        description: "Chic and quick backhand or palm designs for sisters, mothers, bridesmaids, and wedding guests.",
        features: [
            "Variety of stylish quick patterns",
            "Special group & package discounts",
            "Efficient artist speed for large gatherings",
            "Safe for kids and elders alike",
        ],
    },
    {
        _id: "festival",
        title: "Festive Special Mehndi",
        tag: "SEASONAL",
        startingPrice: 800,
        duration: "30 - 45 Mins",
        image: null,
        description: "Celebratory designs specially tailored for Karwa Chauth, Teej, Diwali, Eid, and Raksha Bandhan festivities.",
        features: [
            "Moon, diya, & festival symbols",
            "Special festival discount slots",
            "Home service / studio appointments",
            "Rich festive stain",
        ],
    },
];

// Local images to use as fallback when no Cloudinary image
const LOCAL_IMGS = [kajuHero, kajuAbout, arabicImg, rajasthaniImg, minimalImg, bridalImg];

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const { data } = await API.get("/services");
                const list = data.services || data.data || [];
                if (list.length > 0) {
                    setServices(list);
                } else {
                    // No services in DB yet — use fallback
                    setServices(FALLBACK_SERVICES);
                }
            } catch (err) {
                console.error("Failed to load services:", err);
                setError("Could not connect to server. Showing cached services.");
                setServices(FALLBACK_SERVICES);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="services-page">
            {/* Page Header */}
            <div className="services-hero">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="services-tag">✦ BESPOKE MEHNDI ARTISTRY ✦</span>
                    <h1>Our Mehndi Services</h1>
                    <p>Designed for life's most unforgettable celebrations. Book online or reserve via WhatsApp.</p>
                </motion.div>
            </div>

            {/* Service Cards Grid */}
            <div className="services-container">

                {/* Error notice */}
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
                        <span style={{ fontSize: "1.1rem" }}>Loading services...</span>
                    </div>
                ) : (
                    <div className="services-cards-grid">
                        {services.map((svc, i) => {
                            // Use Cloudinary image if available, else local fallback
                            const svcImg = svc.image || svc.imageUrl || LOCAL_IMGS[i % LOCAL_IMGS.length];
                            const features = Array.isArray(svc.features) ? svc.features : [];
                            const waMsg = encodeURIComponent(
                                `🌸 *Mehndi Booking Inquiry* 🌸\n\n` +
                                `💍 *Service:* ${svc.title}\n` +
                                `💰 *Starting Price:* ₹${svc.startingPrice || svc.price || "N/A"}\n` +
                                `I would like to inquire about availability and book this service. Please share details! 🙏`
                            );

                            return (
                                <motion.div
                                    key={svc._id}
                                    className="service-detail-card"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(61,33,23,0.18)" }}
                                >
                                    <div className="svc-card-img-box">
                                        <img src={svcImg} alt={svc.title} />
                                        <span className="svc-tag-pill">
                                            {svc.tag || svc.category || "SERVICE"}
                                        </span>
                                    </div>

                                    <div className="svc-card-content">
                                        <div className="svc-title-row">
                                            <h3>{svc.title}</h3>
                                            <div className="svc-price-box">
                                                <span>Starts at</span>
                                                <strong>₹{svc.startingPrice || svc.price || "—"}</strong>
                                            </div>
                                        </div>

                                        {svc.duration && (
                                            <div className="svc-duration">
                                                <Clock size={13} color="#B89A70" />
                                                <span>Approx Duration: {svc.duration}</span>
                                            </div>
                                        )}

                                        <p className="svc-description">
                                            {svc.description || svc.desc}
                                        </p>

                                        {features.length > 0 && (
                                            <ul className="svc-features-list">
                                                {features.map((feat, idx) => (
                                                    <li key={idx}>
                                                        <Check size={14} color="#B89A70" />
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="svc-action-buttons">
                                            <a
                                                href={`https://wa.me/919244836867?text=${waMsg}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="svc-wa-btn"
                                            >
                                                <WhatsAppIcon />
                                                Book on WhatsApp
                                            </a>

                                            <Link to="/booking" className="svc-book-btn">
                                                Book Online →
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

export default Services;
