import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ user, setView, currentView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        setView('HOME');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView('HOME')}>
                            <span className="text-2xl font-extrabold text-brand-600 tracking-tight">TNT</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <button
                                onClick={() => setView('HOME')}
                                className={`${currentView === 'HOME' ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                            >
                                Explore
                            </button>
                            <button
                                onClick={() => setView('CREATE_LISTING')}
                                className={`${currentView === 'CREATE_LISTING' ? 'border-brand-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                            >
                                Teach
                            </button>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="ml-3 relative flex items-center space-x-4">
                                <button
                                    onClick={() => setView('DASHBOARD')}
                                    className="text-slate-500 hover:text-slate-700 font-medium text-sm"
                                >
                                    Dashboard
                                </button>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                    <img
                                        className="h-8 w-8 rounded-full border border-slate-200"
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                        alt={user.name}
                                    />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-slate-500 hover:text-red-600 ml-4"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setView('LOGIN')}
                                    className="text-slate-500 hover:text-slate-900 font-medium text-sm"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => setView('SIGNUP')}
                                    className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-white border-b border-slate-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <button
                            onClick={() => { setView('HOME'); setIsMenuOpen(false); }}
                            className={`${currentView === 'HOME' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => { setView('CREATE_LISTING'); setIsMenuOpen(false); }}
                            className={`${currentView === 'CREATE_LISTING' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                        >
                            Teach
                        </button>
                        {user && (
                            <button
                                onClick={() => { setView('DASHBOARD'); setIsMenuOpen(false); }}
                                className={`${currentView === 'DASHBOARD' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-slate-200">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                        alt={user.name}
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-slate-800">{user.name}</div>
                                    <div className="text-sm font-medium text-slate-500">{user.email}</div>
                                </div>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="ml-auto text-sm text-red-600 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 space-y-2">
                                <button
                                    onClick={() => { setView('LOGIN'); setIsMenuOpen(false); }}
                                    className="block w-full text-center px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => { setView('SIGNUP'); setIsMenuOpen(false); }}
                                    className="block w-full text-center px-4 py-2 bg-brand-600 border border-transparent rounded-md text-white font-medium hover:bg-brand-700"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
