# Safe Street Backend API

A comprehensive Node.js/Express backend for the Safe Street road damage reporting application with MongoDB integration, JWT authentication, file uploads, and AI processing simulation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values (see Environment Variables section below).

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify installation:**
   Visit `http://localhost:5000/api/health` to check if the API is running.

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

### Required Variables

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/safestreet
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Optional Variables

```env
# File Storage (choose one)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI Processing (future integration)
AI_MODEL_ENDPOINT=http://localhost:8000/predict
AI_MODEL_API_KEY=your-ai-api-key
```

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update user profile | Yes |
| DELETE | `/api/user/delete` | Delete user account | Yes |
| GET | `/api/user/stats` | Get user statistics | Yes |

### Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/uploads` | Create new upload | Yes |
| GET | `/api/uploads` | Get user uploads (with filters) | Yes |
| GET | `/api/uploads/:id` | Get specific upload | Yes |
| PUT | `/api/uploads/:id` | Update upload (repair status) | Yes |
| DELETE | `/api/uploads/:id` | Delete upload | Yes |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/api/dashboard/analytics` | Get analytics data | Yes |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 7 days by default (configurable via `JWT_EXPIRES_IN`).

## 📤 File Upload

### Image Upload Format

Send multipart/form-data with:
- `image`: Image file (JPEG, PNG, WebP, max 10MB)
- `location`: JSON string with location data

Example location data:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10,
  "timestamp": 1640995200000,
  "address": "123 Main St, New York, NY"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String (optional),
  profileImage: String (optional),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Uploads Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  imageUri: String,
  imageMetadata: {
    originalName: String,
    size: Number,
    mimeType: String,
    dimensions: { width: Number, height: Number }
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date,
    address: String
  },
  status: String, // 'pending', 'processing', 'success', 'failed'
  aiAnalysis: {
    damageType: String,
    severity: String,
    confidence: Number,
    recommendations: [String],
    processingTime: Number,
    modelVersion: String
  },
  repairStatus: String, // 'Reported', 'In Progress', 'Completed', 'Rejected'
  createdAt: Date,
  updatedAt: Date,
  processedAt: Date
}
```

## 🔄 Frontend Integration

### Mobile App Integration

1. **Update API configuration:**
   ```typescript
   // app/src/config/api.ts
   const API_URL = 'http://localhost:5000/api'; // Development
   // const API_URL = 'https://your-domain.com/api'; // Production
   ```

2. **The mobile app will automatically:**
   - Store JWT tokens in AsyncStorage
   - Include tokens in API requests
   - Handle authentication state
   - Process upload responses

### Web App Integration

1. **Update API configuration:**
   ```typescript
   // web/src/config/api.ts
   const API_URL = 'http://localhost:5000/api'; // Development
   // const API_URL = 'https://your-domain.com/api'; // Production
   ```

2. **The web app will automatically:**
   - Store JWT tokens in localStorage
   - Include tokens in API requests
   - Handle authentication state
   - Display dashboard data

## 🤖 AI Processing

Currently implements mock AI analysis that simulates:
- Damage type detection (Pothole, Surface Crack, etc.)
- Severity assessment (Low, Medium, High, Critical)
- Confidence scoring (80-100%)
- Repair recommendations

### Future AI Integration

To integrate with a real AI model:

1. **Set up AI service endpoint:**
   ```env
   AI_MODEL_ENDPOINT=https://your-ai-service.com/analyze
   AI_MODEL_API_KEY=your-api-key
   ```

2. **Replace mock processing in `models/Upload.js`:**
   ```javascript
   // Replace the processWithAI method with actual API calls
   ```

## 📧 Email Notifications

Configure SMTP settings to enable:
- Welcome emails for new users
- Upload processing notifications
- Repair status updates

### Gmail Setup Example

1. **Enable 2-factor authentication**
2. **Generate app password**
3. **Configure environment:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

## 🔒 Security Features

- **Password hashing** with bcrypt (12 rounds)
- **JWT token authentication** with expiration
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** with express-validator
- **File type validation** (images only)
- **File size limits** (10MB max)
- **CORS protection** with whitelist
- **Helmet.js** security headers

## 📊 Performance Optimizations

### Database Indexes
- `users.email` (unique)
- `uploads.userId`
- `uploads.status`
- `uploads.createdAt`
- Compound indexes for efficient queries

### File Storage
- Local storage for development
- Cloudinary integration ready for production
- Image compression and resizing (configurable)

## 🚀 Deployment

### Environment Setup

1. **Production environment variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/safestreet
   JWT_SECRET=your-production-secret-key
   ```

2. **Cloud storage (recommended):**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Deployment Platforms

- **Heroku**: Ready for deployment with Procfile
- **Railway**: Zero-config deployment
- **DigitalOcean**: App Platform compatible
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel**: Serverless functions (requires modifications)

## 🧪 Testing

### Manual Testing

1. **Health check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **User registration:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. **File upload:**
   ```bash
   curl -X POST http://localhost:5000/api/uploads \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "image=@path/to/image.jpg" \
     -F 'location={"latitude":40.7128,"longitude":-74.0060}'
   ```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection failed:**
   - Check if MongoDB is running
   - Verify MONGODB_URI in .env
   - Check network connectivity

2. **JWT token errors:**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **File upload errors:**
   - Check file size (max 10MB)
   - Verify file type (JPEG, PNG, WebP only)
   - Ensure uploads directory exists and is writable

4. **CORS errors:**
   - Add your frontend URL to CORS whitelist
   - Check if credentials are included in requests

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - User authentication
  - File uploads
  - Mock AI processing
  - Dashboard statistics

## 📞 Support

For issues and questions:
1. Check this README
2. Review error logs
3. Verify environment configuration
4. Test with provided curl examples

---

**Note**: This backend is designed to work seamlessly with the Safe Street mobile and web applications. The frontend apps are pre-configured to work with this API structure.