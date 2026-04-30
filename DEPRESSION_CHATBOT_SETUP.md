# 🧠 Depression-Focused AI Chatbot Integration

## 📋 Overview
A depression-focused AI chatbot module integrated into the WeMatter website, providing empathetic support for students and young adults experiencing depression.

## 🎯 Key Features

### Mental Health Support
- **Empathetic responses** for persistent sadness, hopelessness, loss of motivation
- **Evidence-based coping strategies** (behavioral activation, journaling, grounding exercises)
- **Gentle encouragement** without toxic positivity
- **Educational information** about depression causes and symptoms

### Safety Features
- **Crisis detection** for high-risk phrases (suicide, self-harm)
- **Immediate crisis resources** (988, Crisis Text Line)
- **Professional help encouragement** when appropriate
- **Non-diagnostic language** - never provides medical advice

### Technical Implementation
- **OpenAI GPT-3.5-turbo** integration
- **Secure backend API** with error handling
- **Floating chat widget** with calm, minimal design
- **Conversation context** awareness

## 📁 Files Created/Modified

### Backend Files
```
backend/
├── controllers/depressionChatbot.controller.js  # OpenAI integration & crisis handling
├── routes/depressionChatbot.routes.js           # API endpoints
├── package.json                                # Added OpenAI dependency
├── server.js                                   # Added chatbot routes
└── .env.example                                # Added OpenAI API key
```

### Frontend Files
```
frontend/
├── src/
│   ├── components/DepressionChatbot.jsx       # Chat UI component
│   ├── services/depressionChatbot.service.js   # API service layer
│   └── pages/Home.jsx                         # Added chatbot import
├── .env.example                                # Added backend URL
└── package.json                               # Already has required dependencies
```

## 🚀 Setup Instructions

### 1. Backend Setup

1. **Install OpenAI dependency:**
   ```bash
   cd backend
   npm install openai
   ```

2. **Add OpenAI API key to `.env`:**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start backend server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Update `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### 3. Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign up/login to OpenAI
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to backend `.env` file

## 🔧 API Endpoints

### POST `/api/chatbot/depression`
Get AI response for user message

**Request:**
```json
{
  "message": "I'm feeling really sad lately",
  "conversationHistory": [
    {"sender": "user", "text": "Hello"},
    {"sender": "bot", "text": "How can I help you?"}
  ]
}
```

**Response:**
```json
{
  "response": {
    "text": "I'm really sorry to hear you're feeling this way...",
    "type": "support",
    "showSuggestions": true,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/chatbot/suggestions`
Get conversation starter suggestions

**Response:**
```json
{
  "suggestions": [
    {"text": "I'm feeling really sad lately", "type": "starter"},
    {"text": "I've lost interest in things I used to enjoy", "type": "starter"}
  ]
}
```

## 🎨 UI Design

### Floating Chat Widget
- **Position**: Fixed bottom-right corner
- **Colors**: Soft purple (#6366f1) primary, calm grays
- **Icons**: Psychology icon for empathy
- **Animations**: Smooth transitions and hover effects

### Chat Interface
- **Header**: "Mental Health Support" with psychology icon
- **Messages**: Different colors for user/bot/crisis messages
- **Suggestions**: Clickable conversation starters
- **Input**: Multiline text area with send button

### Crisis Response UI
- **Red border** and background for crisis messages
- **Heart icon** for crisis messages
- **No suggestions** shown during crisis
- **Bold text** for emergency resources

## 🚨 Safety Features

### Crisis Detection
The system detects phrases like:
- "suicide", "kill myself", "end my life"
- "want to die", "don't want to live"
- "better off dead", "disappear"

### Crisis Response
When crisis is detected:
1. **Immediate empathetic response**
2. **Crisis resources** (988, Crisis Text Line)
3. **Professional help encouragement**
4. **No suggestions** shown

### Professional Boundaries
- **Never diagnoses** mental health conditions
- **Always includes disclaimer** about not being a therapist
- **Encourages professional help** for persistent symptoms
- **Uses gentle, supportive language**

## 🧪 Testing

### Basic Functionality
1. **Start both servers** (backend on 5000, frontend on 5173)
2. **Open browser** to http://localhost:5173
3. **Click floating chat button** (purple, bottom-right)
4. **Send test messages** to verify responses

### Crisis Testing
Test with phrases like:
- "I'm having suicidal thoughts"
- "I want to disappear"
- "I don't want to live anymore"

### Error Handling
1. **Stop backend server** and test fallback responses
2. **Invalid API key** testing
3. **Network error** simulation

## 🔍 Debug Information

### Console Logs
- API key loading status
- API call initiation/completion
- Error details for troubleshooting
- Crisis detection alerts

### Browser DevTools
Check Network tab for:
- API request/response status
- Error messages
- Response times

## 📞 Emergency Resources

The chatbot provides these resources during crisis:
- **988 Suicide & Crisis Lifeline** (Call/Text)
- **Crisis Text Line** (Text HOME to 741741)
- **International Resources** (findahelpline.com)

## 🎯 Integration Points

### Existing WeMatter Features
- **Home.jsx**: Added DepressionChatbot import
- **No modifications** to existing components
- **Isolated functionality** - doesn't affect other features
- **Complementary** to existing mental health resources

### Future Enhancements
- **User authentication** for conversation history
- **Mood tracking** integration
- **Professional referral** system
- **Multilingual support**

---

## ✅ Quick Start Checklist

1. [ ] Install OpenAI dependency in backend
2. [ ] Add OpenAI API key to backend `.env`
3. [ ] Add backend URL to frontend `.env`
4. [ ] Start both servers
5. [ ] Test basic functionality
6. [ ] Test crisis detection
7. [ ] Verify error handling

**Your depression-focused AI chatbot is now integrated and ready to support users!** 🧠💙
