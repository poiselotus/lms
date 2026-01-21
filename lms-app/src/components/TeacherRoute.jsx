import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function TeacherRoute({ children }) {
    const { profile, loading, isTeacher } = useAuth();

    useEffect(() => {
        if (!loading && !isTeacher) {
            toast.error("Access Denied: Teacher permissions required.");
        }
    }, [isTeacher, loading]);

    if (loading) return null;

    if (!isTeacher) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
}