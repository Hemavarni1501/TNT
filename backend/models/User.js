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
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
