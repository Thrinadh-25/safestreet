import React, { useState } from 'react';
import { 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface UploadData {
  id: string;
  imageUri: string;
  location: LocationData;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  aiResponse?: {
    damageType: string;
    severity: string;
    confidence: number;
    recommendations: string[];
  };
}

export default function UploadTabScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return false;
      }

      // Request media library permissions
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to select photos.');
        return false;
      }

      // Request location permissions
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required to capture coordinates.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = locationData.coords;

      // Get address from coordinates (reverse geocoding)
      try {
        const addressData = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = addressData[0] 
          ? `${addressData[0].street || ''} ${addressData[0].city || ''} ${addressData[0].region || ''}`.trim()
          : 'Address not found';

        return {
          latitude,
          longitude,
          address,
        };
      } catch (geocodeError) {
        console.warn('Geocoding failed:', geocodeError);
        return {
          latitude,
          longitude,
          address: 'Address not available',
        };
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveUploadToStorage = async (uploadInfo: UploadData) => {
    try {
      const existingUploads = await AsyncStorage.getItem('uploads');
      const uploads = existingUploads ? JSON.parse(existingUploads) : [];
      uploads.unshift(uploadInfo); // Add to beginning of array
      await AsyncStorage.setItem('uploads', JSON.stringify(uploads));
    } catch (error) {
      console.error('Error saving upload:', error);
    }
  };

  const handleImageSelection = async (imageUri: string) => {
    setSelectedImage(imageUri);
    
    // Get location after image selection
    const locationData = await getCurrentLocation();
    if (locationData) {
      setLocation(locationData);
      
      // Create upload data
      const uploadInfo: UploadData = {
        id: Date.now().toString(),
        imageUri,
        location: locationData,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      
      setUploadData(uploadInfo);
      
      // Save to AsyncStorage for tracking
      await saveUploadToStorage(uploadInfo);
      
      Alert.alert('Success', 'Image and location captured successfully! Check Track tab to monitor progress.');
    }
  };

  const openCamera = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to select an image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setLocation(null);
    setUploadData(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Road Damage</Text>
        <Text style={styles.subtitle}>Capture or select an image to report road damage</Text>
      </View>

      {!selectedImage ? (
        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
            <Text style={styles.uploadButtonText}>📷 Select Image</Text>
            <Text style={styles.uploadButtonSubtext}>Camera or Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2f95dc" />
              <Text style={styles.loadingText}>Getting location...</Text>
            </View>
          ) : location ? (
            <View style={styles.locationContainer}>
              <Text style={styles.locationTitle}>📍 Location Details</Text>
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  <Text style={styles.locationLabel}>Latitude: </Text>
                  {location.latitude.toFixed(6)}
                </Text>
                <Text style={styles.locationText}>
                  <Text style={styles.locationLabel}>Longitude: </Text>
                  {location.longitude.toFixed(6)}
                </Text>
                {location.address && (
                  <Text style={styles.locationText}>
                    <Text style={styles.locationLabel}>Address: </Text>
                    {location.address}
                  </Text>
                )}
              </View>
            </View>
          ) : null}

          {uploadData && (
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadInfoTitle}>📋 Upload Summary</Text>
              <Text style={styles.uploadInfoText}>
                <Text style={styles.uploadInfoLabel}>Captured: </Text>
                {new Date(uploadData.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.uploadInfoText}>
                <Text style={styles.uploadInfoLabel}>Status: </Text>
                Ready for processing
              </Text>
              <Text style={styles.uploadInfoText}>
                <Text style={styles.uploadInfoLabel}>ID: </Text>
                {uploadData.id}
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={resetUpload}>
              <Text style={styles.resetButtonText}>🔄 Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.selectNewButton} onPress={showImageOptions}>
              <Text style={styles.selectNewButtonText}>📷 Select New</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ How it works</Text>
        <Text style={styles.infoText}>
          1. Select an image from camera or gallery{'\n'}
          2. Location coordinates are captured automatically{'\n'}
          3. Upload is saved for tracking and processing{'\n'}
          4. Check Track tab to monitor AI analysis progress
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#2f95dc',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  previewSection: {
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 225,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  locationContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2f95dc',
  },
  locationInfo: {
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  locationLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  uploadInfo: {
    backgroundColor: '#f0fff0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#228b22',
  },
  uploadInfoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  uploadInfoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectNewButton: {
    flex: 1,
    backgroundColor: '#2f95dc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectNewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff9c4',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#b8860b',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8b7355',
  },
});