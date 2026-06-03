# StylePulse AI - Node.js Backend

Production-ready Express.js backend for the AI Fashion Recommendation System.

## Features
- **User Authentication**: JWT-based login and registration.
- **Fashion Recommendations**: API for uploading images and receiving AI-powered style picks.
- **Image Uploads**: Secure image handling via Multer.
- **Database**: MongoDB Atlas integration with Mongoose.
- **Security**: Helmet, CORS, and Bcrypt password hashing.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Multer (File Uploads)
- Morgan & Winston (Logging)

## Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Running the Server
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user

### Uploads
- `POST /api/upload` - Upload fashion image (Protected)

### Recommendations
- `POST /api/recommendations/recommend` - Get style picks (Protected)
- `GET /api/recommendations/favorites` - Get saved items (Protected)
- `POST /api/recommendations/favorites` - Add item to favorites (Protected)

## Project Structure
```
src/
├── config/       # Database connection
├── controllers/  # Route handlers
├── middleware/   # JWT, Error, Upload middleware
├── models/       # Mongoose schemas
├── routes/       # API route definitions
├── services/     # Business logic & AI orchestration
├── utils/        # Helpers
├── app.js        # Express app configuration
└── server.js     # Entry point
```
