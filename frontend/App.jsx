import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import SmartSearch from './components/SmartSearch';
import CreateListing from './components/CreateListing';
import Dashboard from './components/Dashboard';
import CourseDetails from './components/CourseDetails';
import Classroom from './components/Classroom';
import Login from './components/Login';
import Signup from './components/Signup';
import { fetchCourses, createBooking } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
    const [view, setView] = useState('HOME');
    const [activeCourse, setActiveCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeClassroomBooking, setActiveClassroomBooking] = useState(null);

    const { user, loading: authLoading } = useAuth();

    // Fetch courses on mount and when user changes
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                // Filter out courses created by the current user
                const availableCourses = user
                    ? data.filter(course => course.trainer?._id !== user.id && course.trainer !== user.id)
                    : data;

                setCourses(availableCourses);
                setFilteredCourses(availableCourses);
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCourses();
    }, [user]);

    // Scroll to top on view change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const handleCourseClick = (course) => {
        setActiveCourse(course);
        setView('COURSE_DETAIL');
    };

    const handleBookCourse = async (bookingDetails) => {
        if (!user) {
            setView('LOGIN');
            return;
        }
        try {
            const newBooking = {
                course: bookingDetails.course_id,
                course_title: bookingDetails.course_title,
                date: bookingDetails.date,
                time: bookingDetails.time,
                status: 'CONFIRMED',
                type: bookingDetails.type,
                price_paid: bookingDetails.price_paid
            };

            await createBooking(newBooking);

            // Navigate to dashboard to see new booking
            setView('DASHBOARD');
        } catch (error) {
            alert("Failed to book course. Please try again.");
        }
    };

    const handleSaveListing = async () => {
        // Refresh courses
        const data = await fetchCourses();
        // Filter out courses created by the current user
        const availableCourses = user
            ? data.filter(course => course.trainer?._id !== user.id && course.trainer !== user.id)
            : data;

        setCourses(availableCourses);
        setFilteredCourses(availableCourses);
        setView('HOME');
        alert("Course published successfully!");
    };

    const handleJoinClass = (booking) => {
        setActiveClassroomBooking(booking);
        setView('CLASSROOM');
    };

    const renderContent = () => {
        if (authLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

        switch (view) {
            case 'HOME':
                return (
                    <>
                        {/* Hero Section */}
                        <div className="bg-white border-b border-slate-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                                    Learn skills. <span className="text-brand-600">Trade talents.</span> <br /> Grow together.
                                </h1>
                                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                                    Teach and Trade (TNT) connects you with local experts. Pay with cash or swap your own skills in a secure, community-driven marketplace.
                                </p>
                                <SmartSearch
                                    courses={courses}
                                    onResults={(results) => setFilteredCourses(results)}
                                    onReset={() => setFilteredCourses(courses)}
                                />
                            </div>
                        </div>

                        {/* Marketplace Grid */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {filteredCourses.length === courses.length ? 'Featured Courses' : `Search Results (${filteredCourses.length})`}
                                </h2>
                                {filteredCourses.length !== courses.length && (
                                    <button
                                        onClick={() => setFilteredCourses(courses)}
                                        className="text-brand-600 hover:text-brand-800 font-medium text-sm"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="text-center py-16">Loading courses...</div>
                            ) : filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredCourses.map(course => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            onClick={handleCourseClick}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-lg text-slate-500">No courses found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'LOGIN':
                return <Login onSwitchToSignup={() => setView('SIGNUP')} onLoginSuccess={() => setView('HOME')} />;

            case 'SIGNUP':
                return <Signup onSwitchToLogin={() => setView('LOGIN')} onSignupSuccess={() => setView('HOME')} />;

            case 'DASHBOARD':
                return user ? (
                    <Dashboard
                        user={user}
                        onJoinClass={handleJoinClass}
                    />
                ) : (
                    <Login onSwitchToSignup={() => setView('SIGNUP')} onLoginSuccess={() => setView('DASHBOARD')} />
                );

            case 'CREATE_LISTING':
                return user ? (
                    <CreateListing onBack={() => setView('HOME')} onSave={handleSaveListing} />
                ) : (
                    <Login onSwitchToSignup={() => setView('SIGNUP')} onLoginSuccess={() => setView('CREATE_LISTING')} />
                );

            case 'COURSE_DETAIL':
                return activeCourse ? (
                    <CourseDetails
                        course={activeCourse}
                        onBack={() => setView('HOME')}
                        onBook={handleBookCourse}
                    />
                ) : (
                    <div>Error: Course not found</div>
                );

            case 'CLASSROOM':
                if (!user) return <Login onSwitchToSignup={() => setView('SIGNUP')} onLoginSuccess={() => setView('CLASSROOM')} />;
                if (!activeClassroomBooking) return <div>Error: No class selected</div>;

                const courseForClass = activeClassroomBooking.course && typeof activeClassroomBooking.course === 'object'
                    ? activeClassroomBooking.course
                    : courses.find(c => c._id === activeClassroomBooking.course) || {
                        id: activeClassroomBooking.course,
                        title: activeClassroomBooking.course_title,
                        trainer_name: 'Trainer',
                        duration: '1 hour',
                        image_url: 'https://picsum.photos/seed/classroom/800/600'
                    };

                return (
                    <Classroom
                        course={courseForClass}
                        onEndClass={() => setView('DASHBOARD')}
                    />
                );

            default:
                return <div>404</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar user={user} setView={setView} currentView={view} />
            <main className="flex-grow">
                {renderContent()}
            </main>

            <footer className="bg-white border-t border-slate-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-slate-800 text-lg">Teach & Trade</span>
                        <p className="text-xs text-slate-500 mt-1">© 2024 TNT Platform. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-brand-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-brand-600 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
