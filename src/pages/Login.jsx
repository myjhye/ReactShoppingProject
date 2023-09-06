import { useState } from "react";
import { loginWithEmailandPassword } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();


        try {
            
            const result = await loginWithEmailandPassword(email, password);
            
            // 로그인 성공
            if(result.success) {
                navigate('/');

            // 로그인 실패    
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
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:brightness-110"
                    >Sign Up</button>
                </form>
            </div>
        </div>
    )
}