import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
const GalleryCard = ({ image, title, category }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="gallery-card"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(61,33,23,0.18)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <div className="gallery-card-img-wrapper">
                <img
                    src={image}
                    alt={title}
                    className="gallery-card-img"
                    style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
                />

                {/* Overlay on hover */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            className="gallery-card-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <motion.span
                                className="overlay-view"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                View Design ↗
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category badge */}
                <span className="gallery-category-badge">{category}</span>
            </div>

            <div className="gallery-card-info">
                <h3>{title}</h3>
                {/* <span className="gallery-card-cta" >Explore →</span> */}
                <Link to="/gallery" className="gallery-card-cta"> 
    Explore →
</Link>
            </div>
        </motion.div>
    );
};

export default GalleryCard;
