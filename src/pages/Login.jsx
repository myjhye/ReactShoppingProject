import { useState } from "react";
import { loginWithEmailandPassword } from "../api/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { useAuthContext } from "../context/AuthContext";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // 오류 메세지
    const [message, setMessage] = useState('');

    const navigate = useNavigate();



    // 상태관리 컨텍스트에서 로그인 함수 가져오기 -> google 로그인 
    // -> 아직은 로그인 페이지에서만 해당 기능을 사용하지만 추후 확장 구조를 유지하기 위해 컨텍스트 사용 
    const { login } = useAuthContext();




    // 로그인 핸들러 -> 일반 로그인
    const handleLogin = async (e) => {

        e.preventDefault();


        try {
            
            // 이메일과 비밀번호로 로그인
            const result = await loginWithEmailandPassword(email, password);
            


            // 로그인 성공 -> 홈으로 이동
            if(result.success) {
                navigate('/');


            // 로그인 실패 -> 오류 메세지 설정    
            } else {
                setMessage(result.message);
            }

            
        } catch(error) {
            console.error(error);
        }
        
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-4">로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block font-medium mb-1">이메일</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            className="w-full border rounded-md px-3 py-2" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block font-medium mb-1">비밀번호</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="w-full border rounded-md px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="text-red-500 text-sm mt-1">{message}</p>}

                    
                    <button 
                        type="submit" 
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:brightness-110 mb-5"
                    >로그인</button>
                    아이디가 없으신가요?
                    <Link
                        to='/signup'
                        className="text-blue-500 cursor-pointer"
                    >
                        회원가입
                    </Link>
                    <FcGoogle className="text-4xl cursor-pointer mt-4" onClick={login} />
                </form>
            </div>
        </div>
    )
}