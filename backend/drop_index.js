import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tnt');
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // List indexes to confirm
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the id_1 index
        if (indexes.find(idx => idx.name === 'id_1')) {
            await collection.dropIndex('id_1');
            console.log('Dropped index: id_1');
        } else {
            console.log('Index id_1 not found');
        }

        // Also check for bookings and courses just in case
        const bookings = mongoose.connection.collection('bookings');
        const bookingIndexes = await bookings.indexes();
        if (bookingIndexes.find(idx => idx.name === 'id_1')) {
            await bookings.dropIndex('id_1');
            console.log('Dropped index: id_1 from bookings');
        }

        const courses = mongoose.connection.collection('courses');
        const courseIndexes = await courses.indexes();
        if (courseIndexes.find(idx => idx.name === 'id_1')) {
            await courses.dropIndex('id_1');
            console.log('Dropped index: id_1 from courses');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropIndex();
