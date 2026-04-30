import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/aiService.js';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fab,
  Drawer,
  Avatar,
  useTheme,
  alpha,
  Button,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  FitnessCenter as ExerciseIcon,
  Article as ArticleIcon,
  School as TutorialIcon,
  VideoLibrary as VideoIcon,
  MenuBook as BookIcon,
  SelfImprovement as MindfulnessIcon
} from '@mui/icons-material';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I'm here to help with mental health support, answer questions, provide information, and offer guidance on various topics. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const mentalHealthResponses = {
    depression: [
      "I understand you're going through a difficult time. Remember that depression is treatable, and you're not alone in this journey.",
      "It takes courage to reach out. Consider talking to a mental health professional who can provide specialized support.",
      "Small steps can make a big difference. Have you tried any self-care activities today, like a short walk or deep breathing?"
    ],
    anxiety: [
      "Anxiety can be overwhelming, but there are effective strategies to manage it. Deep breathing exercises can help in the moment.",
      "Remember that anxiety is temporary. Grounding techniques like the 5-4-3-2-1 method can help you stay present.",
      "It's okay to feel anxious. Your feelings are valid. Would you like to learn some coping techniques?"
    ],
    stress: [
      "Stress is a normal part of life, but chronic stress can impact your mental health. Let's explore some stress management techniques.",
      "Have you considered mindfulness or meditation? Even 5 minutes a day can help reduce stress levels.",
      "Remember to be kind to yourself during stressful times. Self-compassion is important for mental wellbeing."
    ],
    loneliness: [
      "Feeling lonely is difficult, but please know that many people experience this. You're not alone in feeling alone.",
      "Building connections takes time. Consider joining support groups or community activities where you can meet like-minded people.",
      "I'm here to listen. Sometimes just having someone to talk to can help ease feelings of loneliness."
    ],
    general: [
      "Thank you for sharing with me. Your feelings are valid and important.",
      "I'm here to support you. Remember that seeking help is a sign of strength.",
      "Taking care of your mental health is just as important as physical health. You're making a positive step by reaching out.",
      "Remember that healing is not linear. Some days will be better than others, and that's okay.",
      "You deserve support and compassion. Don't hesitate to reach out to mental health professionals for additional help."
    ]
  };

  const exerciseRecommendations = {
    breathing: [
      "🧘 **4-7-8 Breathing**: Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 3-4 times.",
      "🌊 **Box Breathing**: Inhale for 4, hold for 4, exhale for 4, hold for 4. Great for anxiety!",
      "💫 **Diaphragmatic Breathing**: Place one hand on your chest, one on your belly. Breathe so only your belly moves."
    ],
    mindfulness: [
      "🎯 **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "🌸 **Body Scan**: Lie down and focus on each body part from toes to head, noticing sensations without judgment.",
      "🍵 **Mindful Tea/Coffee**: Focus on the warmth, aroma, and taste. Notice every sensation."
    ],
    movement: [
      "🚶 **5-Minute Walk**: Even a short walk can boost mood and reduce anxiety.",
      "🤸 **Gentle Stretching**: Reach for the sky, touch your toes, roll your shoulders. Release tension.",
      "💃 **Dance Break**: Put on your favorite song and move freely for 3 minutes!"
    ],
    journaling: [
      "📝 **Gratitude List**: Write down 3 things you're grateful for today.",
      "🎨 **Feelings Dump**: Write everything on your mind without filtering or judging.",
      "🌟 **Future Self Letter**: Write a letter to your future self about your hopes and dreams."
    ]
  };

  const resourceRecommendations = {
    articles: [
      {
        title: "Understanding Depression: Signs, Symptoms, and Treatment",
        url: "#",
        category: "Mental Health Education"
      },
      {
        title: "Anxiety Management Techniques That Actually Work",
        url: "#",
        category: "Coping Strategies"
      },
      {
        title: "The Science Behind Mindfulness and Meditation",
        url: "#",
        category: "Mindfulness"
      },
      {
        title: "Building Resilience: How to Bounce Back from Adversity",
        url: "#",
        category: "Personal Growth"
      }
    ],
    tutorials: [
      {
        title: "Guided Meditation for Beginners",
        url: "#",
        type: "Video",
        duration: "10 min"
      },
      {
        title: "Progressive Muscle Relaxation Tutorial",
        url: "#",
        type: "Audio",
        duration: "15 min"
      },
      {
        title: "CBT Techniques for Negative Thoughts",
        url: "#",
        type: "Interactive",
        duration: "20 min"
      }
    ],
    exercises: [
      {
        title: "Daily Mood Tracker Exercise",
        url: "/dashboard/journal",
        type: "Journaling",
        frequency: "Daily"
      },
      {
        title: "Cognitive Restructuring Worksheet",
        url: "/dashboard/exercises",
        type: "CBT Exercise",
        frequency: "Weekly"
      },
      {
        title: "Stress Management Assessment",
        url: "/dashboard/exercises",
        type: "Assessment",
        frequency: "Monthly"
      }
    ],
    videos: [
      {
        title: "Yoga for Mental Health",
        url: "#",
        duration: "30 min",
        level: "Beginner"
      },
      {
        title: "Breathing Exercises for Anxiety",
        url: "#",
        duration: "12 min",
        level: "All Levels"
      },
      {
        title: "Mindfulness Walking Meditation",
        url: "#",
        duration: "20 min",
        level: "Beginner"
      }
    ]
  };

  const getResponse = async (userMessage) => {
    try {
      // Get recent conversation history (last 10 messages for context)
      const recentHistory = messages.slice(-10);
      
      // Call AI service
      const aiResponse = await getAIResponse(userMessage, recentHistory);
      
      return aiResponse;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return {
        text: "I'm having trouble connecting right now, but I'm here to help with mental health and wellness topics. Could you tell me more about what's on your mind?",
        showSuggestions: true,
        type: 'error'
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await getResponse(inputMessage);
      
      const responseMessage = {
        id: messages.length + 2,
        ...botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm experiencing some technical difficulties, but I'm here to help. Please try again or let me know what's on your mind.",
        sender: 'bot',
        timestamp: new Date(),
        showSuggestions: true,
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: '75%'
        }}
      >
        {message.sender === 'bot' && (
          <Avatar
            sx={{
              bgcolor: '#005691',
              width: 32,
              height: 32,
              mt: 1
            }}
          >
            <BotIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}
        <Paper
          sx={{
            p: 2,
            bgcolor: message.sender === 'user' 
              ? '#005691' 
              : alpha(theme.palette.grey[100], 0.9),
            color: message.sender === 'user' ? 'white' : 'text.primary',
            borderRadius: message.sender === 'user' 
              ? '20px 20px 4px 20px' 
              : '20px 20px 20px 4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-word', mb: 1 }}>
            {message.text}
          </Typography>
          
          {/* Exercise Recommendations */}
          {message.exercises && (
            <Box sx={{ mt: 1 }}>
              {message.exercises.map((exercise, index) => (
                <Box key={index} sx={{ mb: 1, p: 1, bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {exercise}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Resource Recommendations */}
          {message.resources && (
            <Box sx={{ mt: 1 }}>
              {message.resources.map((resource, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    href={resource.url}
                    sx={{ 
                      textTransform: 'none', 
                      justifyContent: 'flex-start',
                      p: 1,
                      width: '100%'
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                        {resource.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {resource.category || resource.type || resource.duration || resource.frequency}
                      </Typography>
                    </Box>
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Quick Suggestions */}
          {message.showSuggestions && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                You can ask me about:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip 
                  label="Breathing exercises" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("breathing exercises")}
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Mindfulness" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("mindfulness exercises")}
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Stress management" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("stress management")}
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Sleep tips" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("sleep tips")}
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Self-care" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("self-care tips")}
                  sx={{ fontSize: '0.7rem' }}
                />
                <Chip 
                  label="Anxiety help" 
                  size="small" 
                  variant="outlined"
                  clickable
                  onClick={() => setInputMessage("anxiety help")}
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          )}
        </Paper>
        {message.sender === 'user' && (
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              width: 32,
              height: 32,
              mt: 1
            }}
          >
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          bgcolor: '#005691',
          '&:hover': {
            bgcolor: '#00416a'
          }
        }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400, md: 450 },
            bgcolor: 'background.default'
          }
        }}
      >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 2,
              bgcolor: '#005691',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'white' }}>
                <BotIcon sx={{ color: '#005691' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Chatbot
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Always here to listen
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: alpha(theme.palette.grey[50], 0.5)
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: '#005691', width: 32, height: 32 }}>
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.9) }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Typing...
                  </Typography>
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 20
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                sx={{
                  bgcolor: '#005691',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#00416a'
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.action.disabled
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', textAlign: 'center' }}>
              This is not a substitute for professional medical advice. If you're in crisis, please contact emergency services.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChatbot;
