// app/navigation/index.tsx
import { Redirect } from 'expo-router';

export default function NavigationIndex() {
    console.log("✅ index is rendering");
  // Redirect to the default tab, e.g. track tab
  return <Redirect href="/auth/login" />;
}
