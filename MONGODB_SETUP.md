# MongoDB Setup with Express Backend

This project has been configured to use MongoDB with a proper Express backend API.

## Project Structure

```
├── server/                 # Backend API
│   ├── .env               # Server environment variables
│   ├── index.ts           # Express server entry point
│   ├── db.ts              # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts        # JWT authentication middleware
│   └── routes/
│       ├── auth.ts        # Authentication routes
│       ├── notes.ts       # Notes CRUD routes
│       └── mindmaps.ts    # Mind maps CRUD routes
├── src/                   # Frontend React app
│   └── lib/
│       ├── api.ts         # API client for auth
│       └── services.ts    # API client for data operations
└── .env                   # Frontend environment variables
```

## Configuration

### Backend (.env in server/)
```
MONGODB_URI=mongodb+srv://elsonyt25_db_user:Myy9YBE9SSMirLzA@cluster0.o37zici.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

### Frontend (.env in root)
```
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### 1. Start the Backend Server

In one terminal:
```bash
npm run server
```

The backend will run on http://localhost:3001

### 2. Start the Frontend

In another terminal:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with email/password
- `GET /api/auth/verify` - Verify JWT token

### Notes (requires authentication)
- `GET /api/notes` - Get all notes for current user
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Mind Maps (requires authentication)
- `GET /api/mindmaps` - Get all mind maps for current user
- `GET /api/mindmaps/:id` - Get specific mind map
- `POST /api/mindmaps` - Create new mind map
- `PUT /api/mindmaps/:id` - Update mind map
- `DELETE /api/mindmaps/:id` - Delete mind map

## Database Structure

Database name: `live-learn-hub`

### Collections

#### users
- `_id`: ObjectId
- `email`: string (unique)
- `password`: string (bcrypt hashed)
- `name`: string
- `role`: "TEACHER" | "STUDENT"
- `createdAt`: Date

#### notes
- `_id`: ObjectId
- `user_id`: string (references users._id)
- `title`: string
- `content`: string (JSON stringified TipTap content)
- `created_at`: Date
- `updated_at`: Date

#### mind_maps
- `_id`: ObjectId
- `user_id`: string (references users._id)
- `title`: string
- `nodes`: array
- `edges`: array
- `created_at`: Date
- `updated_at`: Date

## Security Features

✅ JWT-based authentication
✅ Password hashing with bcrypt
✅ Protected API routes with middleware
✅ CORS enabled for frontend-backend communication
✅ MongoDB credentials stored server-side only

## Production Deployment

For production, remember to:
1. Change JWT_SECRET to a strong random value
2. Update CORS settings to allow only your frontend domain
3. Enable HTTPS
4. Add rate limiting
5. Implement input validation
6. Add logging and monitoring
7. Set up proper error handling
8. Use environment-specific configurations
