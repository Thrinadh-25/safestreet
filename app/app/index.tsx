import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function IndexScreen() {
  const { state } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    if (!state.isLoading) {
      if (state.isAuthenticated) {
        router.replace('/navigation');
      } else {
        router.replace('/auth/register');
      }
    }
  }, [state.isLoading, state.isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});