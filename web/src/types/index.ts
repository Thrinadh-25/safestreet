export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  address?: string;
}

export interface AIAnalysis {
  damageType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  recommendations: string[];
  processingTime: number;
  modelVersion: string;
}

export interface Upload {
  id: string;
  userId: string;
  user?: User;
  imageUri: string;
  imageMetadata: {
    originalName: string;
    size: number;
    mimeType: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
  location: LocationData;
  status: 'pending' | 'processing' | 'success' | 'failed';
  aiAnalysis?: AIAnalysis;
  repairStatus: 'Reported' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface DashboardStats {
  totalUploads: number;
  pendingReports: number;
  completedRepairs: number;
  criticalIssues: number;
  recentUploads: Upload[];
  damageTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  severityDistribution: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    uploads: number;
    completed: number;
  }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}