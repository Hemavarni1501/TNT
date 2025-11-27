import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Layout, Wand2, Loader2, Send, Clock } from 'lucide-react';
import { generateLessonPlan } from '../services/geminiService';

const Classroom = ({ course, onEndClass }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [lessonPlan, setLessonPlan] = useState('');
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [showPlan, setShowPlan] = useState(true);

    const videoRef = useRef(null);

    useEffect(() => {
        // Request camera permission and show self view
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        startVideo();

        return () => {
            // Cleanup tracks
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleGeneratePlan = async () => {
        setIsLoadingPlan(true);
        const plan = await generateLessonPlan(course.title, course.duration);
        setLessonPlan(plan);
        setIsLoadingPlan(false);
    };

    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [timeToStart, setTimeToStart] = useState('');

    // Check if class is scheduled for future
    useEffect(() => {
        // Mock check - in real app, compare current time with booking time
        // For demo, we'll assume if it's "CONFIRMED" and we just joined, it's valid.
        // But let's simulate a waiting room if the user wants to test it.
        // We can add a "Simulate Waiting Room" button or just logic.
        // Let's keep it simple: if course.title includes "Future", we wait.
        if (course.title.includes("Future")) {
            setIsWaiting(true);
            setTimeToStart("10:00");
        }
    }, [course]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'Me',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, newMessage]);
        setChatInput('');

        // Simulate reply
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: course.trainer_name,
                text: "That's a great question! Let me demonstrate.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2000);
    };

    if (isWaiting) {
        return (
            <div className="h-[calc(100vh-64px)] bg-slate-900 flex items-center justify-center">
                <div className="text-center text-white p-8 max-w-md">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Clock size={40} className="text-brand-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Class hasn't started yet</h2>
                    <p className="text-slate-400 mb-8">Your session with {course.trainer_name} is scheduled to begin in {timeToStart}.</p>
                    <button
                        onClick={onEndClass}
                        className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Leave Waiting Room
                    </button>
                    <button
                        onClick={() => setIsWaiting(false)}
                        className="block mt-4 text-xs text-slate-600 hover:text-slate-400 mx-auto"
                    >
                        (Dev: Skip Wait)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-slate-900 flex">
            {/* Main Video Area */}
            <div className="flex-grow relative flex flex-col">

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                    <div className="pointer-events-auto">
                        <h2 className="text-white font-bold text-lg">{course.title}</h2>
                        <span className="text-slate-300 text-sm bg-slate-800/50 px-2 py-0.5 rounded">{course.duration} Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-white text-xs font-mono">REC</span>
                    </div>
                </div>

                {/* Remote Video (Simulated) */}
                <div className="flex-grow bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    <img
                        src={course.image_url}
                        alt="Remote Stream"
                        className="w-full h-full object-cover opacity-50 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-brand-500 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white border-4 border-slate-900">
                                {course.trainer_name.charAt(0)}
                            </div>
                            <p className="text-white font-medium text-xl">{course.trainer_name}</p>
                            <p className="text-slate-400 text-sm">Connecting...</p>
                        </div>
                    </div>
                </div>

                {/* Self Video (PIP) */}
                <div className="absolute bottom-24 right-6 w-48 h-36 bg-black rounded-lg border-2 border-slate-700 overflow-hidden shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <VideoOff className="text-slate-500" />
                        </div>
                    )}
                </div>

                {/* Controls Bar */}
                <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 sm:gap-6 px-4">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3 sm:p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-3 sm:p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>

                    <button
                        onClick={onEndClass}
                        className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all"
                    >
                        <PhoneOff size={20} />
                        <span className="hidden sm:inline">End Class</span>
                    </button>

                    <button
                        onClick={() => { setShowPlan(!showPlan); setShowChat(false); }}
                        className={`p-3 sm:p-4 rounded-full transition-all ${showPlan ? 'bg-brand-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                        title="Lesson Plan"
                    >
                        <Layout size={20} />
                    </button>

                    <button
                        onClick={() => { setShowChat(!showChat); setShowPlan(false); }}
                        className={`p-3 sm:p-4 rounded-full transition-all ${showChat ? 'bg-brand-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                        title="Chat"
                    >
                        <MessageSquare size={20} />
                    </button>
                </div>
            </div>

            {/* Side Panel (AI Assistant or Chat) */}
            {(showPlan || showChat) && (
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out absolute inset-y-0 right-0 z-20 sm:relative">

                    {/* Lesson Plan Panel */}
                    {showPlan && (
                        <>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Wand2 size={16} className="text-brand-600" />
                                    AI Lesson Plan
                                </h3>
                                <button onClick={() => setShowPlan(false)} className="sm:hidden text-slate-400">✕</button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-4">
                                {!lessonPlan ? (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 text-sm mb-4">No lesson plan active.</p>
                                        <button
                                            onClick={handleGeneratePlan}
                                            disabled={isLoadingPlan}
                                            className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            {isLoadingPlan ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                            Generate Plan
                                        </button>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm prose-slate">
                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                            {lessonPlan}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <div className="text-xs text-slate-500 text-center">
                                    Generated by Gemini AI based on course details.
                                </div>
                            </div>
                        </>
                    )}

                    {/* Chat Panel */}
                    {showChat && (
                        <>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-brand-600" />
                                    Class Chat
                                </h3>
                                <button onClick={() => setShowChat(false)} className="sm:hidden text-slate-400">✕</button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 text-sm">
                                        No messages yet. Say hello!
                                    </div>
                                ) : (
                                    chatMessages.map(msg => (
                                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.sender === 'Me'
                                                ? 'bg-brand-600 text-white rounded-br-none'
                                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1">{msg.sender} • {msg.time}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                                <input
                                    className="flex-grow px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    placeholder="Type a message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim()}
                                    className="p-2 bg-brand-600 text-white rounded-lg disabled:opacity-50 hover:bg-brand-700 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Classroom;
