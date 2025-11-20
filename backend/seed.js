import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import User from './models/User.js';
import Booking from './models/Booking.js';

dotenv.config();

const CURRENT_USER = {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'TRAINER',
    avatar: 'https://picsum.photos/id/64/100/100',
    skills_offered: ['JavaScript', 'React', 'Guitar'],
    skills_wanted: ['Spanish', 'Cooking'],
    rating: 4.8,
};

const MOCK_COURSES = [
    {
        id: 'c1',
        trainer_id: 'u2',
        trainer_name: 'Sarah Chen',
        title: 'Advanced React Patterns & Performance',
        description: 'Master React hooks, context API, and performance optimization techniques in this intensive workshop.',
        category: 'Programming',
        price: 50,
        is_barter_enabled: true,
        barter_skills_wanted: ['Graphic Design', 'Photography'],
        duration: '4 weeks',
        location: 'Online',
        rating: 4.9,
        reviews_count: 124,
        image_url: 'https://picsum.photos/id/1/400/250',
        tags: ['React', 'Frontend', 'Web Dev'],
    },
    {
        id: 'c2',
        trainer_id: 'u3',
        trainer_name: 'Marcus Johnson',
        title: 'Urban Photography Essentials',
        description: 'Learn how to capture the soul of the city. We cover lighting, composition, and post-processing.',
        category: 'Photography',
        price: 35,
        is_barter_enabled: true,
        barter_skills_wanted: ['Web Development', 'SEO'],
        duration: '2 days (Weekend)',
        location: 'New York, NY',
        rating: 4.7,
        reviews_count: 89,
        image_url: 'https://picsum.photos/id/91/400/250',
        tags: ['Photography', 'Art', 'Creative'],
    },
    {
        id: 'c3',
        trainer_id: 'u4',
        trainer_name: 'Elena Rodriguez',
        title: 'Spanish for Beginners: Conversational',
        description: 'Get comfortable speaking Spanish in real-world situations. Focus on pronunciation and daily vocabulary.',
        category: 'Language',
        price: 25,
        is_barter_enabled: false,
        duration: '8 weeks',
        location: 'Online',
        rating: 4.8,
        reviews_count: 210,
        image_url: 'https://picsum.photos/id/142/400/250',
        tags: ['Spanish', 'Language', 'Culture'],
    },
    {
        id: 'c4',
        trainer_id: 'u5',
        trainer_name: 'Chef Gordon',
        title: 'Italian Pasta Making Masterclass',
        description: 'Hand-rolled pasta from scratch. Learn three classic shapes and two signature sauces.',
        category: 'Cooking',
        price: 75,
        is_barter_enabled: true,
        barter_skills_wanted: ['Guitar Lessons', 'Piano'],
        duration: '3 hours',
        location: 'Chicago, IL',
        rating: 5.0,
        reviews_count: 45,
        image_url: 'https://picsum.photos/id/292/400/250',
        tags: ['Cooking', 'Food', 'Italian'],
    },
    {
        id: 'c5',
        trainer_id: 'u1',
        trainer_name: 'Alex Rivera',
        title: 'Acoustic Guitar Basics',
        description: 'Start your musical journey. Learn chords, strumming patterns, and your first 5 songs.',
        category: 'Music',
        price: 30,
        is_barter_enabled: true,
        barter_skills_wanted: ['Spanish'],
        duration: '6 weeks',
        location: 'Online',
        rating: 4.6,
        reviews_count: 12,
        image_url: 'https://picsum.photos/id/145/400/250',
        tags: ['Music', 'Guitar', 'Instrument'],
    },
    {
        id: 'c6',
        trainer_id: 'u6',
        trainer_name: 'Priya Patel',
        title: 'Yoga for Mindfulness & Flexibility',
        description: 'A holistic approach to yoga focusing on breath work and gentle stretching for all levels.',
        category: 'Health',
        price: 20,
        is_barter_enabled: true,
        barter_skills_wanted: ['Marketing', 'Social Media'],
        duration: '1 hour sessions',
        location: 'Online',
        rating: 4.9,
        reviews_count: 330,
        image_url: 'https://picsum.photos/id/65/400/250',
        tags: ['Yoga', 'Wellness', 'Fitness'],
    },
];

const MOCK_BOOKINGS = [
    {
        id: 'b1',
        course_id: 'c2',
        course_title: 'Urban Photography Essentials',
        learner_id: 'u1',
        status: 'CONFIRMED',
        date: '2024-06-15',
        type: 'BARTER',
    },
    {
        id: 'b2',
        course_id: 'c3',
        course_title: 'Spanish for Beginners',
        learner_id: 'u1',
        status: 'COMPLETED',
        date: '2024-05-10',
        type: 'PAID',
        price_paid: 25,
    },
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tnt')
    .then(async () => {
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Course.deleteMany({});
        await Booking.deleteMany({});

        await User.create(CURRENT_USER);
        await Course.insertMany(MOCK_COURSES);
        await Booking.insertMany(MOCK_BOOKINGS);

        console.log('Database seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
