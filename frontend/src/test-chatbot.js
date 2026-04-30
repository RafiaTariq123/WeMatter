// Test script to debug depression chatbot API
import axios from 'axios';

const testDepressionChatbot = async () => {
  try {
    console.log('Testing Depression Chatbot API...');
    
    // Test API endpoint
    const response = await axios.post('http://localhost:5000/api/chatbot/depression', {
      message: "I'm feeling really sad lately",
      conversationHistory: []
    });
    
    console.log('API Test Success!');
    console.log('Response:', response.data);
    console.log('Response text:', response.data.response.text);
    console.log('Response type:', response.data.response.type);
    
  } catch (error) {
    console.error('API Test Failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

// Run test
testDepressionChatbot();
