import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToSignup, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await login(email, password);
        setIsSubmitting(false);
        if (success) {
            onLoginSuccess();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Login to TNT</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white font-bold py-2 px-4 rounded hover:bg-brand-700 transition duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-slate-600 text-sm">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="text-brand-600 hover:text-brand-800 font-bold">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
