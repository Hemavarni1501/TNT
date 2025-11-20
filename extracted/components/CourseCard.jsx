import React from 'react';
import { MapPin, Star, RefreshCw, Clock } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
    return (
        <div
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => onClick(course)}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-slate-800 shadow-sm">
                    {course.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {course.title}
                    </h3>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="font-medium text-slate-700">{course.rating}</span>
                        <span>({course.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{course.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                            {/* Ideally a real avatar url here if available on course object, using a placeholder */}
                            <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold">
                                {course.trainer?.avatar ? (
                                    <img src={course.trainer.avatar} alt={course.trainer.name} className="w-full h-full object-cover" />
                                ) : (
                                    (course.trainer?.name || 'T').charAt(0)
                                )}
                            </div>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{course.trainer?.name || 'Unknown Trainer'}</span>
                    </div>

                    <div className="text-right">
                        {course.is_barter_enabled ? (
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-slate-900">₹{course.price}</span>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <RefreshCw size={10} />
                                    Barter Available
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-slate-900">₹{course.price}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
