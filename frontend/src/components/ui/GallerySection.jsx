import { motion } from "framer-motion";
import "./GallerySection.css";
import GalleryCard from "./GalleryCard";
import { Link } from "react-router-dom";

import bridalImage from "../../assets/bridal-mehndi.jpg";
import arabicImage from "../../assets/arabic-mehndi.jpg";
import rajasthaniImage from "../../assets/rajasthani-mehndi.jpg";
import minimalImage from "../../assets/minimal-mehndi.jpg";

const designs = [
    { id: 1, image: bridalImage, title: "Bridal Mehndi", category: "Bridal" },
    { id: 2, image: arabicImage, title: "Arabic Mehndi", category: "Arabic" },
    { id: 3, image: rajasthaniImage, title: "Rajasthani Mehndi", category: "Traditional" },
    { id: 4, image: minimalImage, title: "Minimal Mehndi", category: "Minimal" },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const GallerySection = () => {
    return (
        <section className="gallery-section">
            {/* Heading */}
            <motion.div
                className="gallery-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
            >
                <span className="gallery-tag">OUR COLLECTION</span>
                <h2>Beautiful Mehndi Designs</h2>
                <p>Explore our beautiful collection of handcrafted Mehndi art.</p>
            </motion.div>

            {/* Grid */}
            <motion.div
                className="gallery-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
            >
                {designs.map((design) => (
                    <motion.div key={design.id} variants={cardVariants}>
                        <GalleryCard
                            image={design.image}
                            title={design.title}
                            category={design.category}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* CTA */}
            <motion.div
                className="gallery-cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Link to="/gallery" className="gallery-view-all">
                    View Full Gallery →
                </Link>
            </motion.div>
        </section>
    );
};

export default GallerySection;
