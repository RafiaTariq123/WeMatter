# AI Chatbot Setup Instructions

## 🚀 Getting Started

### 1. Install Dependencies
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd "c:\Users\DELL\Documents\WeMatter\WeMatter\frontend"
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```

### 3. Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 🔧 Configuration

### API Key Setup
The Gemini API key is already configured in `.env` file:
```
VITE_GEMINI_API_KEY=AIzaSyC1onFuwru7qnCCmHn6bLCXdroO3z3DkTg
```

### What's Working
- ✅ Gemini AI API integration
- ✅ Real AI responses for any question
- ✅ Conversation context awareness
- ✅ Enhanced fallback responses
- ✅ Mental health focused AI persona

### Features
- **Real AI Conversations**: Can discuss any topic using Gemini AI
- **Context Awareness**: Remembers conversation history
- **Mental Health Focus**: Specialized for wellness support
- **Fallback System**: Works even without API
- **Error Handling**: Graceful degradation

## 🤖 AI Capabilities

The chatbot can now handle:
- Any mental health questions
- Relationship advice
- Work/study stress
- General life guidance
- Complex conversations
- Personalized responses

## 🐛 Troubleshooting

If it's not running:

1. **PowerShell Execution Policy**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Clear Node Modules**:
   ```powershell
   rm -rf node_modules
   npm install
   ```

3. **Check Port**:
   Make sure port 5173 is available

4. **Browser Console**:
   Check for any JavaScript errors

## 📁 Files Modified

- `src/services/aiService.js` - AI integration
- `src/components/AIChatbot.jsx` - Updated to use AI
- `package.json` - Added Google AI dependency
- `.env` - API key configuration

The AI chatbot is now fully integrated with Gemini AI and ready to use!
