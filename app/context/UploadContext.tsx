// import React, { createContext, useContext, useReducer, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export interface LocationData {
//   latitude: number;
//   longitude: number;
//   accuracy?: number;
//   timestamp?: number;
//   address?: string;
// }

// export interface UploadItem {
//   imageUri: string;
//   location: LocationData;
//   timestamp: number;
//   status: 'pending' | 'processing' | 'success' | 'failed';
//   repairStatus: string;
//   aiSummary: string | null;
//   id?: string;
// }

// export interface CurrentUpload {
//   imageUri?: string;
//   location?: LocationData;
// }

// interface UploadState {
//   uploads: UploadItem[];
//   currentUpload: CurrentUpload | null;
//   isUploading: boolean;
// }

// type UploadAction =
//   | { type: 'SET_UPLOADS'; payload: UploadItem[] }
//   | { type: 'ADD_UPLOAD'; payload: UploadItem }
//   | { type: 'SET_CURRENT_IMAGE'; payload: string }
//   | { type: 'SET_CURRENT_LOCATION'; payload: LocationData }
//   | { type: 'CLEAR_CURRENT_UPLOAD' }
//   | { type: 'SET_UPLOADING'; payload: boolean }
//   | { type: 'UPDATE_UPLOAD_STATUS'; payload: { timestamp: number; status: string; updates: Partial<UploadItem> } };

// const initialState: UploadState = {
//   uploads: [],
//   currentUpload: null,
//   isUploading: false,
// };

// const uploadReducer = (state: UploadState, action: UploadAction): UploadState => {
//   switch (action.type) {
//     case 'SET_UPLOADS':
//       return { ...state, uploads: action.payload };
    
//     case 'ADD_UPLOAD':
//       const newUpload = { ...action.payload, id: action.payload.timestamp.toString() };
//       const updatedUploads = [newUpload, ...state.uploads];
//       // Save to AsyncStorage
//       AsyncStorage.setItem('uploads', JSON.stringify(updatedUploads)).catch(console.error);
//       return { ...state, uploads: updatedUploads };
    
//     case 'SET_CURRENT_IMAGE':
//       return {
//         ...state,
//         currentUpload: {
//           ...state.currentUpload,
//           imageUri: action.payload,
//         },
//       };
    
//     case 'SET_CURRENT_LOCATION':
//       return {
//         ...state,
//         currentUpload: {
//           ...state.currentUpload,
//           location: action.payload,
//         },
//       };
    
//     case 'CLEAR_CURRENT_UPLOAD':
//       return { ...state, currentUpload: null };
    
//     case 'SET_UPLOADING':
//       return { ...state, isUploading: action.payload };
    
//     case 'UPDATE_UPLOAD_STATUS':
//       const updatedUploadsStatus = state.uploads.map(upload =>
//         upload.timestamp === action.payload.timestamp
//           ? { ...upload, status: action.payload.status as any, ...action.payload.updates }
//           : upload
//       );
//       // Save to AsyncStorage
//       AsyncStorage.setItem('uploads', JSON.stringify(updatedUploadsStatus)).catch(console.error);
//       return { ...state, uploads: updatedUploadsStatus };
    
//     default:
//       return state;
//   }
// };

// interface UploadContextType {
//   state: UploadState;
//   setUploads: (uploads: UploadItem[]) => void;
//   addUpload: (upload: UploadItem) => void;
//   setCurrentImage: (imageUri: string) => void;
//   setCurrentLocation: (location: LocationData) => void;
//   clearCurrentUpload: () => void;
//   setUploading: (isUploading: boolean) => void;
//   updateUploadStatus: (timestamp: number, status: string, updates: Partial<UploadItem>) => void;
// }

// const UploadContext = createContext<UploadContextType | undefined>(undefined);

// export const UploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(uploadReducer, initialState);

//   // Load uploads from AsyncStorage on mount
//   React.useEffect(() => {
//     const loadUploads = async () => {
//       try {
//         const storedUploads = await AsyncStorage.getItem('uploads');
//         if (storedUploads) {
//           dispatch({ type: 'SET_UPLOADS', payload: JSON.parse(storedUploads) });
//         }
//       } catch (error) {
//         console.error('Error loading uploads:', error);
//       }
//     };
//     loadUploads();
//   }, []);

//   const contextValue: UploadContextType = {
//     state,
//     setUploads: (uploads) => dispatch({ type: 'SET_UPLOADS', payload: uploads }),
//     addUpload: (upload) => dispatch({ type: 'ADD_UPLOAD', payload: upload }),
//     setCurrentImage: (imageUri) => dispatch({ type: 'SET_CURRENT_IMAGE', payload: imageUri }),
//     setCurrentLocation: (location) => dispatch({ type: 'SET_CURRENT_LOCATION', payload: location }),
//     clearCurrentUpload: () => dispatch({ type: 'CLEAR_CURRENT_UPLOAD' }),
//     setUploading: (isUploading) => dispatch({ type: 'SET_UPLOADING', payload: isUploading }),
//     updateUploadStatus: (timestamp, status, updates) => 
//       dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: { timestamp, status, updates } }),
//   };

//   return (
//     <UploadContext.Provider value={contextValue}>
//       {children}
//     </UploadContext.Provider>
//   );
// };

// export const useUpload = (): UploadContextType => {
//   const context = useContext(UploadContext);
//   if (!context) {
//     throw new Error('useUpload must be used within an UploadProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  address?: string;
}

export interface UploadItem {
  imageUri: string;
  location: LocationData;
  timestamp: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  repairStatus: string;
  aiSummary: string | null;
  id?: string;
  reportId?: string; // ✅ Added reportId field
}

export interface CurrentUpload {
  imageUri?: string;
  location?: LocationData;
}

interface UploadState {
  uploads: UploadItem[];
  currentUpload: CurrentUpload | null;
  isUploading: boolean;
}

type UploadAction =
  | { type: 'SET_UPLOADS'; payload: UploadItem[] }
  | { type: 'ADD_UPLOAD'; payload: UploadItem }
  | { type: 'SET_CURRENT_IMAGE'; payload: string }
  | { type: 'SET_CURRENT_LOCATION'; payload: LocationData }
  | { type: 'CLEAR_CURRENT_UPLOAD' }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | {
      type: 'UPDATE_UPLOAD_STATUS';
      payload: {
        timestamp: number;
        status: string;
        updates: Partial<UploadItem>;
      };
    };

const initialState: UploadState = {
  uploads: [],
  currentUpload: null,
  isUploading: false,
};

const uploadReducer = (state: UploadState, action: UploadAction): UploadState => {
  switch (action.type) {
    case 'SET_UPLOADS':
      return { ...state, uploads: action.payload };

    case 'ADD_UPLOAD':
      const newUpload = { ...action.payload, id: action.payload.timestamp.toString() };
      const updatedUploads = [newUpload, ...state.uploads];
      AsyncStorage.setItem('uploads', JSON.stringify(updatedUploads)).catch(console.error);
      return { ...state, uploads: updatedUploads };

    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentUpload: {
          ...state.currentUpload,
          imageUri: action.payload,
        },
      };

    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        currentUpload: {
          ...state.currentUpload,
          location: action.payload,
        },
      };

    case 'CLEAR_CURRENT_UPLOAD':
      return { ...state, currentUpload: null };

    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };

    case 'UPDATE_UPLOAD_STATUS':
      const updatedUploadsStatus = state.uploads.map((upload) =>
        upload.timestamp === action.payload.timestamp
          ? { ...upload, status: action.payload.status as any, ...action.payload.updates }
          : upload
      );
      AsyncStorage.setItem('uploads', JSON.stringify(updatedUploadsStatus)).catch(console.error);
      return { ...state, uploads: updatedUploadsStatus };

    default:
      return state;
  }
};

interface UploadContextType {
  state: UploadState;
  setUploads: (uploads: UploadItem[]) => void;
  addUpload: (upload: UploadItem) => void;
  setCurrentImage: (imageUri: string) => void;
  setCurrentLocation: (location: LocationData) => void;
  clearCurrentUpload: () => void;
  setUploading: (isUploading: boolean) => void;
  updateUploadStatus: (timestamp: number, status: string, updates: Partial<UploadItem>) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  React.useEffect(() => {
    const loadUploads = async () => {
      try {
        const storedUploads = await AsyncStorage.getItem('uploads');
        if (storedUploads) {
          dispatch({ type: 'SET_UPLOADS', payload: JSON.parse(storedUploads) });
        }
      } catch (error) {
        console.error('Error loading uploads:', error);
      }
    };
    loadUploads();
  }, []);

  const contextValue: UploadContextType = {
    state,
    setUploads: (uploads) => dispatch({ type: 'SET_UPLOADS', payload: uploads }),
    addUpload: (upload) => dispatch({ type: 'ADD_UPLOAD', payload: upload }),
    setCurrentImage: (imageUri) => dispatch({ type: 'SET_CURRENT_IMAGE', payload: imageUri }),
    setCurrentLocation: (location) => dispatch({ type: 'SET_CURRENT_LOCATION', payload: location }),
    clearCurrentUpload: () => dispatch({ type: 'CLEAR_CURRENT_UPLOAD' }),
    setUploading: (isUploading) => dispatch({ type: 'SET_UPLOADING', payload: isUploading }),
    updateUploadStatus: (timestamp, status, updates) =>
      dispatch({ type: 'UPDATE_UPLOAD_STATUS', payload: { timestamp, status, updates } }),
  };

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>;
};

export const useUpload = (): UploadContextType => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};
