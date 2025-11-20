# 🎓 Teach & Trade (TNT)

A modern skill-sharing marketplace built with the MERN stack, enabling users to teach their skills, learn from others, and exchange knowledge through both monetary payments and skill bartering.

## ✨ Features

### 🔐 User Authentication
- Secure signup and login with JWT authentication
- Role-based access (Trainer/Learner)
- Password encryption with bcrypt

### 📚 Course Management
- Create and publish courses with AI-generated descriptions
- Category-based course organization with relevant images
- Auto-tagging system for better discoverability
- Rich course details with trainer profiles

### 💰 Flexible Payment Options
- Traditional payment system
- **Barter System** - Exchange skills instead of money
- Specify skills wanted in return for your courses
- Transparent pricing in Indian Rupees (₹)

### 🤖 AI-Powered Features
- **Smart Search** - Natural language course search powered by Google Gemini AI
- **AI Course Assistant** - Interactive chatbot to answer course-related questions
- **Auto Description Generator** - Create compelling course descriptions instantly
- **Lesson Plan Generator** - AI-generated structured lesson plans

### 📊 Trainer Dashboard
- Real-time earnings tracking
- Monthly revenue charts
- Booking management
- Session scheduling

### 🎯 Smart Filtering
- Personalized course recommendations
- Hide your own courses from marketplace view
- Category-based filtering
- Search with AI fallback

### 💬 Interactive Learning
- Virtual classroom environment
- Real-time video conferencing integration
- Chat functionality
- Session recordings

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Google Generative AI** - AI integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
TNT/
├── backend/                 # Backend API
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Booking.js
│   ├── routes/             # API routes
│   │   ├── users.js
│   │   ├── courses.js
│   │   └── bookings.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── server.js           # Entry point
│   └── package.json
│
└── extracted/              # Frontend React app
    ├── components/         # React components
    │   ├── Navbar.jsx
    │   ├── Dashboard.jsx
    │   ├── CourseCard.jsx
    │   ├── CourseDetails.jsx
    │   ├── CreateListing.jsx
    │   ├── Classroom.jsx
    │   ├── Login.jsx
    │   └── Signup.jsx
    ├── context/            # React context
    │   └── AuthContext.jsx
    ├── services/           # API services
    │   ├── api.js
    │   └── geminiService.js
    ├── App.jsx             # Main app component
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hemavarni1501/TNT.git
   cd TNT
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tnt
   JWT_SECRET=your_secure_jwt_secret_key_here
   ```

3. **Frontend Setup**
   ```bash
   cd ../extracted
   npm install
   ```

   Create a `.env` file in the `extracted` directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the Application**

   In one terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (Frontend):
   ```bash
   cd extracted
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/tnt` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | `your_api_key` |

## 📝 API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (protected)

### Bookings
- `GET /api/bookings/mine` - Get user's bookings (protected)
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings/stats` - Get trainer statistics (protected)

## 🎨 Key Features Explained

### 1. AI-Powered Search
The smart search uses Google Gemini AI to understand natural language queries like "I want to learn Guitar in exchange for Spanish lessons" and matches them with relevant courses.

### 2. Barter System
Trainers can enable barter for their courses and specify what skills they're interested in learning. Learners can propose skill exchanges instead of monetary payment.

### 3. Dynamic Dashboard
Trainers see real-time earnings, monthly revenue charts, upcoming sessions, and completed courses - all pulled from actual database records.

### 4. Category-Based Images
When creating a course, selecting a category automatically assigns a high-quality, relevant image from Unsplash.

### 5. Course Filtering
Users don't see their own courses in the marketplace, creating a cleaner, more relevant browsing experience.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- Secure token storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

**Hemavarni**
- GitHub: [@Hemavarni1501](https://github.com/Hemavarni1501)

## 🙏 Acknowledgments

- Google Gemini AI for powering intelligent features
- Unsplash for high-quality course images
- The MERN stack community

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

**Built with ❤️ using the MERN Stack**