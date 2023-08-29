import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin }) {

    // AuthContext에서 사용자 정보를 가져옴
    const { user } = useAuthContext();


    // 사용자가 로그인하지 않았거나
    // 사용자가 관리자 권한이 필요하면서 관리자가 아닌 경우
    if(!user || (requireAdmin && !user.isAdmin)) {

        // home으로 리다이렉트 하며 브라우저 기록을 대체
        return <Navigate to="/" replace />
    }

    // 사용자가 로그인 했거나
    // 사용자가 관리자 권한이 있으면 해당 컴포넌트 렌더링
    return children;
}