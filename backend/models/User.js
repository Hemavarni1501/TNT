import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['LEARNER', 'TRAINER', 'ADMIN'], default: 'LEARNER' },
    avatar: String,
    skills_offered: [String],
    skills_wanted: [String],
    rating: { type: Number, default: 0 },

    // Profile fields
    bio: { type: String, default: '' },
    linkedin_url: String,
    github_url: String,
    portfolio_url: String,
    certifications: [{
        title: String,
        issuer: String,
        year: String
    }],
    experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        institution: String,
        year: String
    }],
    profile_completed: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
