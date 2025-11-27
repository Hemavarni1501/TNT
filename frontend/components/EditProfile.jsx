import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Save } from 'lucide-react';
import { updateUserProfile, fetchCurrentUser } from '../services/api';

const EditProfile = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        bio: user.bio || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        portfolio_url: user.portfolio_url || '',
        skills_offered: user.skills_offered || [],
        certifications: user.certifications || [],
        experience: user.experience || [],
        education: user.education || []
    });
    const [newSkill, setNewSkill] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills_offered.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills_offered: [...prev.skills_offered, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills_offered: prev.skills_offered.filter(s => s !== skill)
        }));
    };

    const handleAddCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, { title: '', issuer: '', year: '' }]
        }));
    };

    const handleRemoveCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleCertificationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) =>
                i === index ? { ...cert, [field]: value } : cert
            )
        }));
    };

    const handleAddExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
        }));
    };

    const handleRemoveExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const handleAddEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', year: '' }]
        }));
    };

    const handleRemoveEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await updateUserProfile(formData);
            onUpdate(updatedUser);
            alert('Profile updated successfully!');
            onClose();
        } catch (error) {
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const profileCompletion = () => {
        let score = 0;
        if (formData.bio) score += 20;
        if (formData.skills_offered.length > 0) score += 20;
        if (formData.linkedin_url || formData.github_url || formData.portfolio_url) score += 20;
        if (formData.certifications.length > 0) score += 20;
        if (formData.experience.length > 0 || formData.education.length > 0) score += 20;
        return score;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-grow bg-slate-200 rounded-full h-2 w-48">
                                <div
                                    className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${profileCompletion()}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600">{profileCompletion()}% Complete</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">About You</label>
                        <textarea
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                            rows="4"
                            placeholder="Tell learners about yourself, your expertise, and teaching style..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    {/* Social Links */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Social Links</label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Linkedin size={20} className="text-blue-600" />
                                <input
                                    type="url"
                                    className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                    placeholder="LinkedIn profile URL"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Github size={20} className="text-slate-800" />
                                <input
                                    type="url"
                                    className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                    placeholder="GitHub profile URL"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={20} className="text-brand-600" />
                                <input
                                    type="url"
                                    className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                    placeholder="Portfolio/Website URL"
                                    value={formData.portfolio_url}
                                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Skills You Offer</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                                placeholder="Add a skill..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            />
                            <button
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills_offered.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm flex items-center gap-2"
                                >
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-brand-900">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Award size={18} className="text-amber-600" />
                                Certifications
                            </label>
                            <button
                                onClick={handleAddCertification}
                                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.certifications.map((cert, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                                    <button
                                        onClick={() => handleRemoveCertification(index)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Certification title"
                                            value={cert.title}
                                            onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Issuer"
                                            value={cert.issuer}
                                            onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Year"
                                            value={cert.year}
                                            onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Briefcase size={18} className="text-blue-600" />
                                Experience
                            </label>
                            <button
                                onClick={handleAddExperience}
                                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.experience.map((exp, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                                    <button
                                        onClick={() => handleRemoveExperience(index)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Job title"
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                placeholder="Company"
                                                value={exp.company}
                                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                placeholder="Duration (e.g., 2020-2022)"
                                                value={exp.duration}
                                                onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                            />
                                        </div>
                                        <textarea
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
                                            rows="2"
                                            placeholder="Description"
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <GraduationCap size={18} className="text-purple-600" />
                                Education
                            </label>
                            <button
                                onClick={handleAddEducation}
                                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.education.map((edu, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                                    <button
                                        onClick={() => handleRemoveEducation(index)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Degree"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Institution"
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            placeholder="Year"
                                            value={edu.year}
                                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
