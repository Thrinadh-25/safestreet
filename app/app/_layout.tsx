import { Stack } from 'expo-router';
import { UploadProvider } from '../context/UploadContext';
import { AuthProvider } from '../context/AuthContext'; // If you're using auth

export default function RootLayout() {
  return (
    <AuthProvider>
      <UploadProvider>
        <Stack />
      </UploadProvider>
    </AuthProvider>
  );
}

