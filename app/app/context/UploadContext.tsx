import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

export interface UploadItem {
  imageUri: string;
  location: LocationData;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  repairStatus: 'Reported' | 'In Progress' | 'Completed';
  aiSummary: string | null;
}

interface CurrentUpload {
  imageUri: string | null;
  location: LocationData | null;
}

interface UploadContextType {
  state: {
    uploads: UploadItem[];
    currentUpload: CurrentUpload | null;
    isUploading: boolean;
  };
  setCurrentImage: (imageUri: string | null) => void;
  setCurrentLocation: (location: LocationData | null) => void;
  addUpload: (upload: UploadItem) => void;
  clearCurrentUpload: () => void;
  setUploading: (uploading: boolean) => void;
  updateUploadStatus: (
    timestamp: number,
    status: 'success' | 'failed',
    updates: { repairStatus?: 'Reported' | 'In Progress' | 'Completed'; aiSummary?: string }
  ) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [currentUpload, setCurrentUpload] = useState<CurrentUpload | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const setCurrentImage = (imageUri: string | null) => {
    setCurrentUpload((prev) => {
      const base = prev || { imageUri: null, location: null };
      return {
        ...base,
        imageUri,
      };
    });
  };

  const setCurrentLocation = (location: LocationData | null) => {
    setCurrentUpload((prev) => {
      const base = prev || { imageUri: null, location: null };
      return {
        ...base,
        location,
      };
    });
  };

  const addUpload = (upload: UploadItem) => {
    setUploads((prev) => [...prev, upload]);
  };

  const clearCurrentUpload = () => {
    setCurrentUpload(null);
  };

  const updateUploadStatus = (
    timestamp: number,
    status: 'success' | 'failed',
    updates: { repairStatus?: 'Reported' | 'In Progress' | 'Completed'; aiSummary?: string }
  ) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.timestamp === timestamp
          ? { ...upload, status, ...updates }
          : upload
      )
    );
  };

  return (
    <UploadContext.Provider
      value={{
        state: { uploads, currentUpload, isUploading },
        setCurrentImage,
        setCurrentLocation,
        addUpload,
        clearCurrentUpload,
        setUploading: setIsUploading,
        updateUploadStatus,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

export { UploadContext };