import React from 'react';
import { Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Star, MapPin } from 'lucide-react';

const TrainerProfile = ({ trainer, compact = false }) => {
    if (!trainer) return null;

    if (compact) {
        return (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start gap-4">
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-full border-2 border-brand-500"
                    />
                    <div className="flex-grow">
                        <h3 className="font-bold text-slate-900 text-lg">{trainer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium text-slate-700">{trainer.rating.toFixed(1)}</span>
                            </div>
                            {trainer.profile_completed && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                    Verified Profile
                                </span>
                            )}
                        </div>
                        {trainer.bio && (
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{trainer.bio}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
                <div className="flex items-start gap-4">
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold">{trainer.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                                <Star size={16} className="fill-white" />
                                <span className="font-medium">{trainer.rating.toFixed(1)}</span>
                            </div>
                            {trainer.profile_completed && (
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                                    ✓ Verified Profile
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Bio */}
                {trainer.bio && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">About</h3>
                        <p className="text-slate-600 leading-relaxed">{trainer.bio}</p>
                    </div>
                )}

                {/* Social Links */}
                {(trainer.linkedin_url || trainer.github_url || trainer.portfolio_url) && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Connect</h3>
                        <div className="flex flex-wrap gap-3">
                            {trainer.linkedin_url && (
                                <a
                                    href={trainer.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Linkedin size={18} />
                                    <span className="font-medium">LinkedIn</span>
                                </a>
                            )}
                            {trainer.github_url && (
                                <a
                                    href={trainer.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <Github size={18} />
                                    <span className="font-medium">GitHub</span>
                                </a>
                            )}
                            {trainer.portfolio_url && (
                                <a
                                    href={trainer.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors"
                                >
                                    <Globe size={18} />
                                    <span className="font-medium">Portfolio</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {trainer.skills_offered && trainer.skills_offered.length > 0 && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {trainer.skills_offered.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {trainer.certifications && trainer.certifications.length > 0 && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Award size={18} className="text-amber-600" />
                            Certifications
                        </h3>
                        <div className="space-y-3">
                            {trainer.certifications.map((cert, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Award size={16} className="text-amber-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-slate-900">{cert.title}</p>
                                        <p className="text-sm text-slate-600">{cert.issuer} • {cert.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {trainer.experience && trainer.experience.length > 0 && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-600" />
                            Experience
                        </h3>
                        <div className="space-y-4">
                            {trainer.experience.map((exp, index) => (
                                <div key={index} className="border-l-2 border-brand-500 pl-4">
                                    <h4 className="font-medium text-slate-900">{exp.title}</h4>
                                    <p className="text-sm text-slate-600">{exp.company} • {exp.duration}</p>
                                    {exp.description && (
                                        <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {trainer.education && trainer.education.length > 0 && (
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <GraduationCap size={18} className="text-purple-600" />
                            Education
                        </h3>
                        <div className="space-y-3">
                            {trainer.education.map((edu, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <GraduationCap size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-slate-900">{edu.degree}</p>
                                        <p className="text-sm text-slate-600">{edu.institution} • {edu.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerProfile;
