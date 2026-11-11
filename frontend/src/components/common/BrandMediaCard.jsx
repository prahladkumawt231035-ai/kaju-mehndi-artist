import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Play, Sparkles, X } from "lucide-react";
import fallbackBridal from "../../assets/bridal-mehndi.jpg";

/**
 * BrandMediaCard
 * Automatically applies:
 * 1. Royal Gold Luxury Border & Shadow
 * 2. Automatic Brand Watermark: "Kaju Mehndi Artist • Every Stroke Tells a Story"
 * 3. Aspect Ratio Normalization (Portrait / Square)
 * 4. Automatic "Order this Design on WhatsApp" pre-filled link
 * 5. Video reel player support with overlay
 * 6. Lightbox preview & graceful image fallback
 */
const BrandMediaCard = ({
    mediaUrl,
    title = "Signature Bridal Mehndi",
    category = "Bridal",
    isVideo = false,
    price = null,
    whatsappNumber = "919244836867",
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [imgSrc, setImgSrc] = useState(mediaUrl || fallbackBridal);

    useEffect(() => {
        setImgSrc(mediaUrl || fallbackBridal);
    }, [mediaUrl]);

    // Build automated WhatsApp inquiry text for this specific design
    const waMessage = encodeURIComponent(
        `🌸 *Inquiry for Mehndi Design* 🌸\n\n` +
        `📸 *Design:* ${title}\n` +
        `🏷️ *Category:* ${category}\n` +
        (price ? `💰 *Starting Price:* ₹${price}\n` : "") +
        `I loved this design from your website gallery and would love to know availability and pricing! 🙏`
    );

    return (
        <>
            <motion.div
                className="brand-media-card"
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -6, boxShadow: "0 18px 45px rgba(61, 33, 23, 0.18)" }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                style={{
                    position: "relative",
                    background: "#FFFDF8",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1.5px solid rgba(184, 154, 112, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Media Box */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "280px",
                        overflow: "hidden",
                        background: "#3D2117",
                        cursor: "pointer",
                    }}
                    onClick={() => setLightboxOpen(true)}
                >
                    {isVideo ? (
                        <video
                            src={imgSrc}
                            muted
                            loop
                            playsInline
                            autoPlay={hovered}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                                transform: hovered ? "scale(1.05)" : "scale(1)",
                            }}
                        />
                    ) : (
                        <img
                            src={imgSrc}
                            alt={title}
                            loading="lazy"
                            onError={() => setImgSrc(fallbackBridal)}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                                transform: hovered ? "scale(1.08)" : "scale(1)",
                            }}
                        />
                    )}

                    {/* AUTOMATIC BRAND WATERMARK */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "10px",
                            background: "rgba(61, 33, 23, 0.72)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(184, 154, 112, 0.4)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <span style={{ fontSize: "10px", color: "#B89A70" }}>👑</span>
                        <span
                            style={{
                                fontFamily: "'Dancing Script', cursive",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#FFFDF8",
                            }}
                        >
                            Kaju
                        </span>
                        <span
                            style={{
                                fontSize: "8.5px",
                                color: "#B89A70",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                            }}
                        >
                            Mehndi Artist
                        </span>
                    </div>

                    {/* Category Pill */}
                    <div
                        style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            background: "rgba(112, 69, 44, 0.85)",
                            backdropFilter: "blur(6px)",
                            color: "#FFFDF8",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            border: "1px solid rgba(184, 154, 112, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <Sparkles size={10} color="#B89A70" />
                        {category}
                    </div>

                    {/* Video Play Icon indicator */}
                    {isVideo && (
                        <div
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                background: "rgba(37, 211, 102, 0.9)",
                                color: "white",
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Play size={12} fill="white" />
                        </div>
                    )}

                    {/* Quick Preview Hover Overlay */}
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(61, 33, 23, 0.45)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        background: "rgba(255, 253, 248, 0.95)",
                                        color: "#70452C",
                                        padding: "8px 16px",
                                        borderRadius: "20px",
                                        fontSize: "12.5px",
                                        fontWeight: 600,
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Eye size={14} /> View Full Screen
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Card Info & WhatsApp Action */}
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#3D2117",
                                margin: 0,
                            }}
                        >
                            {title}
                        </h3>
                        {price && (
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#70452C" }}>
                                ₹{price}
                            </span>
                        )}
                    </div>

                    {/* WhatsApp Direct Order Button */}
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "#25D366",
                            color: "white",
                            padding: "9px 14px",
                            borderRadius: "8px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#128C7E")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Order on WhatsApp
                    </a>
                </div>
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxOpen(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            background: "rgba(61, 33, 23, 0.92)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                        }}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            style={{
                                position: "absolute",
                                top: "24px",
                                right: "24px",
                                background: "rgba(255, 253, 248, 0.2)",
                                border: "1px solid rgba(184, 154, 112, 0.4)",
                                color: "white",
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <X size={22} />
                        </button>

                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: "750px",
                                maxHeight: "85vh",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "16px",
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={imgSrc}
                                    controls
                                    autoPlay
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "70vh",
                                        borderRadius: "12px",
                                        border: "2px solid #B89A70",
                                    }}
                                />
                            ) : (
                                <img
                                    src={imgSrc}
                                    alt={title}
                                    onError={() => setImgSrc(fallbackBridal)}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "70vh",
                                        objectFit: "contain",
                                        borderRadius: "12px",
                                        border: "2px solid #B89A70",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                                    }}
                                />
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "center",
                                    color: "white",
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "20px", color: "#FFFDF8" }}>{title}</h3>
                                    <span style={{ fontSize: "13px", color: "#B89A70" }}>{category} Mehndi Design</span>
                                </div>

                                <a
                                    href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "#25D366",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                    }}
                                >
                                    Book This on WhatsApp →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BrandMediaCard;
