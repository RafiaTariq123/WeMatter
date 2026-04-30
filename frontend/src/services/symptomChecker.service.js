import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Symptom checker API service
export const getSymptomCheckerResponse = async (symptomData) => {
  try {
    console.log('Sending symptom data to API:', symptomData);

    const response = await axios.post(`${API_BASE_URL}/api/symptom-checker/analyze`, symptomData);

    console.log('Symptom checker API response:', response.data);
    return response;
  } catch (error) {
    console.error('Symptom checker API error:', error);
    throw error;
  }
};

// Get common symptoms for suggestions
export const getCommonSymptoms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/symptom-checker/common-symptoms`);
    return response.data;
  } catch (error) {
    console.error('Error getting common symptoms:', error);
    throw error;
  }
};
