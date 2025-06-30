import { apiService } from './api';
import { ENDPOINTS } from '../config/api';
import { DashboardStats, ApiResponse } from '../types';

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<ApiResponse<DashboardStats>>(
      ENDPOINTS.DASHBOARD_STATS
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch dashboard stats');
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;