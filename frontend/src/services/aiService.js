import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI - temporarily hardcoded for testing
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC1onFuwru7qnCCmHn6bLCXdroO3z3DkTg';
console.log('API Key loaded:', apiKey ? 'YES' : 'NO'); // Debug log

const genAI = new GoogleGenerativeAI(apiKey);

const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // For development, provide a fallback response if no API key
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.log('Using fallback response - no API key'); // Debug log
      return getFallbackResponse(userMessage);
    }

    console.log('Using Gemini AI API'); // Debug log
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create conversation context
    const context = `You are a compassionate and knowledgeable AI assistant specializing in mental health support and wellness. You are:
- Supportive and empathetic
- Knowledgeable about mental health topics
- Focused on providing helpful, evidence-based advice
- Always include a disclaimer that you're not a substitute for professional medical care
- Able to discuss a wide range of topics including mental health, relationships, work stress, study tips, motivation, self-care, and general life guidance
- Warm and conversational in tone

🚨 **CRITICAL SAFETY INSTRUCTIONS:**
If the user mentions ANY suicidal thoughts, self-harm, or wanting to die, you MUST:
1. Immediately provide crisis resources (988, Crisis Text Line, etc.)
2. Emphasize that their life matters and help is available
3. Encourage immediate contact with crisis services
4. Take their statements seriously and with urgency
5. Do NOT give general wellness advice - provide specific crisis resources

Previous conversation:
${conversationHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

User: ${userMessage}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    return {
      text: text,
      showSuggestions: true,
      type: 'ai_response'
    };

  } catch (error) {
    console.error('AI API Error:', error);
    return getFallbackResponse(userMessage);
  }
};

const getFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // 🚨 SUICIDE PREVENTION - MUST BE FIRST PRIORITY
  if (message.includes('suicid') || message.includes('kill myself') || message.includes('end my life') || message.includes('want to die') || message.includes('don\'t want to live') || message.includes('better off dead')) {
    return {
      text: "🚨 **This is important - please read carefully:**\n\nYour life matters and there are people who want to help you right now.\n\n**Immediate Help:**\n📞 **988 Suicide & Crisis Lifeline** - Call or text 988\n📱 **Crisis Text Line** - Text HOME to 741741\n🌐 **International Resources** - Find help at findahelpline.com\n\n**Please reach out to one of these resources now. They are free, confidential, and available 24/7.**\n\nYou don't have to go through this alone. There is hope, and things can get better with the right support.",
      showSuggestions: false,
      type: 'emergency'
    };
  }
  
  // Enhanced fallback responses with more comprehensive coverage
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return {
      text: "Hello! I'm here to help with mental health support and wellness. How are you feeling today?",
      showSuggestions: true,
      type: 'greeting'
    };
  }
  
  // How are you
  if (message.includes('how are you')) {
    return {
      text: "I'm here and ready to help you! More importantly, how are you feeling?",
      showSuggestions: true,
      type: 'wellbeing'
    };
  }
  
  // Exercise/fitness
  if (message.includes('exercise') || message.includes('workout') || message.includes('movement') || message.includes('physical activity')) {
    return {
      text: "Exercise is excellent for both physical and mental health! Here are some suggestions:\n\n🧘 **Breathing Exercises**: 4-7-8 breathing - inhale for 4, hold for 7, exhale for 8\n🚶 **Movement**: 5-minute walk or gentle stretching\n💪 **Strength**: Simple bodyweight exercises like squats or push-ups\n🧘 **Mindfulness**: 5-minute meditation or body scan\n\nWhat type of exercise interests you most?",
      showSuggestions: true,
      type: 'exercise'
    };
  }
  
  // Breathing/Mindfulness
  if (message.includes('breath') || message.includes('breathe') || message.includes('mindful') || message.includes('meditation')) {
    return {
      text: "Breathing and mindfulness are powerful tools! Try these:\n\n**4-7-8 Breathing**: Inhale 4 seconds, hold 7, exhale 8\n**Box Breathing**: Inhale 4, hold 4, exhale 4, hold 4\n**5-4-3-2-1 Grounding**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n\nWhich technique would you like to try?",
      showSuggestions: true,
      type: 'mindfulness'
    };
  }
  
  // Depression/Sadness
  if (message.includes('depress') || message.includes('sad') || message.includes('down') || message.includes('unhappy')) {
    return {
      text: "I understand you're going through a difficult time. Remember that you're not alone and help is available. Consider reaching out to a mental health professional. In the meantime, gentle exercise, talking to someone you trust, and practicing self-compassion can help. Would you like some specific coping strategies?",
      showSuggestions: true,
      type: 'mental_health'
    };
  }
  
  // Anxiety
  if (message.includes('anxious') || message.includes('anxiety') || message.includes('worry') || message.includes('nervous')) {
    return {
      text: "Anxiety can be overwhelming, but there are effective strategies to manage it. Deep breathing, mindfulness, and exercise can help. Try the 4-7-8 breathing technique or progressive muscle relaxation. Would you like me to guide you through a specific anxiety management technique?",
      showSuggestions: true,
      type: 'mental_health'
    };
  }
  
  // Stress
  if (message.includes('stress') || message.includes('overwhelm') || message.includes('pressure') || message.includes('burnout')) {
    return {
      text: "Stress is common, but chronic stress can impact your health. Let's explore some stress management techniques: regular exercise, adequate sleep, mindfulness practices, setting boundaries, and talking about your feelings. What's causing your stress?",
      showSuggestions: true,
      type: 'stress'
    };
  }
  
  // Sleep
  if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired') || message.includes('fatigue')) {
    return {
      text: "Good sleep is crucial for mental health. Try: maintaining a consistent sleep schedule, creating a relaxing bedtime routine, avoiding screens before bed, keeping your room cool and dark, and avoiding caffeine late in the day. What specific sleep issues are you having?",
      showSuggestions: true,
      type: 'sleep'
    };
  }
  
  // Relationships
  if (message.includes('relationship') || message.includes('friend') || message.includes('family') || message.includes('partner')) {
    return {
      text: "Relationships can be complex and challenging. Healthy communication, boundaries, and mutual respect are key. Whether it's conflict, distance, or connection issues, I'm here to help. What relationship challenges are you facing?",
      showSuggestions: true,
      type: 'relationships'
    };
  }
  
  // Work/Career
  if (message.includes('work') || message.includes('job') || message.includes('career') || message.includes('boss')) {
    return {
      text: "Work can significantly impact our mental health. Whether it's stress, burnout, or career decisions, I'm here to help. Common strategies include setting boundaries, practicing stress management, and maintaining work-life balance. What work-related challenges are you dealing with?",
      showSuggestions: true,
      type: 'career'
    };
  }
  
  // Study/Education
  if (message.includes('study') || message.includes('school') || message.includes('exam') || message.includes('homework')) {
    return {
      text: "Academic pressure can be intense. Time management, study techniques, and self-care during exams are important. Try the Pomodoro technique (25 min study, 5 min break), breaking tasks into smaller steps, and maintaining a routine. What academic challenges are you facing?",
      showSuggestions: true,
      type: 'education'
    };
  }
  
  // Motivation
  if (message.includes('motivation') || message.includes('procrastination') || message.includes('lazy')) {
    return {
      text: "Motivation naturally fluctuates. Try: breaking tasks into smaller steps, understanding your 'why', celebrating small wins, creating accountability, and being kind to yourself during low-motivation periods. What are you struggling to get motivated about?",
      showSuggestions: true,
      type: 'motivation'
    };
  }
  
  // Self-care
  if (message.includes('self care') || message.includes('self-care') || message.includes('take care of myself')) {
    return {
      text: "Self-care is essential for mental wellbeing. It includes exercise, nutrition, sleep, mindfulness, hobbies, and setting boundaries. Remember that self-care isn't selfish - it's necessary for your health. What area of self-care would you like to focus on?",
      showSuggestions: true,
      type: 'selfcare'
    };
  }
  
  // Therapy/Professional help
  if (message.includes('therapy') || message.includes('therapist') || message.includes('counselor') || message.includes('professional help')) {
    return {
      text: "Seeking professional help is a sign of strength. A therapist can provide personalized support and evidence-based treatments. Different types include CBT, DBT, and psychodynamic therapy. Many offer online sessions and sliding scale fees. Would you like information about finding a therapist?",
      showSuggestions: true,
      type: 'therapy'
    };
  }
  
  // Confidence/Self-esteem
  if (message.includes('confidence') || message.includes('self esteem') || message.includes('self-esteem') || message.includes('insecure')) {
    return {
      text: "Building confidence takes practice. Try: setting and achieving small goals, practicing positive affirmations, focusing on your strengths, accepting compliments, and surrounding yourself with supportive people. Remember that everyone has insecurities. What area of confidence would you like to work on?",
      showSuggestions: true,
      type: 'confidence'
    };
  }
  
  // Anger
  if (message.includes('angry') || message.includes('anger') || message.includes('mad') || message.includes('frustrated')) {
    return {
      text: "Anger is a normal emotion that signals something needs attention. Healthy management includes: identifying triggers, using 'I' statements, taking timeouts before reacting, practicing deep breathing, and finding healthy outlets. What's making you angry?",
      showSuggestions: true,
      type: 'anger'
    };
  }
  
  // General knowledge questions
  if (message.includes('what is') || message.includes('define') || message.includes('explain') || message.includes('tell me about')) {
    return {
      text: "I'd be happy to explain concepts related to mental health, wellness, and personal development. I can discuss topics like anxiety, depression, mindfulness, stress management, cognitive behavioral therapy, healthy relationships, communication skills, and much more. What specific topic would you like me to explain?",
      showSuggestions: true,
      type: 'knowledge'
    };
  }
  
  // Personal questions about AI
  if (message.includes('who are you') || message.includes('what are you') || message.includes('your name')) {
    return {
      text: "I'm an AI assistant designed to help with mental health support and wellness. I can provide information, exercises, resources, and a listening ear. While I'm not a substitute for professional medical care, I'm here to support you 24/7. How can I help you today?",
      showSuggestions: true,
      type: 'about'
    };
  }
  
  // Thank you
  if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
    return {
      text: "You're welcome! I'm glad I could help. Remember, I'm here whenever you need support. Is there anything else you'd like to discuss?",
      showSuggestions: true,
      type: 'thanks'
    };
  }
  
  // Goodbye
  if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('take care')) {
    return {
      text: "Take care of yourself! Remember that support is always available when you need it. Be well!",
      showSuggestions: false,
      type: 'goodbye'
    };
  }
  
  // Enhanced default response
  return {
    text: "I'm here to help with mental health, wellness, and life guidance. I can discuss topics like:\n\n🧠 **Mental Health**: Anxiety, depression, stress, mood management\n💪 **Wellness**: Exercise, sleep, nutrition, self-care\n👥 **Relationships**: Friends, family, communication, boundaries\n💼 **Work/School**: Stress management, motivation, study tips\n🎯 **Personal Growth**: Confidence, goals, life balance\n\nWhat's on your mind? I'm here to listen and help.",
    showSuggestions: true,
    type: 'general'
  };
};

export { getAIResponse };
