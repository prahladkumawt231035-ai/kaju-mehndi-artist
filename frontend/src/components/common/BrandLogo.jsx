import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import kajuLogo from "../../assets/kaju-logo.jpg";

const BrandLogo = ({ size = "normal", showTagline = true, lightMode = false }) => {
  const isLarge = size === "large";
  const isSmall = size === "small";

  const circleSize = isSmall ? "42px" : isLarge ? "62px" : "50px";

  return (
    <Link to="/" className="brand-logo-container" style={{ textDecoration: "none" }}>
      <motion.div
        className="brand-logo-wrapper"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isSmall ? "10px" : "14px",
        }}
      >
        {/* Emblem Circular Image with Gold Luxury Border */}
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            border: "2px solid #B89A70",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(61, 33, 23, 0.18)",
            position: "relative",
            flexShrink: 0,
            background: "#3D2117",
          }}
        >
          <img
            src={kajuLogo}
            alt="Kaju Mehndi Artist Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: isSmall ? "24px" : isLarge ? "36px" : "29px",
              fontWeight: 700,
              color: lightMode ? "#F4EBDD" : "#70452C",
              letterSpacing: "0.5px",
            }}
          >
            Kaju
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: isSmall ? "9.5px" : isLarge ? "13px" : "11px",
              fontWeight: 600,
              color: "#B89A70",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            Mehndi Artist
          </span>

          {showTagline && !isSmall && (
            <span
              style={{
                fontSize: "9.5px",
                fontStyle: "italic",
                color: lightMode ? "rgba(244, 235, 221, 0.7)" : "#755C4C",
                marginTop: "2px",
                letterSpacing: "0.3px",
              }}
            >
              Every Stroke Tells a Story ♡
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default BrandLogo;
