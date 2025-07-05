import { API_BASE_URL, TOKEN_KEY } from '../config/constants';

const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  let responseData;
  let errorData;
  
  try {
    // Try to parse as JSON first
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      errorData = responseData;
    } else {
      // Handle non-JSON responses
      const textResponse = await response.text();
      console.warn('Non-JSON response received:', textResponse.substring(0, 100) + '...');
      
      // Try to convert text to JSON if possible
      try {
        responseData = JSON.parse(textResponse);
        errorData = responseData;
      } catch (jsonError) {
        responseData = { text: textResponse };
        errorData = { 
          message: `HTTP ${response.status}: ${response.statusText}`,
          textResponse: textResponse.substring(0, 100) + '...'
        };
      }
    }
  } catch (parseError) {
    // If we can't parse response, create a generic error object
    console.error('Error parsing response:', parseError);
    errorData = { 
      message: `HTTP ${response.status}: ${response.statusText}`,
      parseError: true
    };
  }

  if (!response.ok) {
    // Create more detailed error messages based on status codes
    let message = errorData.message || 'An error occurred';
    
    // Log detailed error information
    console.error('API Error:', { 
      status: response.status, 
      statusText: response.statusText,
      url: response.url,
      errorData
    });
    
    switch (response.status) {
      case 400:
        message = errorData.message || 'Bad request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please log in again.';
        break;
      case 403:
        message = 'Access denied.';
        break;
      case 404:
        message = errorData.message || `Resource not found: ${response.url.split('/').slice(-2).join('/')}`;
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = errorData.message || 'Server error. Please try again.';
        break;
      case 503:
        message = 'Service temporarily unavailable.';
        break;
      default:
        message = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    }
    
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    error.url = response.url;
    throw error;
  }
  
  return responseData;
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      console.log(`API POST request to ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  // Special method for FormData upload that doesn't set Content-Type header
  // (browser will set it correctly with boundary)
  postFormData: async (endpoint, formData) => {
    try {
      console.log(`API FormData POST request to ${API_BASE_URL}${endpoint}`);
      
      const token = localStorage.getItem(TOKEN_KEY);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // Don't set Content-Type here - browser will set it with boundary parameter

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`API FormData POST error for ${endpoint}:`, error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },
  
  patch: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  },
};