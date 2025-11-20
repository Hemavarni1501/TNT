import React, { useState } from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { findSmartMatches } from '../services/geminiService';

const SmartSearch = ({ courses, onResults, onReset }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            onReset();
            return;
        }

        setIsSearching(true);
        try {
            const matchedIds = await findSmartMatches(query, courses);
            if (matchedIds.length === 0) {
                // Fallback to basic filter if AI returns nothing or fails
                const lowerQ = query.toLowerCase();
                const basicMatches = courses.filter(c =>
                    c.title.toLowerCase().includes(lowerQ) ||
                    c.description.toLowerCase().includes(lowerQ) ||
                    c.tags.some(t => t.toLowerCase().includes(lowerQ))
                );
                onResults(basicMatches);
            } else {
                // Preserve order of matchedIds for relevance
                const results = matchedIds
                    .map(id => courses.find(c => c._id === id || c.id === id))
                    .filter((c) => !!c);
                onResults(results);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-brand-500 to-teal-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200 ${isSearching ? 'opacity-75' : ''}`}></div>
                <div className="relative flex items-center bg-white rounded-lg shadow-sm border border-slate-200">
                    <div className="pl-4 text-slate-400">
                        {isSearching ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Sparkles className="text-brand-500" size={20} />
                        )}
                    </div>
                    <input
                        type="text"
                        className="w-full py-4 px-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                        placeholder='Try "I want to learn Guitar in exchange for Spanish lessons"...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="mr-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium text-sm transition-colors flex items-center gap-2"
                        disabled={isSearching}
                    >
                        Search
                    </button>
                </div>
            </form>
            <div className="text-center mt-2">
                <p className="text-xs text-slate-500">Powered by Gemini AI • Matches skills & barter opportunities</p>
            </div>
        </div>
    );
};

export default SmartSearch;
