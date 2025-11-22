# Real-Time Chat & Communication System

## Overview

A comprehensive real-time chat and communication system with direct messaging, group discussions, and audio/video calling capabilities.

## Features

### 1. **Direct Messaging**
- One-on-one conversations between users
- Real-time message delivery
- Read receipts
- Typing indicators
- File and image sharing

### 2. **Group Discussions/Communities**
- Create group chats with multiple participants
- Group naming and descriptions
- Add/remove participants (admin controls)
- Group avatars

### 3. **Audio & Video Calls**
- WebRTC-based peer-to-peer calls
- Audio-only or video calls
- In-call controls (mute, video toggle)
- Call duration tracking
- Multi-participant support

### 4. **Role-Based Permissions**
- **Teachers**: Can chat with anyone (teachers and students)
- **Students**: Can only chat with other students
- Enforced on both frontend and backend

### 5. **Real-Time Features**
- Instant message delivery via Socket.io
- Live typing indicators
- Online presence
- Call notifications

## User Interface

### Chat Page (`/chat`)
- **Left Panel**: Conversation list with search
- **Right Panel**: Active chat interface
- **Mobile Responsive**: Adaptive layout for mobile devices

### Community Page (`/users`)
- Browse all users (filtered by role permissions)
- **Chat Button**: Start direct conversation with any user
- **View Profile**: See user bio and details
- Role badges (Teacher/Student)

### Chat Interface Components
- Message bubbles with timestamps
- File attachments with preview
- Reply to messages
- Call buttons (audio/video)
- Conversation settings

## Technical Architecture

### Frontend Stack
- **React** with TypeScript
- **Socket.io Client** for real-time communication
- **WebRTC** for peer-to-peer calls
- **Supabase** for real-time subscriptions (typing indicators)
- **Radix UI** components

### Backend Stack
- **Express.js** server
- **Socket.io** for WebSocket connections
- **MongoDB** for data persistence
- **JWT** authentication

### Data Models

#### Conversation
```typescript
{
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  avatar?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isArchived?: boolean;
}
```

#### Message
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  readBy: string[];
  replyTo?: string;
}
```

#### CallSession
```typescript
{
  id: string;
  conversationId: string;
  type: 'audio' | 'video';
  initiatorId: string;
  participants: CallParticipant[];
  status: 'ringing' | 'active' | 'ended';
  startedAt?: string;
  endedAt?: string;
}
```

## API Endpoints

### Chat Endpoints
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message
- `POST /api/conversations/:id/read` - Mark as read
- `POST /api/conversations/:id/participants` - Add participants
- `DELETE /api/conversations/:id/participants/:userId` - Remove participant

### Call Endpoints
- `POST /api/calls/initiate` - Start a call
- `POST /api/calls/:id/join` - Join a call
- `POST /api/calls/:id/end` - End a call
- `POST /api/calls/:id/signal` - Send WebRTC signaling data

## Socket.io Events

### Client → Server
- `join_user_room` - Join personal notification room
- `join_conversation` - Join conversation room
- `leave_conversation` - Leave conversation room
- `typing` - Send typing indicator
- `call_offer` - Send WebRTC offer
- `call_answer` - Send WebRTC answer
- `ice_candidate` - Send ICE candidate

### Server → Client
- `new_message` - New message received
- `user_typing` - User typing status
- `incoming_call` - Incoming call notification
- `call_participant_joined` - Participant joined call
- `call_participant_left` - Participant left call
- `call_ended` - Call ended
- `call_offer` - WebRTC offer received
- `call_answer` - WebRTC answer received
- `ice_candidate` - ICE candidate received

## Setup Instructions

### 1. Database Setup
MongoDB collections will be automatically created:
- `conversations`
- `messages`
- `calls`

### 2. Supabase Setup (Optional)
For real-time typing indicators:
```bash
# Run the migration
supabase db push
```

### 3. Environment Variables
Ensure these are set in your `.env`:
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 4. Start the Server
```bash
npm run server
```

### 5. Start the Frontend
```bash
npm run dev
```

## Usage Guide

### Starting a Direct Chat
1. Go to **Community** page (`/users`)
2. Find a user you want to chat with
3. Click the **Chat** button
4. You'll be redirected to the chat interface

### Creating a Group
1. Go to **Messages** page (`/chat`)
2. Click the **Group** icon (top right)
3. Select participants
4. Enter group name and description
5. Click **Create**

### Making a Call
1. Open any conversation
2. Click the **Phone** icon for audio call
3. Or click the **Video** icon for video call
4. Wait for the other person to join
5. Use controls to mute/unmute or toggle video

### Sending Files
1. In any conversation
2. Click the **Paperclip** icon
3. Select a file or image
4. File will be uploaded and sent automatically

## Security Features

- **JWT Authentication**: All API requests require valid tokens
- **Role-Based Access**: Students can only chat with students
- **Participant Verification**: Users can only access conversations they're part of
- **Admin Controls**: Only group admins can add/remove participants
- **Secure WebRTC**: Peer-to-peer encryption for calls

## Performance Optimizations

- **Message Pagination**: Load messages in batches
- **Lazy Loading**: Conversations loaded on demand
- **Optimistic Updates**: Instant UI feedback
- **Connection Pooling**: Efficient Socket.io connections
- **Media Compression**: Automatic file size optimization

## Mobile Responsiveness

- **Adaptive Layout**: Single column on mobile, dual column on desktop
- **Touch Gestures**: Swipe to go back
- **Mobile-First Design**: Optimized for small screens
- **Responsive Media**: Images and videos scale appropriately

## Future Enhancements

- [ ] Message reactions (emoji)
- [ ] Voice messages
- [ ] Screen sharing in calls
- [ ] Message search
- [ ] Conversation pinning
- [ ] Message forwarding
- [ ] Group call support (3+ participants)
- [ ] End-to-end encryption
- [ ] Push notifications
- [ ] Message editing/deletion
- [ ] Custom emoji/stickers

## Troubleshooting

### Messages not appearing in real-time
- Check Socket.io connection in browser console
- Verify server is running
- Check firewall settings

### Calls not connecting
- Ensure HTTPS in production (WebRTC requirement)
- Check browser permissions for camera/microphone
- Verify STUN/TURN server configuration

### Permission errors
- Verify user roles in database
- Check JWT token validity
- Ensure participant verification logic

## Support

For issues or questions, check:
- Server logs: `npm run server`
- Browser console for client errors
- Network tab for API failures
