import React, { useState } from 'react';
import { signUpWithEmailandPassword } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const [showTermsPopup, setShowTermsPopup] = useState(false); // State for '이용약관' pop-up
    const [showPrivacyPopup, setShowPrivacyPopup] = useState(false); // State for '개인정보 수집' pop-up

    const navigate = useNavigate();
    const photoUrl = 'https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg';

    const isPasswordValid = (password) => {

        // 8글자 이상, 소문자, 숫자 포함 조건
        const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!isPasswordValid(password)) {
            setPasswordError('8-16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            
            const result = await signUpWithEmailandPassword(email, password, nickName, photoUrl);
            
            // 회원가입 성공
            if (result.success) {
                navigate('/welcome');
            
            // 회원가입 실패
            } else {
                setMessage(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-4">회원가입</h2>
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="nickName" className="block font-medium mb-1">닉네임</label>
                        <input
                            type="nickName"
                            id="nickName"
                            name="nickName"
                            className="w-full border rounded-md px-3 py-2"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            required
                        />
                    </div>
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
                    {message && <p className="text-red-500 text-sm mt-1">{message}</p>}
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
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block font-medium mb-1">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full border rounded-md px-3 py-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" required />
                            <span className="text-sm">
                                <span
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => setShowTermsPopup(true)} // '이용약관' 팝업 띄움
                                >
                                    이용약관
                                </span>
                                ,&nbsp;
                                <span
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => setShowPrivacyPopup(true)} // '개인정보 수집' 팝업 띄움
                                >
                                    개인정보 수집
                                </span>
                                에 동의합니다.
                            </span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:brightness-110"
                    >
                        회원가입
                    </button>
                </form>
            </div>

             {/* '이용약관' 팝업 */}
             {showTermsPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md w-96">
                        <h2 className="text-xl font-semibold mb-4">Shoppy 이용약관</h2>
                        <p className="mb-4">
                            Shoppy 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서 감사합니다. 본 약관은 다양한 Shoppy 서비스의 이용과 관련하여 Shoppy 서비스를 제공하는 Shoppy 주식회사(이하 ‘Shoppy’)와 이를 이용하는 Shoppy 서비스 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며, 아울러 여러분의 Shoppy 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.
                            <br /><br />
                            Shoppy 서비스를 이용하시거나 Shoppy 서비스 회원으로 가입하실 경우 여러분은 본 약관 및 관련 운영 정책을 확인하거나 동의하게 되므로, 잠시 시간을 내시어 주의 깊게 살펴봐 주시기 바랍니다.
                            <br /><br />
                            다양한 Shoppy 서비스를 즐겨보세요.
                        </p>
                        <button
                            onClick={() => setShowTermsPopup(false)}
                            className="w-full bg-red-500 text-white py-2 rounded-md hover:brightness-110"
                        > Close </button>
                    </div>
                </div>
            )}


            {/* '개인정보 수집' 팝업 */}
            {showPrivacyPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md w-96">
                        <h2 className="text-xl font-semibold mb-4">Shoppy 이용약관</h2>
                        <p className="mb-4">
                            개인정보보호법에 따라 Shoppy에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                            <br /><br />
                            <h2 className="text-xl font-semibold mb-4">수집하는 개인정보</h2>
                            이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 Shoppy 서비스를 회원과 동일하게 이용할 수 있습니다. 이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은 회원제 서비스를 이용하기 위해 회원가입을 할 경우, Shoppy는 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.
                        </p>
                        <button
                            onClick={() => setShowPrivacyPopup(false)}
                            className="w-full bg-red-500 text-white py-2 rounded-md hover:brightness-110"
                        > Close </button>
                    </div>
                </div>
            )}

        </div>
    );
}
