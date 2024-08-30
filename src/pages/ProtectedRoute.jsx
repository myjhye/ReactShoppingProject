import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    // 사용자 정보 (로그인 여부 확인)
    const { user } = useAuthContext();

    // 사용자가 로그인하지 않은 경우
    if(!user) {
        // home으로 이동
        // replace: 현재 페이지를 신규 페이지로 대체 (뒤로 가기해도 이전 페이지로 못 돌아감)
        return <Navigate to="/login" replace />
    }

    // 조건 충족 시 자식 컴포넌트 렌더링 (사용자가 해당 경로에 접근 가능)
    return children;
}