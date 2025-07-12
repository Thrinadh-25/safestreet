// import { Slot } from "expo-router";
// import { SafeAreaView } from "react-native";

// export default function Layout() {
//   console.log("✅ Layout is rendering");
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Slot />
//     </SafeAreaView>
//   );
// }


// import { Stack } from "expo-router";

// export default function Layout() {
//   console.log("✅ Layout is rendering");
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false, // Hide headers for all screens
//       }}
//     />
//   );
// }
// app/_layout.tsx
// import { Stack } from 'expo-router';
// import { UploadProvider } from '../context/UploadContext'; 
// console.log("✅ Layout is rendering");// adjust path if needed

// export default function RootLayout() {
//   return (
//     <UploadProvider>
//       <Stack />
//     </UploadProvider>
//   );
// }
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



