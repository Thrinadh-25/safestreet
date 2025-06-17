import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
    </Stack>
  );
}