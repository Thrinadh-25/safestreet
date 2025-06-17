# Safe Street Backend - MongoDB Integration Guide

## Overview
This document outlines the backend structure and MongoDB integration points for the Safe Street application.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String (optional),
  profileImage: String (optional),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  lastLogin: Date,
  deletedAt: Date (optional, for soft delete)
}
```

### Uploads Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  imageUri: String, // URL to stored image
  imageMetadata: {
    originalName: String,
    size: Number,
    mimeType: String,
    dimensions: {
      width: Number,
      height: Number
    }
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date,
    address: String (optional)
  },
  status: String, // 'pending', 'processing', 'success', 'failed'
  aiAnalysis: {
    damageType: String,
    severity: String, // 'Low', 'Medium', 'High', 'Critical'
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

## Required API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```javascript
// Request Body
{
  fullName: String,
  email: String,
  password: String,
  phone: String (optional)
}

// Response
{
  success: Boolean,
  message: String,
  user: {
    id: String,
    fullName: String,
    email: String,
    phone: String,
    createdAt: String
  },
  token: String
}
```

#### POST /api/auth/login
```javascript
// Request Body
{
  email: String,
  password: String
}

// Response
{
  success: Boolean,
  message: String,
  user: {
    id: String,
    fullName: String,
    email: String,
    phone: String,
    createdAt: String
  },
  token: String
}
```

#### POST /api/auth/logout
```javascript
// Headers: Authorization: Bearer <token>
// Response
{
  success: Boolean,
  message: String
}
```

### Upload Endpoints

#### POST /api/uploads
```javascript
// Headers: Authorization: Bearer <token>
// Content-Type: multipart/form-data

// Form Data
{
  image: File,
  location: JSON String {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Number
  }
}

// Response
{
  success: Boolean,
  message: String,
  upload: {
    id: String,
    imageUri: String,
    location: Object,
    status: String,
    createdAt: String
  }
}
```

#### GET /api/uploads
```javascript
// Headers: Authorization: Bearer <token>
// Query Parameters: ?page=1&limit=10&status=all

// Response
{
  success: Boolean,
  uploads: [
    {
      id: String,
      imageUri: String,
      location: Object,
      status: String,
      aiAnalysis: Object,
      repairStatus: String,
      createdAt: String,
      updatedAt: String
    }
  ],
  pagination: {
    currentPage: Number,
    totalPages: Number,
    totalItems: Number,
    hasNext: Boolean,
    hasPrev: Boolean
  }
}
```

#### GET /api/uploads/:id
```javascript
// Headers: Authorization: Bearer <token>

// Response
{
  success: Boolean,
  upload: {
    id: String,
    imageUri: String,
    location: Object,
    status: String,
    aiAnalysis: Object,
    repairStatus: String,
    createdAt: String,
    updatedAt: String
  }
}
```

#### DELETE /api/uploads/:id
```javascript
// Headers: Authorization: Bearer <token>

// Response
{
  success: Boolean,
  message: String
}
```

### User Profile Endpoints

#### GET /api/user/profile
```javascript
// Headers: Authorization: Bearer <token>

// Response
{
  success: Boolean,
  user: {
    id: String,
    fullName: String,
    email: String,
    phone: String,
    profileImage: String,
    createdAt: String
  }
}
```

#### PUT /api/user/profile
```javascript
// Headers: Authorization: Bearer <token>
// Request Body
{
  fullName: String (optional),
  phone: String (optional),
  profileImage: String (optional)
}

// Response
{
  success: Boolean,
  message: String,
  user: Object
}
```

#### DELETE /api/user/delete
```javascript
// Headers: Authorization: Bearer <token>

// Response
{
  success: Boolean,
  message: String
}

// Implementation Notes:
// 1. This should perform a hard delete of the user account
// 2. Delete all associated uploads and images from storage
// 3. Remove all user data from the database
// 4. Invalidate all user tokens
// 5. Send confirmation email (optional)
// 6. Log the deletion for audit purposes
```

## File Storage Integration

### Image Upload Process
1. **Client uploads image** to `/api/uploads` endpoint
2. **Server processes image**:
   - Validate file type and size
   - Generate unique filename
   - Store in cloud storage (AWS S3, Cloudinary, etc.)
   - Save metadata to MongoDB
3. **Return image URL** to client
4. **Trigger AI processing** (background job)

### Recommended Storage Structure
```
/uploads/
  /{userId}/
    /{year}/
      /{month}/
        /{uploadId}.{extension}
```

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/safestreet
MONGODB_DB_NAME=safestreet

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=safestreet-uploads
AWS_REGION=us-east-1

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Processing
AI_MODEL_ENDPOINT=http://localhost:8000/predict
AI_MODEL_API_KEY=your-ai-api-key

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Implementation Notes

### Security Considerations
1. **Password Hashing**: Use bcrypt with salt rounds >= 12
2. **JWT Tokens**: Include user ID and expiration
3. **File Validation**: Check file type, size, and scan for malware
4. **Rate Limiting**: Implement upload limits per user/hour
5. **Input Validation**: Sanitize all user inputs
6. **Account Deletion**: Implement secure account deletion with proper data cleanup

### Account Deletion Implementation
```javascript
// Example implementation for DELETE /api/user/delete
app.delete('/api/user/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get all user uploads to delete associated files
    const uploads = await Upload.find({ userId });
    
    // 2. Delete all images from cloud storage
    for (const upload of uploads) {
      await deleteFromCloudStorage(upload.imageUri);
    }
    
    // 3. Delete all uploads from database
    await Upload.deleteMany({ userId });
    
    // 4. Delete user account
    await User.findByIdAndDelete(userId);
    
    // 5. Invalidate all user tokens (if using token blacklist)
    await TokenBlacklist.create({ token: req.token });
    
    // 6. Log deletion for audit
    console.log(`User account deleted: ${userId} at ${new Date()}`);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});
```

### Performance Optimizations
1. **Database Indexing**:
   - Index on `users.email`
   - Index on `uploads.userId`
   - Index on `uploads.createdAt`
   - Compound index on `uploads.userId + uploads.status`

2. **Image Processing**:
   - Resize images before storage
   - Generate thumbnails for list views
   - Use CDN for image delivery

3. **Caching**:
   - Cache user sessions
   - Cache frequently accessed uploads
   - Use Redis for session storage

### AI Integration
1. **Background Processing**: Use job queues (Bull, Agenda)
2. **Webhook Updates**: Notify client when AI processing completes
3. **Fallback Handling**: Handle AI service failures gracefully
4. **Model Versioning**: Track which AI model version processed each upload

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install express mongoose bcryptjs jsonwebtoken multer
   npm install aws-sdk cloudinary nodemailer
   ```

2. **Setup Database Connection**:
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   ```

3. **Create Models** (User, Upload schemas)
4. **Implement Authentication Middleware**
5. **Setup File Upload Handling**
6. **Create API Routes**
7. **Add Error Handling & Validation**
8. **Setup AI Processing Pipeline**
9. **Implement Account Deletion Endpoint**

## Frontend Integration Points

The mobile app expects these specific response formats and will make requests to these endpoints. Ensure your backend implementation matches the expected API contract outlined above.

### Key Integration Points:
- **Authentication**: Login/Register screens use auth endpoints
- **Image Upload**: Upload tab uses multipart form upload
- **Data Sync**: Track tab fetches user uploads
- **Profile Management**: Settings tab manages user profile
- **Account Deletion**: Settings tab calls delete endpoint with proper confirmation

Make sure to handle CORS properly for web clients and implement proper error responses with appropriate HTTP status codes.

### Account Deletion Security Notes:
- Require user to be authenticated
- Implement confirmation mechanism (typing confirmation text)
- Log all deletion attempts for security audit
- Consider implementing a grace period for account recovery
- Send confirmation email after successful deletion
- Ensure all associated data is properly cleaned up