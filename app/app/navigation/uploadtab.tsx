
//doesnt work (new ui)
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   Pressable,
// } from 'react-native';
// import { useColorScheme } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import { Ionicons } from '@expo/vector-icons';
// import { useUpload } from '../../context/UploadContext';
// import  {Colors}  from '../../constants/Colors';
// import { LocationData, UploadItem } from '../../context/UploadContext';


// //import { useColorScheme } from '../../components/useColorScheme';

// const { width, height } = Dimensions.get('window');

// const UploadTab = () => {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const theme = isDark ? Colors.dark : Colors.light;
  
//   const { state, setCurrentImage, setCurrentLocation, addUpload, clearCurrentUpload, setUploading, updateUploadStatus } = useUpload();
//   const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
//   const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
//     if (cameraPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Camera permission is required to take photos.');
//     }

//     const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (mediaPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Media library permission is required to select photos.');
//     }

//     const locationPermission = await Location.requestForegroundPermissionsAsync();
//     if (locationPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Location permission is required to capture location data.');
//     }
//   };

//   const getCurrentLocation = async () => {
//     setIsLoadingLocation(true);
//     try {
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//         timeInterval: 5000,
//       });

//       const locationData: LocationData = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         accuracy: location.coords.accuracy,
//         timestamp: location.timestamp,
//       };

//       setCurrentLocation(locationData);
//       return locationData;
//     } catch (error) {
//       console.error('Location error:', error);
//       throw error;
//     } finally {
//       setIsLoadingLocation(false);
//     }
//   };

//   const openCamera = async () => {
//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageUri = result.assets[0].uri;
//         setCurrentImage(imageUri);
//         try {
//           await getCurrentLocation();
//         } catch (error) {
//           Alert.alert('Location Error', 'Could not get location. Please try manually.');
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to open camera.');
//       console.error('Camera error:', error);
//     }
//   };

//   const openGallery = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageUri = result.assets[0].uri;
//         setCurrentImage(imageUri);
//         try {
//           await getCurrentLocation();
//         } catch (error) {
//           Alert.alert('Location Error', 'Could not get location. Please try manually.');
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to open gallery.');
//       console.error('Gallery error:', error);
//     }
//   };

//   const handleUpload = async () => {
//     if (!state.currentUpload?.imageUri) {
//       Alert.alert('No Image', 'Please select an image first.');
//       return;
//     }

//     if (!state.currentUpload?.location) {
//       Alert.alert('No Location', 'Please capture location data first.');
//       return;
//     }

//     setUploading(true);

//     const uploadItem: UploadItem = {
//       imageUri: state.currentUpload.imageUri,
//       location: state.currentUpload.location,
//       timestamp: Date.now(),
//       status: 'pending',
//       repairStatus: 'Reported',
//       aiSummary: null,
//     };

//     try {
//       addUpload(uploadItem);

//       // Simulate upload and AI processing
//       await new Promise((resolve) => setTimeout(resolve, 2000));
      
//       // Simulate AI analysis results
//       const aiResponses = [
//         'Type: Pothole, Severity: High, Priority: Urgent',
//         'Type: Crack, Severity: Medium, Priority: Moderate',
//         'Type: Surface Wear, Severity: Low, Priority: Low',
//         'Type: Edge Damage, Severity: Critical, Priority: Emergency'
//       ];
      
//       const randomAI = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
//       updateUploadStatus(uploadItem.timestamp, 'success', {
//         repairStatus: 'In Progress',
//         aiSummary: randomAI,
//       });

//       Alert.alert('Success!', 'Image uploaded successfully');
//       clearCurrentUpload();
//     } catch (error) {
//       updateUploadStatus(uploadItem.timestamp, 'failed', {});
//       Alert.alert('Upload Failed', 'Please try again.');
//       console.error('Upload error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const retryLocation = async () => {
//     try {
//       await getCurrentLocation();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to get location. Please check your GPS settings.');
//     }
//   };

//   const InfoModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={showInfoModal}
//       onRequestClose={() => setShowInfoModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <Pressable style={styles.modalOverlay} onPress={() => setShowInfoModal(false)}>
//           <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
//             <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
//               <Text style={[styles.modalTitle, { color: theme.text }]}>How it works</Text>
//               <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.closeButton}>
//                 <Ionicons name="close" size={24} color={theme.text} />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>1</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Capture Image</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Take a photo with your camera or select from gallery
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>2</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Auto Location</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Location coordinates are captured automatically
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>3</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>AI Analysis</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Our AI analyzes the damage and provides recommendations
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>4</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Track Progress</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Monitor your reports and repair status in the Track tab
//                   </Text>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </Pressable>
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
//           <Text style={[styles.title, { color: theme.text }]}>Upload</Text>
//           <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.infoButton}>
//             <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Image Section */}
//         <View style={styles.imageSection}>
//           {!state.currentUpload?.imageUri ? (
//             <View style={[styles.placeholderContainer, { backgroundColor: theme.secondaryBackground }]}>
//               <Ionicons name="image-outline" size={64} color={theme.placeholderText} />
//               <Text style={[styles.placeholderText, { color: theme.placeholderText }]}>
//                 No image selected
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.imageContainer}>
//               <Image source={{ uri: state.currentUpload.imageUri }} style={styles.previewImage} />
//               <TouchableOpacity style={styles.removeButton} onPress={() => setCurrentImage('')}>
//                 <Ionicons name="close" size={20} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.buttonSection}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.cameraButton, { backgroundColor: Colors.primary }]} 
//             onPress={openCamera}
//           >
//             <Ionicons name="camera" size={24} color="#FFFFFF" />
//             <Text style={styles.buttonText}>Camera</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionButton, styles.galleryButton, { backgroundColor: theme.cardBackground, borderColor: Colors.primary }]} 
//             onPress={openGallery}
//           >
//             <Ionicons name="images" size={24} color={Colors.primary} />
//             <Text style={[styles.buttonTextSecondary, { color: Colors.primary }]}>Gallery</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Location Status */}
//         {state.currentUpload?.imageUri && (
//           <View style={styles.locationSection}>
//             <View style={[styles.locationCard, { backgroundColor: theme.cardBackground }]}>
//               <View style={styles.locationHeader}>
//                 <Ionicons name="location" size={20} color={Colors.primary} />
//                 <Text style={[styles.locationTitle, { color: theme.text }]}>Location</Text>
//                 {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
//               </View>
              
//               {state.currentUpload?.location ? (
//                 <View style={styles.locationInfo}>
//                   <Text style={[styles.locationText, { color: theme.placeholderText }]}>
//                     {state.currentUpload.location.latitude.toFixed(6)}, {state.currentUpload.location.longitude.toFixed(6)}
//                   </Text>
//                   {state.currentUpload.location.accuracy && (
//                     <Text style={[styles.accuracyText, { color: theme.placeholderText }]}>
//                       ±{state.currentUpload.location.accuracy.toFixed(0)}m accuracy
//                     </Text>
//                   )}
//                 </View>
//               ) : (
//                 <View style={styles.noLocationInfo}>
//                   <Text style={[styles.noLocationText, { color: theme.placeholderText }]}>
//                     {isLoadingLocation ? 'Getting location...' : 'Location not available'}
//                   </Text>
//                   {!isLoadingLocation && (
//                     <TouchableOpacity onPress={retryLocation} style={styles.retryButton}>
//                       <Text style={[styles.retryText, { color: Colors.primary }]}>Retry</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               )}
//             </View>
//           </View>
//         )}

//         {/* Upload Button */}
//         {state.currentUpload?.imageUri && state.currentUpload?.location && (
//           <View style={styles.uploadSection}>
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 { backgroundColor: state.isUploading ? theme.placeholderText : Colors.success },
//               ]}
//               onPress={handleUpload}
//               disabled={state.isUploading}
//             >
//               {state.isUploading ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <>
//                   <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
//                   <Text style={styles.uploadButtonText}>Upload</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       <InfoModal />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 32,
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: '700',
//     letterSpacing: -0.5,
//   },
//   infoButton: {
//     padding: 4,
//   },
//   imageSection: {
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   placeholderContainer: {
//     height: 280,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 12,
//   },
//   imageContainer: {
//     position: 'relative',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   previewImage: {
//     width: '100%',
//     height: 280,
//     borderRadius: 20,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 16,
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonSection: {
//     paddingHorizontal: 24,
//     gap: 16,
//     marginBottom: 32,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//     gap: 12,
//   },
//   cameraButton: {
//     // Primary button styling applied via backgroundColor prop
//   },
//   galleryButton: {
//     borderWidth: 2,
//   },
//   buttonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   buttonTextSecondary: {
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   locationSection: {
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   locationCard: {
//     borderRadius: 16,
//     padding: 20,
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   locationTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     flex: 1,
//   },
//   locationInfo: {
//     gap: 4,
//   },
//   locationText: {
//     fontSize: 15,
//     fontFamily: 'monospace',
//   },
//   accuracyText: {
//     fontSize: 13,
//   },
//   noLocationInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   noLocationText: {
//     fontSize: 15,
//   },
//   retryButton: {
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },
//   retryText: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   uploadSection: {
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//     gap: 8,
//   },
//   uploadButtonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.7,
//     paddingTop: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalBody: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//   },
//   infoStep: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     alignItems: 'flex-start',
//   },
//   stepNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: Colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   stepNumberText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   stepContent: {
//     flex: 1,
//     paddingTop: 2,
//   },
//   stepTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   stepDescription: {
//     fontSize: 15,
//     lineHeight: 20,
//   },
// });

// export default UploadTab;








//cant upload image(old ui)
// import React, { useState } from 'react';
// import { View, Button, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { useUpload } from '../../context/UploadContext';

// export default function UploadScreen() {
//   const [image, setImage] = useState<string | null>(null);
//   const [summary, setSummary] = useState<string | null>(null);
//   const [damageType, setDamageType] = useState<string | null>(null);
//   const [severityLabel, setSeverityLabel] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { state, addUpload, clearAllUploads } = useUpload();

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       alert('Please grant permission to access gallery');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//       uploadImage(uri);
//     }
//   };

//   const takePhoto = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       alert('Please grant permission to access camera');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//       uploadImage(uri);
//     }
//   };

//   const uploadImage = async (uri: string) => {
//     setLoading(true);

//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();

//       const formData = new FormData();
//       formData.append('image', blob as any, 'photo.jpg'); // cast to any to avoid TS error

//       const serverResponse = await axios.post('http://192.168.15.190:3000/upload-and-analyze', formData);
//       const predictionData = serverResponse.data;

//       // Save response data
//       setSummary(predictionData.summary || 'No summary available');
//       setDamageType(predictionData.damage_type || 'Unknown');
//       setSeverityLabel(predictionData.severity_label || 'Unknown');

//       // Save upload to context
//       addUpload({
//         imageUri: uri,
//         timestamp: Date.now(),
//         status: 'success',
//         repairStatus: predictionData.severity || 'N/A',
//         aiSummary: predictionData.summary || 'No summary available',
//         location: {
//           latitude: 0,
//           longitude: 0,
//           address: 'Not available',
//         },
//       });

//     } catch (error: any) {
//       console.error('❌ Upload error:', error.message);
//       if (error.response && error.response.data && error.response.data.error) {
//         const errMsg = error.response.data.error;

//         // Show custom error from server (e.g., non-road image)
//         if (errMsg === "Image is not a road photo. Please upload a valid road image.") {
//           alert("⚠️ Please upload a valid road image.");
//         } else {
//           alert("Upload failed: " + errMsg);
//         }
//       } else {
//         alert("Upload failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.buttonContainer}>
//         <Button title="Take Photo" onPress={takePhoto} />
//         <Button title="Pick Image from Gallery" onPress={pickImage} />
//       </View>
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {loading && <ActivityIndicator size="large" color="blue" />}

//       {summary && (
//         <View style={styles.result}>
//           <Text style={styles.label}>AI Summary:</Text>
//           <Text>{summary}</Text>

//           <Text style={styles.label}>Damage Type:</Text>
//           <Text>{damageType}</Text>

//           <Text style={styles.label}>Severity:</Text>
//           <Text>{severityLabel}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     marginTop: 50,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     marginVertical: 20,
//   },
//   result: {
//     marginTop: 20,
//     backgroundColor: '#eee',
//     padding: 10,
//     borderRadius: 8,
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
// });









// //working (no ai)
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   Pressable,
// } from 'react-native';
// import { useColorScheme } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import { Ionicons } from '@expo/vector-icons';
// import { useUpload } from '../../context/UploadContext';
// import { Colors } from '../../constants/Colors';
// import { LocationData, UploadItem } from '../../context/UploadContext';
// import axios from 'axios';

// const { width, height } = Dimensions.get('window');

// const UploadTab = () => {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const theme = isDark ? Colors.dark : Colors.light;
  
//   const { state, setCurrentImage, setCurrentLocation, addUpload, clearCurrentUpload, setUploading, updateUploadStatus } = useUpload();
//   const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
//   const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
//     if (cameraPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Camera permission is required to take photos.');
//     }

//     const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (mediaPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Media library permission is required to select photos.');
//     }

//     const locationPermission = await Location.requestForegroundPermissionsAsync();
//     if (locationPermission.status !== 'granted') {
//       Alert.alert('Permission Required', 'Location permission is required to capture location data.');
//     }
//   };

//   const getCurrentLocation = async () => {
//     setIsLoadingLocation(true);
//     try {
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//         timeInterval: 5000,
//       });

//       const locationData: LocationData = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         accuracy: location.coords.accuracy,
//         timestamp: location.timestamp,
//       };

//       setCurrentLocation(locationData);
//       return locationData;
//     } catch (error) {
//       console.error('Location error:', error);
//       throw error;
//     } finally {
//       setIsLoadingLocation(false);
//     }
//   };

//   const openCamera = async () => {
//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageUri = result.assets[0].uri;
//         setCurrentImage(imageUri);
//         try {
//           await getCurrentLocation();
//         } catch (error) {
//           Alert.alert('Location Error', 'Could not get location. Please try manually.');
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to open camera.');
//       console.error('Camera error:', error);
//     }
//   };

//   const openGallery = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const imageUri = result.assets[0].uri;
//         setCurrentImage(imageUri);
//         try {
//           await getCurrentLocation();
//         } catch (error) {
//           Alert.alert('Location Error', 'Could not get location. Please try manually.');
//         }
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to open gallery.');
//       console.error('Gallery error:', error);
//     }
//   };

//   const handleUpload = async () => {
//     if (!state.currentUpload?.imageUri) {
//       Alert.alert('No Image', 'Please select an image first.');
//       return;
//     }

//     if (!state.currentUpload?.location) {
//       Alert.alert('No Location', 'Please capture location data first.');
//       return;
//     }

//     setUploading(true);

//     const uploadItem: UploadItem = {
//       imageUri: state.currentUpload.imageUri,
//       location: state.currentUpload.location,
//       timestamp: Date.now(),
//       status: 'pending',
//       repairStatus: 'Reported',
//       aiSummary: null,
//     };

//     try {
//       addUpload(uploadItem);

//       // Prepare FormData for Axios POST request
//       const formData = new FormData();
//       formData.append('image', {
//         uri: state.currentUpload.imageUri,
//         name: `image_${uploadItem.timestamp}.jpg`,
//         type: 'image/jpeg',
//       } as any);
//       formData.append('location', JSON.stringify(state.currentUpload.location));

//       // Make Axios POST request to the server
//       const response = await axios.post('http://192.168.15.190:3000/upload-and-analyze', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Assuming the server responds with AI analysis
//       const aiSummary = response.data.aiSummary || 'Type: Unknown, Severity: Unknown, Priority: Unknown';
//       const repairStatus = response.data.repairStatus || 'In Progress';

//       updateUploadStatus(uploadItem.timestamp, 'success', {
//         repairStatus,
//         aiSummary,
//       });

//       Alert.alert('Success!', 'Image uploaded successfully');
//       clearCurrentUpload();
//     } catch (error) {
//       updateUploadStatus(uploadItem.timestamp, 'failed', {});
//       Alert.alert('Upload Failed', 'Please try again.');
//       console.error('Upload error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const retryLocation = async () => {
//     try {
//       await getCurrentLocation();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to get location. Please check your GPS settings.');
//     }
//   };

//   const InfoModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={showInfoModal}
//       onRequestClose={() => setShowInfoModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <Pressable style={styles.modalOverlay} onPress={() => setShowInfoModal(false)}>
//           <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
//             <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
//               <Text style={[styles.modalTitle, { color: theme.text }]}>How it works</Text>
//               <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.closeButton}>
//                 <Ionicons name="close" size={24} color={theme.text} />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>1</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Capture Image</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Take a photo with your camera or select from gallery
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>2</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Auto Location</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Location coordinates are captured automatically
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>3</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>AI Analysis</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Our AI analyzes the damage and provides recommendations
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoStep}>
//                 <View style={styles.stepNumber}>
//                   <Text style={styles.stepNumberText}>4</Text>
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[styles.stepTitle, { color: theme.text }]}>Track Progress</Text>
//                   <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
//                     Monitor your reports and repair status in the Track tab
//                   </Text>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </Pressable>
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
//           <Text style={[styles.title, { color: theme.text }]}>Upload</Text>
//           <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.infoButton}>
//             <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Image Section */}
//         <View style={styles.imageSection}>
//           {!state.currentUpload?.imageUri ? (
//             <View style={[styles.placeholderContainer, { backgroundColor: theme.secondaryBackground }]}>
//               <Ionicons name="image-outline" size={64} color={theme.placeholderText} />
//               <Text style={[styles.placeholderText, { color: theme.placeholderText }]}>
//                 No image selected
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.imageContainer}>
//               <Image source={{ uri: state.currentUpload.imageUri }} style={styles.previewImage} />
//               <TouchableOpacity style={styles.removeButton} onPress={() => setCurrentImage('')}>
//                 <Ionicons name="close" size={20} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.buttonSection}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.cameraButton, { backgroundColor: Colors.primary }]} 
//             onPress={openCamera}
//           >
//             <Ionicons name="camera" size={24} color="#FFFFFF" />
//             <Text style={styles.buttonText}>Camera</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionButton, styles.galleryButton, { backgroundColor: theme.cardBackground, borderColor: Colors.primary }]} 
//             onPress={openGallery}
//           >
//             <Ionicons name="images" size={24} color={Colors.primary} />
//             <Text style={[styles.buttonTextSecondary, { color: Colors.primary }]}>Gallery</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Location Status */}
//         {state.currentUpload?.imageUri && (
//           <View style={styles.locationSection}>
//             <View style={[styles.locationCard, { backgroundColor: theme.cardBackground }]}>
//               <View style={styles.locationHeader}>
//                 <Ionicons name="location" size={20} color={Colors.primary} />
//                 <Text style={[styles.locationTitle, { color: theme.text }]}>Location</Text>
//                 {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
//               </View>
              
//               {state.currentUpload?.location ? (
//                 <View style={styles.locationInfo}>
//                   <Text style={[styles.locationText, { color: theme.placeholderText }]}>
//                     {state.currentUpload.location.latitude.toFixed(6)}, {state.currentUpload.location.longitude.toFixed(6)}
//                   </Text>
//                   {state.currentUpload.location.accuracy && (
//                     <Text style={[styles.accuracyText, { color: theme.placeholderText }]}>
//                       ±{state.currentUpload.location.accuracy.toFixed(0)}m accuracy
//                     </Text>
//                   )}
//                 </View>
//               ) : (
//                 <View style={styles.noLocationInfo}>
//                   <Text style={[styles.noLocationText, { color: theme.placeholderText }]}>
//                     {isLoadingLocation ? 'Getting location...' : 'Location not available'}
//                   </Text>
//                   {!isLoadingLocation && (
//                     <TouchableOpacity onPress={retryLocation} style={styles.retryButton}>
//                       <Text style={[styles.retryText, { color: Colors.primary }]}>Retry</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               )}
//             </View>
//           </View>
//         )}

//         {/* Upload Button */}
//         {state.currentUpload?.imageUri && state.currentUpload?.location && (
//           <View style={styles.uploadSection}>
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 { backgroundColor: state.isUploading ? theme.placeholderText : Colors.success },
//               ]}
//               onPress={handleUpload}
//               disabled={state.isUploading}
//             >
//               {state.isUploading ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <>
//                   <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
//                   <Text style={styles.uploadButtonText}>Upload</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       <InfoModal />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 32,
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: '700',
//     letterSpacing: -0.5,
//   },
//   infoButton: {
//     padding: 4,
//   },
//   imageSection: {
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   placeholderContainer: {
//     height: 280,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginTop: 12,
//   },
//   imageContainer: {
//     position: 'relative',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   previewImage: {
//     width: '100%',
//     height: 280,
//     borderRadius: 20,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 16,
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonSection: {
//     paddingHorizontal: 24,
//     gap: 16,
//     marginBottom: 32,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//     gap: 12,
//   },
//   cameraButton: {
//     // Primary button styling applied via backgroundColor prop
//   },
//   galleryButton: {
//     borderWidth: 2,
//   },
//   buttonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   buttonTextSecondary: {
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   locationSection: {
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   locationCard: {
//     borderRadius: 16,
//     padding: 20,
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   locationTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     flex: 1,
//   },
//   locationInfo: {
//     gap: 4,
//   },
//   locationText: {
//     fontSize: 15,
//     fontFamily: 'monospace',
//   },
//   accuracyText: {
//     fontSize: 13,
//   },
//   noLocationInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   noLocationText: {
//     fontSize: 15,
//   },
//   retryButton: {
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },
//   retryText: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   uploadSection: {
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 16,
//     gap: 8,
//   },
//   uploadButtonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.7,
//     paddingTop: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalBody: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//   },
//   infoStep: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     alignItems: 'flex-start',
//   },
//   stepNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: Colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   stepNumberText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   stepContent: {
//     flex: 1,
//     paddingTop: 2,
//   },
//   stepTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   stepDescription: {
//     fontSize: 15,
//     lineHeight: 20,
//   },
// });

// export default UploadTab;



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
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '../../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { LocationData, UploadItem } from '../../context/UploadContext';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const UploadTab = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  
  const { state, setCurrentImage, setCurrentLocation, addUpload, clearCurrentUpload, setUploading, updateUploadStatus } = useUpload();
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [damageType, setDamageType] = useState<string | null>(null);
  const [severityLabel, setSeverityLabel] = useState<string | null>(null);

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
        setSummary(null);
        setDamageType(null);
        setSeverityLabel(null);
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
        setSummary(null);
        setDamageType(null);
        setSeverityLabel(null);
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

      // Prepare FormData for Axios POST request
      const formData = new FormData();
      formData.append('image', {
        uri: state.currentUpload.imageUri,
        name: `image_${uploadItem.timestamp}.jpg`,
        type: 'image/jpeg',
      } as any);
      formData.append('location', JSON.stringify(state.currentUpload.location));

      // Log FormData for debugging
      console.log('FormData:', {
        imageUri: state.currentUpload.imageUri,
        location: state.currentUpload.location,
      });

      // Make Axios POST request to the server
      const serverResponse = await axios.post('http://192.168.29.144:3000/upload-and-analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 90000, // Set a 10-second timeout
      });

      const predictionData = serverResponse.data;
      console.log('Server Response:', predictionData);

      // Save response data
      setSummary(predictionData.summary || 'No summary available');
      setDamageType(predictionData.damage_type || 'Unknown');
      setSeverityLabel(predictionData.severity_label || 'Unknown');

      // Update context with AI analysis
      updateUploadStatus(uploadItem.timestamp, 'success', {
        repairStatus: predictionData.severity_label || 'In Progress',
        aiSummary: predictionData.summary || 'No summary available',
      });

      Alert.alert('Success!', 'Image uploaded successfully');
      clearCurrentUpload();
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      updateUploadStatus(uploadItem.timestamp, 'failed', {});
      if (error.response && error.response.data && error.response.data.error) {
        const errMsg = error.response.data.error;
        if (errMsg === "Image is not a road photo. Please upload a valid road image.") {
          Alert.alert("⚠️ Please upload a valid road image.");
        } else {
          Alert.alert("Upload failed: " + errMsg);
        }
      } else {
        Alert.alert('Upload Failed', `Network Error: ${error.message}. Please check your server and network settings.`);
      }
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
        <Pressable style={styles.modalOverlay} onPress={() => setShowInfoModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.separator }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>How it works</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.infoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>Capture Image</Text>
                  <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
                    Take a photo with your camera or select from gallery
                  </Text>
                </View>
              </View>

              <View style={styles.infoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>Auto Location</Text>
                  <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
                    Location coordinates are captured automatically
                  </Text>
                </View>
              </View>

              <View style={styles.infoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>AI Analysis</Text>
                  <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
                    Our AI analyzes the damage and provides recommendations
                  </Text>
                </View>
              </View>

              <View style={styles.infoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>Track Progress</Text>
                  <Text style={[styles.stepDescription, { color: theme.placeholderText }]}>
                    Monitor your reports and repair status in the Track tab
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>Upload</Text>
          <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Image Section */}
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
                <Ionicons name="close" size={20} color="#FFFFFF" />
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
            <Ionicons name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.galleryButton, { backgroundColor: theme.cardBackground, borderColor: Colors.primary }]} 
            onPress={openGallery}
          >
            <Ionicons name="images" size={24} color={Colors.primary} />
            <Text style={[styles.buttonTextSecondary, { color: Colors.primary }]}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* AI Analysis Results */}
        {summary && state.currentUpload?.imageUri && (
          <View style={[styles.resultSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.resultLabel, { color: theme.text }]}>AI Summary:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{summary}</Text>

            <Text style={[styles.resultLabel, { color: theme.text }]}>Damage Type:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{damageType}</Text>

            <Text style={[styles.resultLabel, { color: theme.text }]}>Severity:</Text>
            <Text style={[styles.resultText, { color: theme.placeholderText }]}>{severityLabel}</Text>
          </View>
        )}

        {/* Location Status */}
        {state.currentUpload?.imageUri && (
          <View style={styles.locationSection}>
            <View style={[styles.locationCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.locationHeader}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={[styles.locationTitle, { color: theme.text }]}>Location</Text>
                {isLoadingLocation && <ActivityIndicator size="small" color={Colors.primary} />}
              </View>
              
              {state.currentUpload?.location ? (
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationText, { color: theme.placeholderText }]}>
                    {state.currentUpload.location.latitude.toFixed(6)}, {state.currentUpload.location.longitude.toFixed(6)}
                  </Text>
                  {state.currentUpload.location.accuracy && (
                    <Text style={[styles.accuracyText, { color: theme.placeholderText }]}>
                      ±{state.currentUpload.location.accuracy.toFixed(0)}m accuracy
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.noLocationInfo}>
                  <Text style={[styles.noLocationText, { color: theme.placeholderText }]}>
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
              style={[styles.uploadButton, { backgroundColor: state.isUploading ? theme.placeholderText : Colors.success }]}
              onPress={handleUpload}
              disabled={state.isUploading}
            >
              {state.isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
  // Result Styles
  resultSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
  },
  resultLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 15,
    marginBottom: 12,
  },
});

export default UploadTab;