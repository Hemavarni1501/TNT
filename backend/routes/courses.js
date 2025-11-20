import express from 'express';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('trainer', 'name avatar rating');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('trainer', 'name avatar rating');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Create course
router.post('/', auth, async (req, res) => {
    const course = new Course({
        ...req.body,
        trainer: req.user.id
    });
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
