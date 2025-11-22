# 🔧 Local Development Setup - IMPORTANT!

## ⚠️ Current Issue

You're seeing errors because your browser is loading the **production build** which points to:
```
https://live-learn-hub.onrender.com/api
```

But you need to use the **local server**:
```
http://localhost:3001/api
```

## ✅ Quick Fix (3 Steps)

### Step 1: Clear Cache
The cache has been cleared automatically. ✅

### Step 2: Stop Any Running Processes
If you have any terminals running `npm run dev`, stop them with `Ctrl+C`.

### Step 3: Start Fresh

**Terminal 1 - Backend (Already Running):**
```bash
npm run server
```
✅ This is already running on http://localhost:3001

**Terminal 2 - Frontend (Start This Now):**
```bash
npm run dev
```

### Step 4: Open Browser
```
http://localhost:5173
```

**IMPORTANT**: Make sure you see `localhost:5173` in the URL bar, NOT any other domain!

## 🔍 How to Verify You're Using Local Server

### Check 1: Browser Console
Open DevTools (F12) → Console tab

You should see:
```
API Request: http://localhost:3001/api/...
```

NOT:
```
API Request: https://live-learn-hub.onrender.com/api/...
```

### Check 2: Network Tab
Open DevTools (F12) → Network tab → Filter by "Fetch/XHR"

All requests should go to `localhost:3001`

### Check 3: URL Bar
Should show: `http://localhost:5173`

## 🚫 Common Mistakes

### ❌ Running Production Build
```bash
npm run build
npm run preview
```
This uses `.env.production` → Points to Render

### ✅ Running Development
```bash
npm run dev
```
This uses `.env` → Points to localhost

## 📋 Complete Setup Checklist

- [ ] Backend server running (`npm run server`)
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5173`
- [ ] Console shows `localhost:3001` API requests
- [ ] No 404 or 500 errors in console
- [ ] Logged in with valid account

## 🎯 Test Chat System

Once everything is running locally:

1. **Go to Community**
   - Click "Community" in sidebar
   - You should see list of users

2. **Start a Chat**
   - Click "Chat" button on any user
   - Should redirect to `/chat`
   - No errors in console ✅

3. **Send a Message**
   - Type a message
   - Press Enter
   - Message should appear ✅

4. **Create a Group**
   - Click group icon (top right)
   - Select users
   - Enter name
   - Click Create
   - Group should be created ✅

## 🐛 Still Seeing Production URLs?

### Solution 1: Hard Refresh
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Solution 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Solution 3: Incognito/Private Window
Open a new incognito/private window and go to `http://localhost:5173`

### Solution 4: Different Browser
Try Chrome, Firefox, or Edge

## 📊 Environment Files Explained

### `.env` (Development - Local)
```
VITE_API_URL="http://localhost:3001/api"
```
Used when: `npm run dev`

### `.env.production` (Production - Render)
```
VITE_API_URL="https://live-learn-hub.onrender.com/api"
```
Used when: `npm run build` or deployed to Render

### `.env.local` (Local Override)
```
VITE_API_URL="http://localhost:3001/api"
```
Overrides other env files for local development

## 🎬 Step-by-Step Video Guide

### Terminal 1:
```bash
# Start backend
npm run server

# You should see:
# Server running on http://localhost:3001
# Socket.io enabled for real-time updates
```

### Terminal 2:
```bash
# Start frontend
npm run dev

# You should see:
# VITE v5.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
```

### Browser:
```
1. Open: http://localhost:5173
2. Sign in
3. Click "Community"
4. Click "Chat" on a user
5. Should work! ✅
```

## ✅ Success Indicators

You'll know it's working when:

1. **Console shows**:
   ```
   API Request: http://localhost:3001/api/conversations
   API Response: 200
   ```

2. **No errors**:
   - No 404 errors
   - No 500 errors
   - No "Failed to fetch" errors

3. **Chat works**:
   - Can create conversations
   - Can send messages
   - Messages appear in real-time

## 🆘 Emergency Reset

If nothing works, do a complete reset:

```bash
# Stop all processes (Ctrl+C in both terminals)

# Clear everything
rmdir /s /q dist
rmdir /s /q node_modules\.vite

# Restart backend
npm run server

# In new terminal, restart frontend
npm run dev

# Open fresh browser window
http://localhost:5173
```

## 📞 Quick Support

### Check Backend Status
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}
```

### Check Frontend Port
```bash
# Make sure port 5173 is free
netstat -ano | findstr :5173
```

### View Server Logs
Check the terminal running `npm run server` for any errors

## 🎉 Ready to Go!

Once you see:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 5173
- ✅ Browser showing localhost:5173
- ✅ Console showing localhost:3001 API calls

**You're all set!** Start testing the chat features! 🚀

---

**Remember**: Always use `npm run dev` for local development, NOT `npm run build` or `npm run preview`!
