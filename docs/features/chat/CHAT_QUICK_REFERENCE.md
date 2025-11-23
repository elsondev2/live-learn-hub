# Chat System Quick Reference Card

## 🚀 Quick Start
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

## 📍 Navigation
- **Messages**: `/chat` - All conversations
- **Community**: `/users` - Browse users, start chats
- **Sidebar**: Click "Messages" icon

## 🎯 Main Features

### Start Direct Chat
1. Go to Community (`/users`)
2. Click **Chat** button on user
3. Start messaging

### Create Group
1. Go to Messages (`/chat`)
2. Click **Group** icon (top right)
3. Select users → Name group → Create

### Make Call
1. Open conversation
2. Click **Phone** (audio) or **Video** icon
3. Wait for answer

### Send File
1. In conversation
2. Click **Paperclip** icon
3. Select file → Auto-uploads

## 🔐 Permissions

### Teachers
✅ Chat with anyone
✅ Create groups with anyone
✅ Call anyone

### Students
✅ Chat with students only
✅ See students only
✅ Create groups with students

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Socket.io
- **Backend**: Express + MongoDB + Socket.io
- **Calls**: WebRTC
- **Real-time**: Socket.io WebSockets

## 📁 Key Files

### Frontend
- `src/pages/Chat.tsx` - Main chat page
- `src/components/chat/ChatInterface.tsx` - Chat UI
- `src/lib/chatService.ts` - API service
- `src/lib/callService.ts` - Call service

### Backend
- `server/routes/chat.ts` - Chat API
- `server/routes/calls.ts` - Call API
- `server/index.ts` - Socket.io events

## 🔧 Troubleshooting

### Messages not real-time?
- Check server is running
- Check browser console for Socket.io errors
- Refresh page

### Call not connecting?
- Allow camera/microphone permissions
- Use Chrome or Firefox
- Check HTTPS in production

### Permission errors?
- Verify user role (Teacher/Student)
- Check JWT token validity
- Students can only chat with students

## 📊 API Endpoints

### Chat
```
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
POST   /api/conversations/:id/read
```

### Calls
```
POST   /api/calls/initiate
POST   /api/calls/:id/join
POST   /api/calls/:id/end
```

## 🎨 UI Components

### Message Types
- **Text**: Plain messages
- **Image**: Shows preview
- **File**: Download button

### Indicators
- **Typing**: "User is typing..."
- **Unread**: Badge with count
- **Read**: Checkmarks

### Call Controls
- **Mute**: Toggle audio
- **Video**: Toggle camera
- **End**: Hang up

## 📱 Mobile Support
- Responsive layout
- Touch-friendly
- Swipe to go back
- Adaptive UI

## 🎯 Common Tasks

### Find a conversation
1. Go to Messages
2. Use search bar
3. Type user/group name

### Leave a group
1. Open group chat
2. Click **⋮** (more options)
3. Select "Leave Chat"

### Add to group
1. Open group chat
2. Click **⋮** (more options)
3. Select "View Participants"
4. Click "Add" (admin only)

## 📚 Documentation
- `CHAT_SYSTEM_GUIDE.md` - Full technical docs
- `CHAT_QUICKSTART.md` - Setup guide
- `CHAT_IMPLEMENTATION_SUMMARY.md` - What was built

## ✨ Features Checklist
✅ Direct messaging
✅ Group chats
✅ Real-time delivery
✅ Typing indicators
✅ File sharing
✅ Audio calls
✅ Video calls
✅ Read receipts
✅ Role permissions
✅ Mobile responsive
✅ Search
✅ Unread badges

## 🆘 Support
Check browser console for errors
Check server logs: `npm run server`
Verify MongoDB connection
Test Socket.io connection

---

**Ready to chat!** 🎉
