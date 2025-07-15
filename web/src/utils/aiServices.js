import { api } from './api';
import { API_ENDPOINTS } from '../config/constants';

export const aiServices = {
  generateDamageSummary: async (details) => {
    try {
      const { location, damageType, severity, priority } = details;
      
      // Validate required fields
      if (!location || !damageType || !severity || !priority) {
        throw new Error('Missing required details for summary generation');
      }
      
      const response = await api.post(`${API_ENDPOINTS.AI}/generate-summary`, {
        location,
        damageType,
        severity,
        priority
      });
      
      if (typeof response === 'string') {
        // If the response is a direct string (the summary text)
        return { summary: response, success: true };
      } else if (response?.summary) {
        // If the response has a summary property directly
        return { summary: response.summary, success: true };
      } else if (response?.data?.summary) {
        // If the response is wrapped in a data object
        return response.data;
      } else {
        throw new Error('Invalid response format from the server');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }
};
