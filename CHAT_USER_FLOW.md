# Chat System User Flow Guide

## 🎯 Complete User Journey

### 1️⃣ Starting a Direct Chat

```
User Dashboard
    ↓
Click "Community" in Sidebar
    ↓
Browse Users List
    ↓
Find User → Click "Chat" Button
    ↓
Redirected to Chat Interface
    ↓
Type Message → Press Enter
    ↓
Message Sent in Real-Time ✅
```

**Visual Flow:**
```
┌─────────────────┐
│   Dashboard     │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Community     │
│  ┌───────────┐  │
│  │ Teacher 1 │  │
│  │ [Chat]    │←─┼─── Click here
│  └───────────┘  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Chat Interface │
│  ┌───────────┐  │
│  │ Messages  │  │
│  │ [Type...] │  │
│  └───────────┘  │
└─────────────────┘
```

### 2️⃣ Creating a Group Chat

```
User Dashboard
    ↓
Click "Messages" in Sidebar
    ↓
Click "Group" Icon (top right)
    ↓
Select Multiple Users (checkboxes)
    ↓
Enter Group Name & Description
    ↓
Click "Create"
    ↓
Group Created → Start Chatting ✅
```

**Visual Flow:**
```
┌─────────────────┐
│   Messages      │
│   [+] [👥]     │←─── Click group icon
└────────┬────────┘
         ↓
┌─────────────────┐
│  New Group      │
│  ☑ User 1       │
│  ☑ User 2       │
│  ☐ User 3       │
│  Name: [____]   │
│  [Create]       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Group Chat     │
│  "Study Group"  │
│  3 participants │
└─────────────────┘
```

### 3️⃣ Making an Audio/Video Call

```
Open Conversation
    ↓
Click Phone Icon (audio) or Video Icon
    ↓
Call Initiated → "Calling..."
    ↓
Other User Receives Notification
    ↓
Other User Accepts
    ↓
Call Connected → Audio/Video Active ✅
    ↓
Use Controls: Mute, Video Toggle, End
```

**Visual Flow:**
```
┌─────────────────┐
│  Chat with John │
│  [📞] [📹] [⋮] │←─── Click to call
└────────┬────────┘
         ↓
┌─────────────────┐
│  Calling...     │
│  ⏱️ 00:00      │
│  [🔇] [📹] [📞]│
└────────┬────────┘
         ↓
┌─────────────────┐
│  Connected      │
│  ⏱️ 02:34      │
│  [🔇] [📹] [📞]│←─── Active call
└─────────────────┘
```

### 4️⃣ Sending Files/Images

```
Open Conversation
    ↓
Click Paperclip Icon
    ↓
Select File from Computer
    ↓
File Uploads Automatically
    ↓
File Appears in Chat
    ↓
Recipient Can Download/View ✅
```

**Visual Flow:**
```
┌─────────────────┐
│  Chat           │
│  [📎] [Type...] │←─── Click paperclip
└────────┬────────┘
         ↓
┌─────────────────┐
│  Select File    │
│  📄 document.pdf│
│  🖼️ image.jpg   │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Uploading...   │
│  ████████░░ 80% │
└────────┬────────┘
         ↓
┌─────────────────┐
│  📄 document.pdf│
│  [Download]     │←─── File sent
└─────────────────┘
```

## 🎨 UI Layout Overview

### Chat Page Layout
```
┌──────────────────────────────────────────┐
│  Sidebar  │  Conversations  │  Chat      │
│           │                 │            │
│ Messages  │  🔍 Search      │  John Doe  │
│ Community │                 │  [📞][📹] │
│ Settings  │  ┌───────────┐  │            │
│           │  │ John Doe  │  │  Messages  │
│           │  │ Hey there │  │  ┌──────┐  │
│           │  └───────────┘  │  │ Hi!  │  │
│           │                 │  └──────┘  │
│           │  ┌───────────┐  │            │
│           │  │ Study Grp │  │  [Type...] │
│           │  │ 3 members │  │  [📎][😊] │
│           │  └───────────┘  │            │
└──────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────┐
│  ← Messages      │
├──────────────────┤
│  John Doe        │
│  [📞] [📹] [⋮]  │
├──────────────────┤
│                  │
│  ┌────────────┐  │
│  │ Hi there! │  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │ Hello!    │  │
│  └────────────┘  │
│                  │
├──────────────────┤
│ [📎] [Type...] ▶│
└──────────────────┘
```

## 🔄 Real-Time Features Flow

### Message Delivery
```
User A Types Message
    ↓
Clicks Send
    ↓
API: POST /api/conversations/:id/messages
    ↓
Server Saves to MongoDB
    ↓
Socket.io Broadcasts to Room
    ↓
User B Receives via Socket
    ↓
Message Appears Instantly ✅
```

### Typing Indicator
```
User A Starts Typing
    ↓
Socket.io: emit('typing', { isTyping: true })
    ↓
Server Broadcasts to Room
    ↓
User B Sees "User A is typing..."
    ↓
User A Stops (3s timeout)
    ↓
Indicator Disappears ✅
```

### Read Receipts
```
User B Opens Conversation
    ↓
API: POST /api/conversations/:id/read
    ↓
Server Updates lastReadAt
    ↓
User A Sees Checkmarks ✅
```

## 🎯 Role-Based Access Flow

### Teacher Flow
```
Teacher Logs In
    ↓
Goes to Community
    ↓
Sees ALL Users (Teachers + Students)
    ↓
Can Click "Chat" on Anyone
    ↓
Can Create Groups with Anyone ✅
```

### Student Flow
```
Student Logs In
    ↓
Goes to Community
    ↓
Sees ONLY Students (Filtered)
    ↓
Can Click "Chat" on Students Only
    ↓
Can Create Groups with Students Only ✅
```

**Permission Check:**
```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Check Role     │
│  Teacher? ✅    │
│  Student? ✅    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Filter Users   │
│  Apply Rules    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Show Allowed   │
│  Users Only     │
└─────────────────┘
```

## 🔔 Notification Flow

### Incoming Message
```
New Message Arrives
    ↓
Socket.io Event: 'new_message'
    ↓
If Conversation Open:
    → Add to message list
    → Mark as read
    → Scroll to bottom
    ↓
If Conversation Closed:
    → Show unread badge
    → Update conversation list
    → Move to top
```

### Incoming Call
```
Call Initiated
    ↓
Socket.io Event: 'incoming_call'
    ↓
Show Call Dialog
    ↓
Play Ring Sound
    ↓
User Can:
    → Accept (join call)
    → Decline (end call)
```

## 📊 Data Flow Architecture

```
┌──────────────┐
│   Frontend   │
│   (React)    │
└──────┬───────┘
       │
       ↓ HTTP/REST
┌──────────────┐
│   Express    │
│   Server     │
└──────┬───────┘
       │
       ↓ MongoDB Driver
┌──────────────┐
│   MongoDB    │
│   Database   │
└──────────────┘

Real-Time:
┌──────────────┐
│   Frontend   │
│ (Socket.io)  │
└──────┬───────┘
       │
       ↓ WebSocket
┌──────────────┐
│   Socket.io  │
│   Server     │
└──────────────┘
```

## 🎬 Complete User Story

### Scenario: Teacher Creates Study Group

```
1. Teacher Sarah logs in
   └─→ Sees dashboard

2. Clicks "Messages" in sidebar
   └─→ Opens chat page

3. Clicks group icon
   └─→ Opens "New Group" dialog

4. Searches for students
   └─→ Types "John" in search

5. Selects 3 students
   └─→ Checks boxes next to names

6. Names the group "Math Study Group"
   └─→ Enters in name field

7. Adds description "Weekly math discussions"
   └─→ Enters in description field

8. Clicks "Create"
   └─→ Group created successfully

9. Sends first message "Welcome everyone!"
   └─→ Message delivered to all 3 students

10. All students receive notification
    └─→ See new group in their Messages

11. Students join and start chatting
    └─→ Real-time conversation begins

12. Sarah starts a video call
    └─→ All students receive call notification

13. Students join the call
    └─→ Group video study session active ✅
```

## 🎉 Success Indicators

✅ Messages appear instantly
✅ Typing indicators work
✅ Files upload and display
✅ Calls connect successfully
✅ Unread badges update
✅ Search finds conversations
✅ Mobile layout adapts
✅ Permissions enforced
✅ Groups function properly
✅ Real-time updates work

---

**The complete chat system is ready to use!** 🚀
