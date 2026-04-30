import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Service for depression-focused AI chatbot
 * Handles communication with backend API
 */
class DepressionChatbotService {
  /**
   * Get AI response for user message
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise} AI response object
   */
  async getResponse(message, conversationHistory = []) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/depression`, {
        message,
        conversationHistory
      });

      return response.data.response;
    } catch (error) {
      console.error('Depression chatbot API error:', error);

      // Fallback response for API errors
      return {
        text: "I'm having trouble connecting right now, but I want you to know your feelings are valid. " +
          "If you're struggling with depression, please consider reaching out to a mental health professional. " +
          "You can call 988 for immediate support. You don't have to go through this alone.",
        type: 'error',
        showSuggestions: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get conversation starter suggestions
   * @returns {Promise} Array of suggestion objects
   */
  async getSuggestions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatbot/suggestions`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);

      // Fallback suggestions
      return [
        { text: "I'm feeling really sad lately", type: 'starter' },
        { text: "I've lost interest in things I used to enjoy", type: 'starter' },
        { text: "I feel hopeless about the future", type: 'starter' },
        { text: "I don't have the energy to do anything", type: 'starter' }
      ];
    }
  }

  /**
   * Check if message contains crisis indicators
   * @param {string} message - User message to check
   * @returns {boolean} True if crisis detected
   */
  isCrisisMessage(message) {
    const crisisPhrases = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'don\'t want to live', 'better off dead', 'disappear',
      'no reason to live', 'want to vanish', 'end it all'
    ];

    return crisisPhrases.some(phrase =>
      message.toLowerCase().includes(phrase)
    );
  }
}

// Export singleton instance
export const depressionChatbotService = new DepressionChatbotService();
export default depressionChatbotService;
