import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading, initialized } = useSelector(
        (state) => state.auth
    );

    // Wait for authentication check from backend / token
    if (loading && !initialized) {
        return (
            <div style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#70452C",
                fontFamily: "Playfair Display, serif",
                gap: "1rem"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #E8D5BD",
                    borderTop: "3px solid #70452C",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <p>Verifying authentication...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // If trying to access admin area without admin auth
    const isAdminRoute = allowedRoles.length === 1 && allowedRoles[0] === "admin";

    if (!isAuthenticated || !user) {
        return <Navigate to={isAdminRoute ? "/admin-login" : "/login"} replace />;
    }

    // Role permission check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (isAdminRoute) {
            return <Navigate to="/admin-login" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
