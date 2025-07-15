import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';


function TabBarIcon({ name, color }: { name: any; color: string }) {
  return <FontAwesome name={name} size={24} color={color} />;
}

export default function Layout() {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = Colors?.[scheme] ?? Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen name="uploadtab" options={{ title: 'Upload', tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} /> }} />
      <Tabs.Screen name="tracktab" options={{ title: 'Track', tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} /> }} />
      <Tabs.Screen name="settingstab" options={{ title: 'Settings', tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} /> }} />
    </Tabs>
  );
}