import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';
let token = '';
let bookingId = '';

async function login() {
    console.log('Logging in...');
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }) // Assuming this user exists from previous sessions or I should create one?
    });

    if (!response.ok) {
        // Try creating a user if login fails
        console.log('Login failed, trying to register...');
        const regResponse = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: 'test_reschedule@example.com', password: 'password123', role: 'learner' })
        });
        const regData = await regResponse.json();
        token = regData.token;
        console.log('Registered and logged in.');
    } else {
        const data = await response.json();
        token = data.token;
        console.log('Logged in.');
    }
}

async function createBooking() {
    console.log('Creating a booking...');
    // First need a course. Let's fetch one.
    const coursesRes = await fetch(`${API_URL}/courses`);
    const courses = await coursesRes.json();
    if (courses.length === 0) {
        console.error('No courses found to book.');
        return;
    }
    const course = courses[0];

    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            course: course._id,
            date: '2025-12-01',
            time: '10:00',
            price_paid: 100,
            status: 'CONFIRMED'
        })
    });
    const data = await response.json();
    bookingId = data._id;
    console.log('Booking created:', bookingId);
}

async function verifyReschedule() {
    console.log('Rescheduling booking...');
    const newDate = '2025-12-02';
    const newTime = '14:00';

    const response = await fetch(`${API_URL}/bookings/${bookingId}/reschedule`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: newDate, time: newTime })
    });

    if (!response.ok) {
        const err = await response.json();
        console.error('Reschedule failed:', err);
        return;
    }

    const updatedBooking = await response.json();
    console.log('Reschedule response:', updatedBooking);

    if (updatedBooking.date === newDate && updatedBooking.time === newTime) {
        console.log('SUCCESS: Booking rescheduled correctly.');
    } else {
        console.error('FAILURE: Booking details did not match.');
    }
}

async function run() {
    try {
        await login();
        if (!token) return;
        await createBooking();
        if (!bookingId) return;
        await verifyReschedule();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
