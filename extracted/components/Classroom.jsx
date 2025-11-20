import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Layout, Wand2, Loader2 } from 'lucide-react';
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

    return (
        <div className="h-[calc(100vh-64px)] bg-slate-900 flex">
            {/* Main Video Area */}
            <div className="flex-grow relative flex flex-col">

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent">
                    <div>
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
                <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <button
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>

                    <button
                        onClick={onEndClass}
                        className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all"
                    >
                        <PhoneOff size={20} />
                        <span>End Class</span>
                    </button>

                    <button
                        onClick={() => setShowPlan(!showPlan)}
                        className={`p-4 rounded-full transition-all ${showPlan ? 'bg-brand-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        <Layout size={20} />
                    </button>
                </div>
            </div>

            {/* Side Panel (AI Assistant) */}
            {showPlan && (
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Wand2 size={16} className="text-brand-600" />
                            AI Lesson Plan
                        </h3>
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
                </div>
            )}
        </div>
    );
};

export default Classroom;
