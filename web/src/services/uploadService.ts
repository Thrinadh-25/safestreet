import { apiService } from './api';
import { ENDPOINTS } from '../config/api';
import { Upload, ApiResponse, PaginatedResponse } from '../types';

export interface UploadFilters {
  status?: string;
  severity?: string;
  damageType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface UploadListParams extends UploadFilters {
  page?: number;
  limit?: number;
}

class UploadService {
  async getUploads(params: UploadListParams = {}): Promise<PaginatedResponse<Upload>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${ENDPOINTS.UPLOADS}?${queryParams.toString()}`;
    return await apiService.get<PaginatedResponse<Upload>>(url);
  }

  async getUpload(id: string): Promise<Upload> {
    const response = await apiService.get<ApiResponse<Upload>>(
      ENDPOINTS.UPLOAD_DETAIL(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch upload');
  }

  async deleteUpload(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<void>>(
      ENDPOINTS.DELETE_UPLOAD(id)
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete upload');
    }
  }

  async updateRepairStatus(id: string, status: string): Promise<Upload> {
    const response = await apiService.put<ApiResponse<Upload>>(
      ENDPOINTS.UPLOAD_DETAIL(id),
      { repairStatus: status }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update repair status');
  }

  async exportUploads(filters: UploadFilters = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${ENDPOINTS.UPLOADS}/export?${queryParams.toString()}`;
    const response = await apiService.get<Blob>(url);
    return response;
  }
}

export const uploadService = new UploadService();
export default uploadService;