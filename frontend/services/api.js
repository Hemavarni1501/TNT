const API_URL = '/api';

// Helper to get auth headers
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }
    return response.json();
};

export const fetchCurrentUser = async () => {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
};

export const fetchCourses = async () => {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
};

export const fetchCourseById = async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
};

export const createCourse = async (courseData) => {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
};

export const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
};

export const fetchUserBookings = async () => {
    const response = await fetch(`${API_URL}/bookings/mine`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
};

export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
};

export const rescheduleBooking = async (bookingId, newDetails) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(newDetails),
    });
    if (!response.ok) throw new Error('Failed to reschedule booking');
    return response.json();
};

export const updateUserProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};
