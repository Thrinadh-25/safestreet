import { API_BASE_URL, TOKEN_KEY } from '../config/constants';

// Helper: Auth + JSON headers
const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper: Handle response & errors
const handleResponse = async (response) => {
  let responseData;
  let errorData;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      errorData = responseData;
    } else {
      const textResponse = await response.text();
      try {
        responseData = JSON.parse(textResponse);
        errorData = responseData;
      } catch {
        responseData = { text: textResponse };
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          textResponse: textResponse.substring(0, 100) + '...',
        };
      }
    }
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    errorData = {
      message: `HTTP ${response.status}: ${response.statusText}`,
      parseError: true,
    };
  }

  if (!response.ok) {
    let message = errorData.message || 'An error occurred';

    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData,
    });

    switch (response.status) {
      case 400: message = errorData.message || 'Bad request.'; break;
      case 401: message = 'Unauthorized. Please log in again.'; break;
      case 403: message = 'Access denied.'; break;
      case 404: message = errorData.message || 'Resource not found.'; break;
      case 429: message = 'Too many requests. Try later.'; break;
      case 500: message = errorData.message || 'Server error.'; break;
      case 503: message = 'Service unavailable.'; break;
      default: message = errorData.message || `HTTP ${response.status}`; break;
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    error.url = response.url;
    throw error;
  }

  return responseData;
};

// Main API object
export const api = {
  get: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Fetching from:", url); // 🔍 Add this
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },


  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  postFormData: async (endpoint, formData) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData, // don't set content-type here
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

//
// Report APIs
//
export const getAllReports = () => {
  return api.get('/api/images/reports');
};

export const getReportImageUrl = (reportId) => {
  return `${API_BASE_URL}/reports/${reportId}/image`;
};

//
// ✅ Repair APIs
//
export const getAllRepairs = () => {
  return api.get('/api/repairs');
};

export const completeRepair = (repairId) => {
  return api.patch(`/api/repairs/${repairId}/complete`);
};
