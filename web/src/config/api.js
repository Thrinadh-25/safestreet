const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'https://production-url.com/api';

export default API_URL;