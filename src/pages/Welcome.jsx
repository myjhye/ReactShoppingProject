import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import Button from '../components/ui/Button';

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Store!</h1>
            <p className="text-lg mb-4">회원가입을 환영합니다.</p>
            <Link
                to="/"
            >
                <Button text={'홈으로 가기'} />
            </Link>
        </div>
    );
}
