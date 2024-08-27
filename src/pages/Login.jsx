import { FcGoogle } from 'react-icons/fc';
import { useAuthContext } from "../context/AuthContext";

export default function Login() {

    const { login } = useAuthContext();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-md w-96 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">환영합니다!</h2>
                <p className="text-gray-600 mb-8">Google 계정으로 간편하게 로그인하세요.</p>
                <button 
                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100"
                    onClick={login}
                >
                    <FcGoogle className="text-2xl mr-2" />
                    <span className="text-lg font-medium">Google로 시작하기</span>
                </button>
            </div>
        </div>
    );
}
