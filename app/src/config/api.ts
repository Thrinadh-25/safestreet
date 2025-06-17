const API_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://production-url.com/api';

export default API_URL;

// This file contains the API URL configuration for the application.

// Placeholder for backend API calls
export const uploadImage = async (imageUri: string, latitude: string, longitude: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    success: true,
    repairStatus: 'In Progress',
    aiSummary: 'Type: Pothole, Severity: High, Priority: Urgent',
  };
};