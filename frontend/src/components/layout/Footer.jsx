import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin, Heart } from "lucide-react";
import InstagramIcon from "../common/InstagramIcon";
import "./Footer.css";

const Footer = () => {
    const year = new Date().getFullYear();

    const quickLinks = [
        { label: "Home", path: "/" },
        { label: "About Kaju", path: "/about" },
        { label: "Gallery", path: "/gallery" },
        { label: "Services", path: "/services" },
        { label: "Contact", path: "/contact" },
    ];

    const academyLinks = [
        { label: "Basic Mehndi Course", path: "/academy" },
        { label: "Arabic Mehndi Course", path: "/academy" },
        { label: "Bridal Mehndi Course", path: "/academy" },
        { label: "Professional Course", path: "/academy" },
    ];

    const serviceLinks = [
        { label: "Bridal Mehndi", path: "/services" },
        { label: "Engagement Mehndi", path: "/services" },
        { label: "Arabic Mehndi", path: "/services" },
        { label: "Festival Mehndi", path: "/services" },
    ];

    return (
        <>
            {/* WhatsApp Float Button */}
            <motion.a
                href="https://wa.me/919244836867?text=Hi%20Kaju%20Ma'am!%20I%20want%20to%20enquire%20about%20Mehndi%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="whatsapp-tooltip">Chat with us!</span>
            </motion.a>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-top-border" />

                <div className="footer-container">
                    {/* Brand Column */}
                    <div className="footer-brand-col">
                        <Link to="/" className="footer-logo">
                            <span className="footer-logo-name">Kaju</span>
                            <span className="footer-logo-sub">Mehndi Artist</span>
                        </Link>
                        <p className="footer-tagline">Every Stroke Tells a Story.</p>
                        <p className="footer-desc">
                            Professional Mehndi Artist and Academy. Creating timeless art
                            for your most beautiful moments.
                        </p>

                        {/* Social Links */}
                        <div className="footer-socials">
                            <motion.a
                                href="https://www.instagram.com/kajal.mehndi_art_315/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link instagram"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                title="Instagram"
                            >
                                <InstagramIcon size={18} />
                            </motion.a>
                            <motion.a
                                href="https://wa.me/919244836867"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link whatsapp"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                title="WhatsApp"
                            >
                                <MessageCircle size={18} />
                            </motion.a>
                            <motion.a
                                href="tel:+919244836867"
                                className="social-link phone"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                title="Call Us"
                            >
                                <Phone size={18} />
                            </motion.a>
                            <motion.a
                                href="mailto:kajal.kumawat.mehndi@gmail.com"
                                className="social-link email"
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                title="Email Us"
                            >
                                <Mail size={18} />
                            </motion.a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Quick Links</h4>
                        <ul className="footer-links">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="footer-link">
                                        <span className="link-arrow">→</span> {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Academy */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Mehndi Academy</h4>
                        <ul className="footer-links">
                            {academyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="footer-link">
                                        <span className="link-arrow">→</span> {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Services</h4>
                        <ul className="footer-links">
                            {serviceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="footer-link">
                                        <span className="link-arrow">→</span> {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="footer-contact-mini">
                            <div className="contact-mini-item">
                                <MapPin size={13} />
                                <span>Bicholi Mardana , Near Indore Bypass Rd</span>
                            </div>
                            <div className="contact-mini-item">
                                <Phone size={13} />
                                <a href="tel:+919244836867" style={{ color: "inherit", textDecoration: "none" }}>+91 9244836867</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-inner">
                        <p className="footer-copyright">
                            © {year} Kaju Mehndi Artist. All Rights Reserved.
                        </p>
                        <p className="footer-made-with">
                            Made with <Heart size={12} className="heart-icon" /> in India
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
