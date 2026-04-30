import React, { useState, useRef, useEffect } from 'react';
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
  Fade,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { depressionChatbotService } from '../services/depressionChatbot.service.js';

/**
 * Depression-Focused AI Chatbot Component
 * Floating chat widget with calm, minimal design for mental health support
 */
const DepressionChatbot = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "I'm here to support you through difficult times. Whether you're feeling sad, hopeless, or just need someone to talk to, I'm here to listen. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation starters
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const chatbotSuggestions = await depressionChatbotService.getSuggestions();
        setSuggestions(chatbotSuggestions.slice(0, 4)); // Show first 4 suggestions
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      }
    };
    
    loadSuggestions();
  }, []);

  // Handle sending message
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
    setShowSuggestions(false);

    try {
      const botResponse = await depressionChatbotService.getResponse(
        inputMessage,
        messages.slice(-5) // Send last 5 messages for context
      );
      
      const responseMessage = {
        id: messages.length + 2,
        ...botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setShowSuggestions(botResponse.showSuggestions !== false);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having some technical difficulties, but I want you to know that your feelings are valid. Please consider reaching out to a mental health professional.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
        showSuggestions: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion.text);
    setShowSuggestions(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Message bubble component
  const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isCrisis = message.type === 'crisis';
    const isError = message.type === 'error';

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2,
          px: 2
        }}
      >
        {!isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              bgcolor: isCrisis ? '#ef4444' : isError ? '#f59e0b' : '#005691'
            }}
          >
            {isCrisis ? (
              <FavoriteIcon fontSize="small" />
            ) : isError ? (
              <LightbulbIcon fontSize="small" />
            ) : (
              <PsychologyIcon fontSize="small" />
            )}
          </Avatar>
        )}
        <Paper
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isUser 
              ? 'primary.main' 
              : isCrisis 
                ? '#fee2e2'
                : isError
                  ? '#fef3c7'
                  : 'grey.100',
            color: isUser ? 'white' : 'text.primary',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: isCrisis ? '2px solid #ef4444' : isError ? '2px solid #f59e0b' : 'none'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-line',
              fontWeight: isCrisis ? 600 : 400
            }}
          >
            {message.text}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          bgcolor: '#005691',
          '&:hover': { bgcolor: '#00416a' },
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            height: '100vh',
            bgcolor: '#fafafa',
            borderLeft: '1px solid #e5e7eb'
          }
        }}
      >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PsychologyIcon sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mental Health Support
                </Typography>
                <Typography variant="caption">
                  Here to listen and support you
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              py: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#005691' }}>
                  <PsychologyIcon fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2" component="span">
                    Thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Box sx={{ px: 2, py: 1, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                You can say:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion.text}
                    variant="outlined"
                    size="small"
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      '&:hover': { 
                        bgcolor: '#005691', 
                        color: 'white',
                        borderColor: '#005691'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Share how you're feeling..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                sx={{
                  bgcolor: '#005691',
                  color: 'white',
                  '&:hover': { bgcolor: '#00416a' },
                  '&:disabled': { bgcolor: 'grey.300' }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default DepressionChatbot;
