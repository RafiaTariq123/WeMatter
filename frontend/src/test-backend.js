// Test script to debug backend connection and authentication
import axios from 'axios';

const testBackendConnection = async () => {
  try {
    console.log('=== Testing Backend Connection ===');
    
    // Test 1: Basic connection (no auth required)
    console.log('1. Testing basic connection...');
    const basicTest = await axios.get('http://localhost:8000/api/test');
    console.log('Basic connection works:', basicTest.data);
    
    // Test 2: Chatbot suggestions (should be public)
    console.log('2. Testing chatbot suggestions...');
    const suggestionsTest = await axios.get('http://localhost:8000/api/chatbot/suggestions');
    console.log('Suggestions endpoint works:', suggestionsTest.data);
    
    // Test 3: Chatbot depression endpoint (should be public)
    console.log('3. Testing depression chatbot...');
    const chatbotTest = await axios.post('http://localhost:8000/api/chatbot/depression', {
      message: "I'm feeling sad",
      conversationHistory: []
    });
    console.log('Depression chatbot works:', chatbotTest.data);
    
    // Test 4: Auth endpoint (should fail with 401)
    console.log('4. Testing auth endpoint (should fail)...');
    try {
      const authTest = await axios.get('http://localhost:8000/me');
      console.log('❌ Auth endpoint should have failed but didn\'t');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Auth endpoint correctly requires authentication');
      } else {
        console.log('❌ Unexpected auth error:', error.message);
      }
    }
    
    console.log('=== All Tests Complete ===');
    
  } catch (error) {
    console.error('❌ Backend Test Failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

// Run test
testBackendConnection();
