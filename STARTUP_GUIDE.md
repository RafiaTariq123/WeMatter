# 🚀 WeMatter Depression Chatbot Startup Guide

## 🔧 Issues Found & Fixed:

1. ✅ **Backend server wasn't running** (connection refused)
2. ✅ **Wrong port** (using 5000 instead of 8000) 
3. ✅ **API key in wrong place** (frontend instead of backend)
4. ✅ **Authentication errors** (401 Unauthorized)

## 📋 Quick Start Steps:

### 1. Start Backend Server
```bash
cd backend
npm install openai
npm start
```
**Look for:** `Server running on port 8000`

### 2. Start Frontend Server  
```bash
cd frontend  
npm run dev
```
**Look for:** `Local: http://localhost:5173`

### 3. Test the Chatbot
1. Open http://localhost:5173
2. Click purple chat button (bottom-right)
3. Send message: "I'm feeling sad"

## 🔍 Console Check:

### Backend Console Should Show:
```
=== Depression Chatbot API Call ===
OpenAI API Key exists: true
OpenAI API Key format: Valid format
Calling OpenAI API...
OpenAI response received: ...
```

### Frontend Console Should Show:
- No "connection refused" errors
- No "401 Unauthorized" errors
- Successful API responses

## 🚨 If Still Getting Errors:

### Error: "Connection Refused"
**Fix:** Backend server not running
```bash
cd backend
npm start
```

### Error: "401 Unauthorized" 
**Fix:** Authentication issue - check if you're logged in

### Error: "API Key not configured"
**Fix:** OpenAI key not working
1. Get new key from https://platform.openai.com/api-keys
2. Update `backend/.env`

### Error: "Same fallback response"
**Fix:** OpenAI API not working
1. Check backend console for errors
2. Verify API key format (starts with `sk-`)
3. Check OpenAI account balance

## 🎯 Success Indicators:

✅ Backend running on port 8000  
✅ Frontend running on port 5173  
✅ No console errors  
✅ Different AI responses for different messages  
✅ Conversation context working  
✅ Crisis detection working  

## 🧪 Test Messages:

**Basic Test:**
- "I'm feeling sad lately"
- "I don't have motivation"

**Crisis Test:**
- "I'm having suicidal thoughts" 
- "I want to disappear"

**Context Test:**
- Send multiple messages to test memory

## 📞 Emergency Resources Built-In:

If crisis detected, chatbot shows:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (HOME to 741741)
- International resources

---

## 🎯 Expected Behavior:

**Working:** Different, intelligent responses for each message  
**Not Working:** Same fallback response every time  

**The chatbot should now provide empathetic, depression-focused support with real OpenAI integration!** 🧠💙
