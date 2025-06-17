import { Stack } from 'expo-router';
import { UploadProvider } from './context/UploadContext';

export default function RootLayout() {
  return (
    <UploadProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="navigation" />
      </Stack>
    </UploadProvider>
  );
}