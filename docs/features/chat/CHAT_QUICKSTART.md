# Chat System Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
All required packages are already in `package.json`. If you haven't installed them:
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm run server
```
The server will start on `http://localhost:3001`

### 3. Start the Frontend
In a new terminal:
```bash
npm run dev
```
The app will start on `http://localhost:5173`

### 4. Test the Chat System

#### Create Test Accounts
1. Open the app in two different browsers (or incognito mode)
2. Sign up as a **Teacher** in one browser
3. Sign up as a **Student** in another browser

#### Test Direct Messaging
1. In the Teacher account:
   - Go to **Community** (sidebar)
   - Click **Chat** button on any student
   - Send a message
2. In the Student account:
   - Go to **Messages** (sidebar)
   - You should see the conversation
   - Reply to the message

#### Test Group Chat
1. In any account:
   - Go to **Messages**
   - Click the **Group** icon (top right)
   - Select multiple users
   - Enter a group name
   - Click **Create**
   - Send messages in the group

#### Test Audio/Video Calls
1. Open a conversation
2. Click the **Phone** icon (audio) or **Video** icon
3. In the other browser, accept the call
4. Test mute/unmute and video toggle

## 📱 Features Overview

### Available Now
✅ Direct messaging between users
✅ Group discussions/communities
✅ Real-time message delivery
✅ Typing indicators
✅ File and image sharing
✅ Audio/Video calling (WebRTC)
✅ Read receipts
✅ Role-based permissions
✅ Mobile responsive design
✅ Chat button on user profiles

### Navigation
- **Messages** (`/chat`) - View all conversations
- **Community** (`/users`) - Browse users and start chats
- **Chat Interface** - Send messages, make calls, share files

## 🎯 Role-Based Rules

### Teachers
- Can chat with **anyone** (teachers and students)
- Can create groups with any users
- Can make calls to anyone

### Students
- Can only chat with **other students**
- Can only see other students in Community
- Can create groups with students only

## 🔧 Troubleshooting

### "Failed to load conversations"
- Make sure the backend server is running (`npm run server`)
- Check that MongoDB is connected (check server logs)

### Messages not appearing in real-time
- Verify Socket.io connection in browser console
- Check that both users are logged in
- Refresh the page

### Call not connecting
- Allow camera/microphone permissions in browser
- Use Chrome or Firefox (best WebRTC support)
- For production, you'll need HTTPS

### "Not authorized" errors
- Check user roles in the database
- Students can only chat with students
- Verify JWT token is valid

## 📊 Database Collections

The system automatically creates these MongoDB collections:
- `conversations` - Chat conversations
- `messages` - All messages
- `calls` - Call sessions
- `users` - User accounts (already exists)

## 🎨 UI Components

### Chat Interface
- **Message Bubbles**: Different colors for sent/received
- **Typing Indicators**: See when others are typing
- **File Attachments**: Images show preview, files show download
- **Call Controls**: Mute, video toggle, end call

### Conversation List
- **Search**: Find conversations quickly
- **Unread Badges**: See unread message counts
- **Last Message**: Preview of latest message
- **Timestamps**: Relative time (e.g., "2 minutes ago")

## 🔐 Security

- All API endpoints require authentication
- Role-based access control enforced
- Users can only access their own conversations
- File uploads are validated
- WebRTC uses peer-to-peer encryption

## 📝 Next Steps

1. **Customize Styling**: Edit components in `src/components/chat/`
2. **Add Features**: See `CHAT_SYSTEM_GUIDE.md` for enhancement ideas
3. **Deploy**: Follow deployment guide for production setup
4. **Configure TURN Server**: For better call connectivity in production

## 💡 Tips

- Use **Chrome DevTools** to debug Socket.io connections
- Check **Network tab** for API call failures
- View **Console** for real-time event logs
- Test on **mobile devices** for responsive design

## 🆘 Need Help?

Check these files for detailed information:
- `CHAT_SYSTEM_GUIDE.md` - Complete technical documentation
- `server/routes/chat.ts` - Backend API implementation
- `src/lib/chatService.ts` - Frontend service layer
- `src/components/chat/` - UI components

## ✨ Demo Workflow

1. **Sign up** as Teacher and Student (two browsers)
2. **Teacher** goes to Community → clicks Chat on student
3. **Student** sees new conversation in Messages
4. Both users **exchange messages** in real-time
5. **Teacher** clicks Phone icon to start audio call
6. **Student** accepts call and they talk
7. **Teacher** creates a group with multiple students
8. Everyone in group can **chat together**

Enjoy your new real-time chat system! 🎉
