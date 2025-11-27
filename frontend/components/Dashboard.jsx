import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle, DollarSign, TrendingUp, Video, Edit } from 'lucide-react';
import { fetchUserBookings, fetchDashboardStats, rescheduleBooking } from '../services/api';
import EditProfile from './EditProfile';

const Dashboard = ({ user, onJoinClass }) => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalEarnings: 0, monthlyEarnings: [], totalBookingsReceived: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);

    // Chart data...
    const chartData = stats.monthlyEarnings.length > 0 ? stats.monthlyEarnings : [
        { name: 'Jan', earnings: 0 },
        { name: 'Feb', earnings: 0 },
        { name: 'Mar', earnings: 0 },
        { name: 'Apr', earnings: 0 },
        { name: 'May', earnings: 0 },
        { name: 'Jun', earnings: 0 },
    ];

    const [rescheduleModal, setRescheduleModal] = useState({ show: false, booking: null });
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    // Load bookings and stats on mount
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const [bookingsData, statsData] = await Promise.all([
                    fetchUserBookings(),
                    fetchDashboardStats()
                ]);
                setBookings(bookingsData);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const handleRescheduleClick = (booking) => {
        setRescheduleModal({ show: true, booking });
        setNewDate(booking.date);
        setNewTime(booking.time);
    };

    const handleRescheduleSubmit = async () => {
        if (!rescheduleModal.booking) return;
        try {
            await rescheduleBooking(rescheduleModal.booking._id, { date: newDate, time: newTime });
            // Update local state
            setBookings(prev => prev.map(b =>
                b._id === rescheduleModal.booking._id ? { ...b, date: newDate, time: newTime } : b
            ));
            setRescheduleModal({ show: false, booking: null });
            alert("Booking rescheduled successfully!");
        } catch (error) {
            alert("Failed to reschedule: " + error.message);
        }
    };

    const handleProfileUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name}</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your learning journey.</p>
                </div>
                {currentUser.role === 'TRAINER' && (
                    <button
                        onClick={() => setShowEditProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        <Edit size={18} />
                        <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Earnings</p>
                        <p className="text-2xl font-bold text-slate-900">₹{stats.totalEarnings}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Upcoming Sessions</p>
                        <p className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.status === 'CONFIRMED').length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Completed Courses</p>
                        <p className="text-2xl font-bold text-slate-900">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={20} className="text-slate-400" />
                            Earnings Overview
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Bookings */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-slate-500 text-sm text-center py-8">Loading bookings...</p>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 text-sm">{booking.course_title}</span>
                                            <span className="text-xs text-slate-500">
                                                {booking.date} {booking.time ? `• ${booking.time}` : ''}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full 
                        ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                                    booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {booking.status === 'CONFIRMED' && (
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => onJoinClass(booking)}
                                                className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded transition-colors"
                                            >
                                                <Video size={14} />
                                                Join
                                            </button>
                                            <button
                                                onClick={() => handleRescheduleClick(booking)}
                                                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded transition-colors"
                                            >
                                                Reschedule
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-8">No bookings yet.</p>
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-lg transition-colors">
                        View All History
                    </button>
                </div>
            </div>

            {/* Reschedule Modal */}
            {rescheduleModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Reschedule Session</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Time</label>
                                <input
                                    type="time"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setRescheduleModal({ show: false, booking: null })}
                                    className="flex-1 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRescheduleSubmit}
                                    className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <EditProfile
                    user={currentUser}
                    onClose={() => setShowEditProfile(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
};

export default Dashboard;
