import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '../../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { LocationData, UploadItem } from '../../context/UploadContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const UploadTab = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const {
    state,
    setCurrentImage,
    setCurrentLocation,
    addUpload,
    clearCurrentUpload,
    setUploading,
    updateUploadStatus,
  } = useUpload();

  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [damageType, setDamageType] = useState<string | null>(null);
  const [severityLabel, setSeverityLabel] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserEmail(user.email || null);
    }
  };

  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };

      setCurrentLocation(locationData);
      return locationData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16,9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCurrentImage(result.assets[0].uri);
      setSummary(null);
      setDamageType(null);
      setSeverityLabel(null);
      try {
        await getCurrentLocation();
      } catch {
        Alert.alert('Location Error', 'Could not get location. Please try manually.');
      }
    }
  };

    const openGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

    if (!result.canceled && result.assets[0]) {
      setCurrentImage(result.assets[0].uri);
      setSummary(null);
      setDamageType(null);
      setSeverityLabel(null);
      try {
        await getCurrentLocation();
      } catch {
        Alert.alert('Location Error', 'Could not get location. Please try manually.');
      }
    }
  };

  const handleUpload = async () => {
    if (!state.currentUpload?.imageUri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    if (!state.currentUpload?.location) {
      Alert.alert('No Location', 'Please capture location data first.');
      return;
    }

    if (!userEmail) {
      Alert.alert('Missing Email', 'Please login again to continue.');
      return;
    }

    setUploading(true);

    const uploadItem: UploadItem = {
      imageUri: state.currentUpload.imageUri,
      location: state.currentUpload.location,
      timestamp: Date.now(),
      status: 'pending',
      repairStatus: 'Reported',
      aiSummary: null,
    };

    try {
      addUpload(uploadItem);

      const formData = new FormData();
      formData.append('image', {
        uri: state.currentUpload.imageUri,
        name: `image_${uploadItem.timestamp}.jpg`,
        type: 'image/jpeg',
      } as any);
      formData.append('location', JSON.stringify(state.currentUpload.location));
      formData.append('email', userEmail); // ✅ Include the email

      const response = await axios.post(
        'http://192.168.1.3:3000/upload-and-analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 90000,
        }
      );

      const predictionData = response.data;

      setSummary(predictionData.summary || 'No summary available');
      setDamageType(predictionData.damage_type || 'Unknown');
      setSeverityLabel(predictionData.severity_label || 'Unknown');

      // ✅ Save reportId too
      updateUploadStatus(uploadItem.timestamp, 'success', {
        repairStatus: predictionData.severity_label || 'In Progress',
        aiSummary: predictionData.summary || 'No summary available',
        reportId: predictionData.reportId || null,
      });

      Alert.alert('Success!', 'Image uploaded successfully');
      clearCurrentUpload();
    } catch (error: any) {
      updateUploadStatus(uploadItem.timestamp, 'failed', {});
      if (error.response?.data?.error) {
        Alert.alert('Upload failed', error.response.data.error);
      } else {
        Alert.alert('Error', error.message || 'Upload failed.');
      }
    } finally {
      setUploading(false);
    }
  };

  const retryLocation = async () => {
    try {
      await getCurrentLocation();
    } catch {
      Alert.alert('Retry Failed', 'Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
         <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
                  <Text style={[styles.title, { color: theme.text }]}>Upload</Text>
                </View>

        {userEmail && (
          <Text style={{ color: theme.placeholderText, paddingHorizontal: 24, marginBottom: 8 }}>
            Logged in as: {userEmail}
          </Text>
        )}

        <View style={styles.imageSection}>
          {!state.currentUpload?.imageUri ? (
            <View style={[styles.placeholderContainer, { backgroundColor: theme.secondaryBackground }]}>
              <Ionicons name="image-outline" size={64} color={theme.placeholderText} />
              <Text style={[styles.placeholderText, { color: theme.placeholderText }]}>
                No image selected
              </Text>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: state.currentUpload.imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeButton} onPress={() => {
                setCurrentImage('');
                setSummary(null);
                setDamageType(null);
                setSeverityLabel(null);
              }}>
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.primary }]}
            onPress={openCamera}
          >
            <Ionicons name="camera" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: Colors.primary, borderWidth: 2 }]}
            onPress={openGallery}
          >
            <Ionicons name="images" size={20} color={Colors.primary} />
            <Text style={[styles.buttonText, { color: Colors.primary }]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {summary && (
          <View style={[styles.resultSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.resultLabel, { color: theme.text }]}>AI Summary:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{summary}</Text>
            <Text style={[styles.resultLabel, { color: theme.text }]}>Damage Type:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{damageType}</Text>
            <Text style={[styles.resultLabel, { color: theme.text }]}>Severity:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{severityLabel}</Text>
          </View>
        )}

        {state.currentUpload?.imageUri && (
          <View style={styles.locationSection}>
            <View style={[styles.locationCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.locationHeader}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={[styles.locationTitle, { color: theme.text }]}>Location</Text>
                {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
              </View>
              {state.currentUpload.location ? (
                <Text style={{ color: theme.placeholderText }}>
                  {state.currentUpload.location.latitude.toFixed(5)}, {state.currentUpload.location.longitude.toFixed(5)}
                </Text>
              ) : (
                <TouchableOpacity onPress={retryLocation}>
                  <Text style={{ color: Colors.primary }}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {state.currentUpload?.imageUri && state.currentUpload?.location && (
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                { backgroundColor: state.isUploading ? theme.placeholderText : Colors.success },
              ]}
              onPress={handleUpload}
              disabled={state.isUploading}
            >
              {state.isUploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#FFF" />
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 32, fontWeight: 'bold' },
  infoButton: { padding: 4 },
  imageSection: { paddingHorizontal: 24, marginBottom: 16 },
  placeholderContainer: {
    height: 250,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { marginTop: 12 },
  imageContainer: { borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: 250 },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 16,
  },
  buttonSection: { paddingHorizontal: 24, gap: 16 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  resultSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 4,
  },
  resultLabel: { fontWeight: '600', fontSize: 16 },
  resultText: { marginBottom: 8 },
  locationSection: { paddingHorizontal: 24, marginTop: 20 },
  locationCard: { padding: 16, borderRadius: 12 },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  locationTitle: { fontSize: 16, fontWeight: '600' },
  uploadSection: { paddingHorizontal: 24, marginTop: 20, marginBottom: 30 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  uploadButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default UploadTab;
