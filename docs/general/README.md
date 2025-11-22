# Live Learn Hub - MongoDB Edition

A collaborative learning platform for teachers and students with MongoDB backend.

## 🚀 Quick Start

### Option 1: Use the Startup Script (Windows)
Double-click `start-dev.bat` to start both servers automatically.

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## 📋 Features

- ✅ User authentication (Teacher/Student roles)
- ✅ Rich text note editor with TipTap
- ✅ Interactive mind map creator
- ✅ Real-time data persistence with MongoDB
- ✅ JWT-based secure authentication
- ✅ RESTful API backend

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- TipTap (rich text editor)
- React Flow (mind maps)
- React Router

**Backend:**
- Express.js
- MongoDB (Atlas)
- JWT authentication
- bcrypt password hashing

## 📁 Project Structure

```
├── server/              # Express backend
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── db.ts          # MongoDB connection
├── src/                # React frontend
│   ├── components/    # UI components
│   ├── pages/         # Page components
│   └── lib/           # API clients & utilities
└── .env               # Environment variables
```

## 🔐 Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

**Backend (server/.env):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3001
```

## 📚 Documentation

- [MongoDB Setup Guide](./MONGODB_SETUP.md) - Detailed setup and architecture
- [Quick Start Guide](./QUICKSTART.md) - Step-by-step getting started

## 🔧 Available Scripts

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/verify` - Verify token

### Notes (Protected)
- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Mind Maps (Protected)
- `GET /api/mindmaps` - List all mind maps
- `GET /api/mindmaps/:id` - Get mind map by ID
- `POST /api/mindmaps` - Create mind map
- `PUT /api/mindmaps/:id` - Update mind map
- `DELETE /api/mindmaps/:id` - Delete mind map

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected API routes
- CORS enabled
- MongoDB credentials server-side only

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.
