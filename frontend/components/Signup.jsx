import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'LEARNER',
        skills_offered: '',
        skills_wanted: ''
    });
    const { signup, error } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Process skills from comma-separated string to array
        const dataToSubmit = {
            ...formData,
            skills_offered: formData.skills_offered.split(',').map(s => s.trim()).filter(s => s),
            skills_wanted: formData.skills_wanted.split(',').map(s => s.trim()).filter(s => s)
        };

        const success = await signup(dataToSubmit);
        setIsSubmitting(false);
        if (success) {
            onSignupSuccess();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Join Teach & Trade</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="role">
                        I want to...
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="LEARNER">Learn Skills</option>
                        <option value="TRAINER">Teach Skills</option>
                    </select>
                </div>

                {formData.role === 'TRAINER' && (
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="skills_offered">
                            Skills you can teach (comma separated)
                        </label>
                        <input
                            type="text"
                            id="skills_offered"
                            name="skills_offered"
                            placeholder="e.g. Guitar, React, Spanish"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={formData.skills_offered}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="skills_wanted">
                        Skills you want to learn (comma separated)
                    </label>
                    <input
                        type="text"
                        id="skills_wanted"
                        name="skills_wanted"
                        placeholder="e.g. Cooking, Piano, SEO"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.skills_wanted}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white font-bold py-2 px-4 rounded hover:bg-brand-700 transition duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-slate-600 text-sm">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-brand-600 hover:text-brand-800 font-bold">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
