import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get bookings for current user
router.get('/mine', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ learner: req.user.id })
            .populate('course', 'title image_url duration location')
            .populate('learner', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create booking
router.post('/', auth, async (req, res) => {
    const booking = new Booking({
        ...req.body,
        learner: req.user.id
    });
    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        console.error('Booking error:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// Get trainer stats (earnings)
router.get('/stats', auth, async (req, res) => {
    try {
        // 1. Find all courses created by this user
        const Course = (await import('../models/Course.js')).default;
        const courses = await Course.find({ trainer: req.user.id });
        const courseIds = courses.map(c => c._id);

        // 2. Find all bookings for these courses
        const bookings = await Booking.find({ course: { $in: courseIds } });

        // 3. Calculate total earnings
        const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.price_paid || 0), 0);

        // 4. Calculate monthly earnings for the chart
        const monthlyEarnings = bookings.reduce((acc, booking) => {
            const date = new Date(booking.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.name === month);
            if (existing) {
                existing.earnings += (booking.price_paid || 0);
            } else {
                acc.push({ name: month, earnings: (booking.price_paid || 0) });
            }
            return acc;
        }, []);

        // Sort months? (Optional, for now just return as is or simple sort)
        // A simple way is to initialize with last 6 months 0 and fill in.
        // For MVP, let's just return what we have.

        res.json({
            totalEarnings,
            monthlyEarnings,
            totalBookingsReceived: bookings.length
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
