# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account (already configured)

## Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
Open a terminal and run:
```bash
npm run server
```

You should see: `Server running on http://localhost:3001`

### 3. Start the Frontend
Open a **second terminal** and run:
```bash
npm run dev
```

You should see the Vite dev server running on `http://localhost:5173`

### 4. Open the App
Open your browser and go to: **http://localhost:5173**

## First Time Use

1. Click "Sign Up" to create an account
2. Choose your role (Teacher or Student)
3. Fill in your details and create an account
4. You'll be automatically logged in and redirected to the dashboard

## Troubleshooting

### Backend won't start
- Make sure `server/.env` exists with the MongoDB connection string
- Check if port 3001 is available

### Frontend can't connect to backend
- Make sure the backend is running on port 3001
- Check `.env` has `VITE_API_URL=http://localhost:3001/api`

### MongoDB connection errors
- Verify your IP address is whitelisted in MongoDB Atlas
- Check the connection string is correct in `server/.env`

## What's Working

✅ User authentication (signup/signin)
✅ Notes creation and editing
✅ Mind maps creation and editing
✅ Role-based access (Teacher/Student)

## Development

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:5173
- API endpoints: http://localhost:3001/api/*

Both servers support hot reload - changes will automatically refresh!
