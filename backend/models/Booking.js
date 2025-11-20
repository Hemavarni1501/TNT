import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    course_title: String, // Keep for snapshotting in case course is deleted/changed
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    date: String,
    time: String,
    type: { type: String, enum: ['PAID', 'BARTER', 'FREE'], default: 'PAID' },
    price_paid: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
