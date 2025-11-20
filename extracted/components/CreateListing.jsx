import React, { useState } from 'react';
import { generateAiDescription } from '../services/geminiService';
import { createCourse } from '../services/api';
import { Wand2, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const CATEGORY_IMAGES = {
    'Technology': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'Music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    'Art': 'https://images.unsplash.com/photo-1460661611742-ad04cd7cea07?w=800&q=80',
    'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'Language': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    'Health': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    'Other': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
};

const CreateListing = ({ onBack, onSave }) => {
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Technology');
    const [isBarter, setIsBarter] = useState(false);
    const [barterSkills, setBarterSkills] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        if (!title || !skills) {
            alert("Please enter a title and some skills first.");
            return;
        }
        setIsGenerating(true);
        const desc = await generateAiDescription(title, skills);
        setDescription(desc);
        setIsGenerating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const newCourse = {
                title,
                description,
                category,
                price: Number(price),
                is_barter_enabled: isBarter,
                barter_skills_wanted: isBarter ? barterSkills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
                duration: 'Flexible',
                location: 'Online',
                rating: 0,
                reviews_count: 0,
                image_url: CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Other'],
                tags: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
            };

            await createCourse(newCourse);
            onSave();
        } catch (error) {
            alert("Failed to create course");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <button
                onClick={onBack}
                className="flex items-center text-slate-500 hover:text-brand-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" /> Back to Marketplace
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-bold text-slate-900">Create a New Listing</h2>
                    <p className="text-slate-500">Share your expertise with the world.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                placeholder="e.g., Advanced Pottery Workshop"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                >
                                    {Object.keys(CATEGORY_IMAGES).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Skills / Tags</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                    placeholder="e.g., Ceramics, Glazing"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !title}
                                    className="text-xs flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                    Generate with AI
                                </button>
                            </div>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                placeholder="Describe what students will learn..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-slate-500">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        placeholder="50"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col h-full justify-center pt-2">
                                <label className="flex items-center cursor-pointer gap-3 mb-3">
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isBarter}
                                            onChange={(e) => setIsBarter(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Open to Barter / Skill Swap</span>
                                </label>

                                {isBarter && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Skills you want in return</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="e.g. Photography, Spanish"
                                            value={barterSkills}
                                            onChange={(e) => setBarterSkills(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-75"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            Publish Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
