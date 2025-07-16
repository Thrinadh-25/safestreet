import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
import { useColorScheme } from 'react-native';

//import { useColorScheme } from '../../components/useColorScheme';


interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };


  const handleRegister = async () => {
    console.log("🧪 Registering with:");
    console.log("Full Name:", formData.fullName);
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);
    console.log("Confirm Password:", formData.confirmPassword);
    console.log("Phone:", formData.phone);

    
  

    console.log("Registering...");
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }
    console.log("Validation passed");
    
  
    setIsLoading(true);
    try {
      console.log("Sending request...");
      // TODO: Replace with actual API endpoint
<<<<<<< HEAD
      const response = await fetch('http://192.168.29.144:3000/api/auth/register', {
=======
      const response = await fetch('http://192.168.1.3:3000/api/auth/register', {
>>>>>>> back
      //const response = await fetch('YOUR_BACKEND_URL/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });
      console.log("Received response");
      
      const data = await response.json();
      
      if (response.ok) {
        // Store user token and data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        router.replace('/navigation');
      } else {
        Alert.alert('Registration Failed', data.message || 'Please try again');
      }

      // // Simulate API call for demo
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // // Mock successful registration
      // const mockUser = {
      //   id: Date.now().toString(),
      //   fullName: formData.fullName,
      //   email: formData.email,
      //   phone: formData.phone,
      //   createdAt: new Date().toISOString(),
      // };
      
      // await AsyncStorage.setItem('userToken', 'mock_token_' + Date.now());
      // await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      // Alert.alert('Success', 'Account created successfully!', [
      //   { text: 'OK', onPress: () => router.replace('/navigation') }
      // ]);
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: Colors.primary }]}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.placeholderText }]}>
            Join Safe Street to report road damage and help improve our community
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Ionicons name="person-outline" size={20} color={theme.placeholderText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your full name"
                placeholderTextColor={theme.placeholderText}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Ionicons name="mail-outline" size={20} color={theme.placeholderText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholderText}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text.toLowerCase() })}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Phone (Optional) */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Phone Number (Optional)</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Ionicons name="call-outline" size={20} color={theme.placeholderText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.placeholderText}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.placeholderText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Create a password"
                placeholderTextColor={theme.placeholderText}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={theme.placeholderText} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.placeholderText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.placeholderText}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={theme.placeholderText} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: isLoading ? theme.placeholderText : Colors.primary }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={[styles.termsText, { color: theme.placeholderText }]}>
            By creating an account, you agree to our{' '}
            <Text style={{ color: Colors.primary }}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={{ color: Colors.primary }}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.placeholderText }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
            <Text style={[styles.loginLinkText, { color: Colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
  },
  loginLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  loginLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});