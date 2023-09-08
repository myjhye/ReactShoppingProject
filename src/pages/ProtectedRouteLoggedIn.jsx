import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    // AuthContext에서 사용자 정보를 가져옴
    const { user } = useAuthContext();

    if(user) {

        return <Navigate to="/" replace />
    }

    return children;
}