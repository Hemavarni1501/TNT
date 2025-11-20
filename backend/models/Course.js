import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    price: Number,
    is_barter_enabled: { type: Boolean, default: false },
    barter_skills_wanted: [String],
    duration: String,
    location: String,
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    image_url: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
