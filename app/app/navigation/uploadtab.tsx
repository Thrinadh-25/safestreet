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
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { LocationData, UploadItem } from '../context/UploadContext';
import { useColorScheme } from '@/components/useColorScheme';

const { width, height } = Dimensions.get('window');

const UploadTab = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { state, setCurrentImage, setCurrentLocation, addUpload, clearCurrentUpload, setUploading, updateUploadStatus } = useUpload();
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

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
      Alert.alert('Permission Required', 'Location permission is required to capture location data.');
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

      setCurrentLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    } finally {
      setIsLoadingLocation(false);
    }
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

  const InfoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInfoModal}
      onRequestClose={() => setShowInfoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>How it works</Text>
            <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Capture Image</Text>
                <Text style={[styles.stepDescription, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                  Take a photo with your camera or select from gallery
                </Text>
              </View>
            </View>

            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Auto Location</Text>
                <Text style={[styles.stepDescription, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                  Location coordinates are captured automatically
                </Text>
              </View>
            </View>

            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>AI Analysis</Text>
                <Text style={[styles.stepDescription, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                  Our AI analyzes the damage and provides recommendations
                </Text>
              </View>
            </View>

            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Track Progress</Text>
                <Text style={[styles.stepDescription, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                  Monitor your reports and repair status in the Track tab
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Upload</Text>
          <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          {!state.currentUpload?.imageUri ? (
            <View style={[styles.placeholderContainer, { backgroundColor: isDark ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground }]}>
              <Ionicons name="image-outline" size={64} color={isDark ? Colors.dark.placeholderText : Colors.light.placeholderText} />
              <Text style={[styles.placeholderText, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                No image selected
              </Text>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: state.currentUpload.imageUri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeButton} onPress={() => setCurrentImage('')}>
                <Ionicons name="close" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cameraButton, { backgroundColor: Colors.primary }]} 
            onPress={openCamera}
          >
            <Ionicons name="camera" size={24} color={Colors.white} />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.galleryButton, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground, borderColor: Colors.primary }]} 
            onPress={openGallery}
          >
            <Ionicons name="images" size={24} color={Colors.primary} />
            <Text style={[styles.buttonTextSecondary, { color: Colors.primary }]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Location Status */}
        {state.currentUpload?.imageUri && (
          <View style={styles.locationSection}>
            <View style={[styles.locationCard, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground }]}>
              <View style={styles.locationHeader}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={[styles.locationTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Location</Text>
                {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
              </View>
              
              {state.currentUpload?.location ? (
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationText, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                    {state.currentUpload.location.latitude.toFixed(6)}, {state.currentUpload.location.longitude.toFixed(6)}
                  </Text>
                  {state.currentUpload.location.accuracy && (
                    <Text style={[styles.accuracyText, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                      ±{state.currentUpload.location.accuracy.toFixed(0)}m accuracy
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.noLocationInfo}>
                  <Text style={[styles.noLocationText, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                    {isLoadingLocation ? 'Getting location...' : 'Location not available'}
                  </Text>
                  {!isLoadingLocation && (
                    <TouchableOpacity onPress={retryLocation} style={styles.retryButton}>
                      <Text style={[styles.retryText, { color: Colors.primary }]}>Retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Upload Button */}
        {state.currentUpload?.imageUri && state.currentUpload?.location && (
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                { backgroundColor: state.isUploading ? Colors.disabled : Colors.success },
              ]}
              onPress={handleUpload}
              disabled={state.isUploading}
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
        )}
      </ScrollView>

      <InfoModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  infoButton: {
    padding: 4,
  },
  imageSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  placeholderContainer: {
    height: 280,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 280,
    borderRadius: 20,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  cameraButton: {
    // Primary button styling applied via backgroundColor prop
  },
  galleryButton: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  buttonTextSecondary: {
    fontSize: 17,
    fontWeight: '600',
  },
  locationSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  locationCard: {
    borderRadius: 16,
    padding: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  locationInfo: {
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 13,
  },
  noLocationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noLocationText: {
    fontSize: 15,
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '500',
  },
  uploadSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
});

export default UploadTab;