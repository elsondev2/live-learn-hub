import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import mindMapsRoutes from './routes/mindmaps.js';
import audioRoutes from './routes/audio.js';
import usersRoutes from './routes/users.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = config.port;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload limit for audio files
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Make io accessible to routes
app.set('io', io);

import chatRoutes from './routes/chat.js';
import callsRoutes from './routes/calls.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/mindmaps', mindMapsRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', chatRoutes);
app.use('/api/calls', callsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user's personal room
  socket.on('join_user_room', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined personal room`);
  });

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, userId, userName, isTyping }) => {
    socket.to(`conversation:${conversationId}`).emit('user_typing', {
      userId,
      userName,
      isTyping,
    });
  });

  // WebRTC signaling
  socket.on('call_offer', ({ callId, targetUserId, offer }) => {
    io.to(`user:${targetUserId}`).emit('call_offer', {
      callId,
      offer,
    });
  });

  socket.on('call_answer', ({ callId, targetUserId, answer }) => {
    io.to(`user:${targetUserId}`).emit('call_answer', {
      callId,
      answer,
    });
  });

  socket.on('ice_candidate', ({ callId, targetUserId, candidate }) => {
    io.to(`user:${targetUserId}`).emit('ice_candidate', {
      callId,
      candidate,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Socket.io enabled for real-time updates');
});

// Export io for use in routes
export { io };
