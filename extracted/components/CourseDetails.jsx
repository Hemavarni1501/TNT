import React, { useState } from 'react';
import { askCourseAssistant } from '../services/geminiService';
import { MapPin, Clock, ArrowLeft, Bot, Send, RefreshCw, Star, CreditCard, CheckCircle } from 'lucide-react';

const CourseDetails = ({ course, onBack, onBook }) => {
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: `Hi! I'm the AI assistant for ${course.trainer?.name || 'the trainer'}'s course. Do you have any questions about the curriculum or prerequisites?` }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Booking Modal State
    const [showModal, setShowModal] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [paymentMode, setPaymentMode] = useState('PAID');
    const [barterOffer, setBarterOffer] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        try {
            const response = await askCourseAssistant(userMsg, course);
            setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
        } catch (err) {
            // Error handled in service
        } finally {
            setIsTyping(false);
        }
    };

    const handleBookingSubmit = () => {
        // Simulate API call
        setBookingStep(3);
        setTimeout(() => {
            onBook({
                course_id: course._id,
                course_title: course.title,
                date: selectedDate,
                time: selectedTime,
                type: paymentMode,
                price_paid: paymentMode === 'PAID' ? course.price : 0,
                status: 'CONFIRMED'
            });
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 relative">
            <button onClick={onBack} className="mb-4 flex items-center text-slate-500 hover:text-brand-600 transition-colors">
                <ArrowLeft size={18} className="mr-1" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                        <div className="h-64 sm:h-80 relative">
                            <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                                <div className="flex items-center gap-4 text-white/90 text-sm">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{course.category}</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" /> {course.rating} ({course.reviews_count} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-xl font-bold text-slate-400">
                                        {course.trainer?.avatar ? (
                                            <img src={course.trainer.avatar} alt={course.trainer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            (course.trainer?.name || 'T').charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Trainer</p>
                                        <p className="font-semibold text-slate-900">{course.trainer?.name || 'Unknown Trainer'}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">About this course</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">{course.description}</p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {course.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">Logistics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <Clock className="text-brand-500" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Duration</p>
                                        <p className="text-slate-900 font-medium">{course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <MapPin className="text-brand-500" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
                                        <p className="text-slate-900 font-medium">{course.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Booking Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                        <div className="flex items-end gap-1 mb-6">
                            <span className="text-3xl font-bold text-slate-900">₹{course.price}</span>
                            <span className="text-slate-500 mb-1">/ course</span>
                        </div>

                        {course.is_barter_enabled && (
                            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                                    <RefreshCw size={16} />
                                    <span>Barter Available</span>
                                </div>
                                <p className="text-xs text-emerald-800 leading-snug">
                                    Trainer is interested in: <span className="font-medium">{course.barter_skills_wanted?.join(', ')}</span>.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all mb-3"
                        >
                            Book Now
                        </button>
                        <p className="text-center text-xs text-slate-400">Secure transaction via TNT Escrow</p>
                    </div>

                    {/* AI Chat Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-96">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center gap-2">
                            <Bot size={18} className="text-brand-600" />
                            <span className="font-semibold text-slate-700">Ask about this course</span>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4 space-y-3">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-brand-600 text-white rounded-br-none'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 px-3 py-2 rounded-lg rounded-bl-none">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                            <input
                                className="flex-grow px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                                placeholder="Type a question..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!chatInput.trim()}
                                className="p-2 bg-slate-900 text-white rounded-lg disabled:opacity-50 hover:bg-slate-800 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-900">
                                {bookingStep === 1 && 'Schedule Session'}
                                {bookingStep === 2 && 'Payment & Confirmation'}
                                {bookingStep === 3 && 'Booking Confirmed!'}
                            </h3>
                            {bookingStep < 3 && (
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {/* Step 1: Schedule */}
                            {bookingStep === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        disabled={!selectedDate || !selectedTime}
                                        onClick={() => setBookingStep(2)}
                                        className="w-full mt-4 py-3 bg-brand-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-brand-700 transition-colors"
                                    >
                                        Next: Payment Details
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Payment/Barter */}
                            {bookingStep === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={() => setPaymentMode('PAID')}
                                            className={`p-3 rounded-lg border text-center transition-all ${paymentMode === 'PAID' ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <CreditCard className="mx-auto mb-1" size={20} />
                                            Credit Card (₹{course.price})
                                        </button>
                                        {course.is_barter_enabled && (
                                            <button
                                                onClick={() => setPaymentMode('BARTER')}
                                                className={`p-3 rounded-lg border text-center transition-all ${paymentMode === 'BARTER' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                <RefreshCw className="mx-auto mb-1" size={20} />
                                                Propose Barter
                                            </button>
                                        )}
                                    </div>

                                    {paymentMode === 'PAID' ? (
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                                            <p className="text-sm text-slate-600 mb-2">Mock Payment Gateway</p>
                                            <div className="text-xs text-slate-400">Your card ending in 4242 will be charged.</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">What skill do you offer?</label>
                                            <textarea
                                                rows={3}
                                                placeholder="I can teach you basic Spanish..."
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
                                                value={barterOffer}
                                                onChange={(e) => setBarterOffer(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setBookingStep(1)}
                                            className="flex-1 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleBookingSubmit}
                                            className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors"
                                        >
                                            Confirm Booking
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Success */}
                            {bookingStep === 3 && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h4>
                                    <p className="text-slate-500 text-sm mb-6">
                                        You will receive a confirmation email shortly. Check your dashboard to join the class.
                                    </p>
                                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-xs text-slate-400 mt-2">Redirecting to dashboard...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
