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
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { LocationData, UploadItem } from '../context/UploadContext';

const { width } = Dimensions.get('window');

const UploadTab = () => {
  const { state, setCurrentImage, setCurrentLocation, addUpload, clearCurrentUpload, setUploading, updateUploadStatus } = useUpload();
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  console.log('UploadTab re-rendered', { currentUpload: state.currentUpload, isUploading: state.isUploading });

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
    }

    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos.');
    }

    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (locationPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is required to capture location data first.');
    }
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

      console.log('Setting location:', locationData);
      setCurrentLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Setting image URI:', imageUri);
        setCurrentImage(imageUri);
        try {
          await getCurrentLocation();
        } catch (error) {
          Alert.alert('Location Error', 'Could not get location. Please try manually.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera.');
      console.error('Camera error:', error);
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Setting image URI:', imageUri);
        setCurrentImage(imageUri);
        try {
          await getCurrentLocation();
        } catch (error) {
          Alert.alert('Location Error', 'Could not get location. Please try manually.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery.');
      console.error('Gallery error:', error);
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

    console.log('Starting upload:', state.currentUpload);
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

      // Simulate upload and AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate AI analysis results
      const aiResponses = [
        'Type: Pothole, Severity: High, Priority: Urgent',
        'Type: Crack, Severity: Medium, Priority: Moderate',
        'Type: Surface Wear, Severity: Low, Priority: Low',
        'Type: Edge Damage, Severity: Critical, Priority: Emergency'
      ];
      
      const randomAI = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      updateUploadStatus(uploadItem.timestamp, 'success', {
        repairStatus: 'In Progress',
        aiSummary: randomAI,
      });

      Alert.alert('Success!', 'Image uploaded successfully');
      clearCurrentUpload();
    } catch (error) {
      updateUploadStatus(uploadItem.timestamp, 'failed', {});
      Alert.alert('Upload Failed', 'Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const retryLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please check your GPS settings.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Road Image</Text>
          <Text style={styles.subtitle}>Capture road damage for analysis</Text>
        </View>

        <View style={styles.section}>
          {!state.currentUpload?.imageUri ? (
            <TouchableOpacity style={styles.uploadArea} onPress={showImagePickerOptions}>
              <Ionicons name="camera" size={48} color={Colors.gray} />
              <Text style={styles.uploadText}>Tap to add image</Text>
              <Text style={styles.uploadSubtext}>Camera or Gallery</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: state.currentUpload.imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.changeButton} onPress={() => setCurrentImage('')}>
                <Ionicons name="close-circle" size={24} color={Colors.error} />
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitle}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
          </View>

          {state.currentUpload?.location ? (
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Latitude</Text>
                <Text style={styles.locationValue}>
                  {state.currentUpload.location.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Longitude</Text>
                <Text style={styles.locationValue}>
                  {state.currentUpload.location.longitude.toFixed(6)}
                </Text>
              </View>
              {state.currentUpload.location.accuracy && (
                <View style={styles.locationRow}>
                  <Text style={styles.locationLabel}>Accuracy</Text>
                  <Text style={styles.locationValue}>
                    ±{state.currentUpload.location.accuracy.toFixed(0)}m
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.updateLocationButton} onPress={retryLocation}>
                <Ionicons name="refresh" size={16} color={Colors.primary} />
                <Text style={styles.updateLocationText}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noLocationCard}>
              <Text style={styles.noLocationText}>
                {isLoadingLocation ? 'Getting location...' : 'Location not captured'}
              </Text>
              {!isLoadingLocation && (
                <TouchableOpacity style={styles.getLocationButton} onPress={retryLocation}>
                  <Ionicons name="location" size={16} color={Colors.white} />
                  <Text style={styles.getLocationButtonText}>Get Location</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!state.currentUpload?.imageUri || !state.currentUpload?.location || state.isUploading) &&
            styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!state.currentUpload?.imageUri || !state.currentUpload?.location || state.isUploading}
        >
          {state.isUploading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color={Colors.white} />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.darkText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  uploadArea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: width - 40,
    height: 240,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
  },
  changeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkText,
    marginLeft: 8,
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: Colors.darkText,
    fontWeight: '600',
  },
  updateLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  updateLocationText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  noLocationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  noLocationText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 12,
    textAlign: 'center',
  },
  getLocationButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  getLocationButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  uploadButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UploadTab;