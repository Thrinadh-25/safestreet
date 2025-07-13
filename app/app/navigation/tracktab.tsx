// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   RefreshControl,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { useColorScheme } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { Text, View } from '../../components/Themed';
// import { useUpload } from '../../context/UploadContext';
// import  {Colors} from '../../constants/Colors';
// import { UploadItem } from '../../context/UploadContext';


// //import { useColorScheme } from '../../components/useColorScheme';

// export default function TrackTabScreen() {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const theme = isDark ? Colors.dark : Colors.light;
  
//   const { state } = useUpload();
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // Simulate refresh delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setRefreshing(false);
//   };
  




  
//   const { clearAllUploads } = useUpload(); // ← Access from context

//   const clearAllUploadsWithConfirm = () => {
//     Alert.alert(
//       'Clear All Uploads',
//       'Are you sure you want to clear all upload history? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Clear All', 
//           style: 'destructive',
//           onPress: () => {
//             clearAllUploads(); // ← Actually clear uploads here
//             }
//           },
//         ]
//       );
//     };
  

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return Colors.warning;
//       case 'processing': return Colors.info;
//       case 'success': return Colors.success;
//       case 'failed': return Colors.error;
//       default: return theme.placeholderText;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending': return 'time-outline';
//       case 'processing': return 'sync-outline';
//       case 'success': return 'checkmark-circle-outline';
//       case 'failed': return 'close-circle-outline';
//       default: return 'help-circle-outline';
//     }
//   };

//   const renderUploadItem = (upload: UploadItem) => (
//     <View key={upload.id || upload.timestamp} style={[styles.uploadItem, { backgroundColor: theme.cardBackground }]}>
//       <View style={styles.uploadHeader}>
//         <Image source={{ uri: upload.imageUri }} style={styles.thumbnailImage} />
//         <View style={styles.uploadInfo}>
//           <Text style={[styles.uploadId, { color: theme.text }]}>ID: {upload.id || upload.timestamp}</Text>
//           <Text style={[styles.uploadDate, { color: theme.placeholderText }]}>
//             {new Date(upload.timestamp).toLocaleDateString()} {new Date(upload.timestamp).toLocaleTimeString()}
//           </Text>
//           <View style={styles.statusContainer}>
//             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(upload.status) }]}>
//               <Ionicons name={getStatusIcon(upload.status)} size={12} color="#FFFFFF" />
//               <Text style={styles.statusText}>{upload.status.toUpperCase()}</Text>
//             </View>
//             {upload.status === 'processing' && (
//               <ActivityIndicator size="small" color={Colors.primary} style={styles.processingIndicator} />
//             )}
//           </View>
//         </View>
//       </View>

//       <View style={[styles.locationSection, { borderTopColor: theme.separator }]}>
//         <Text style={[styles.sectionTitle, { color: theme.text }]}>📍 Location</Text>
//         <Text style={[styles.locationText, { color: theme.text }]}>
//           {upload.location.latitude.toFixed(6)}, {upload.location.longitude.toFixed(6)}
//         </Text>
//         {upload.location.address && (
//           <Text style={[styles.addressText, { color: theme.placeholderText }]}>{upload.location.address}</Text>
//         )}
//       </View>
       
//       {upload.aiSummary && (
//         <View style={[styles.aiResponseSection, { borderTopColor: theme.separator }]}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>🤖 AI Analysis</Text>
//           <Text style={[styles.aiSummaryText, { color: theme.text }]}>
//             {upload.aiSummary}
//             </Text>
//             </View>
//           )}


//       {upload.status === 'failed' && (
//         <View style={[styles.errorSection, { borderTopColor: theme.separator }]}>
//           <Text style={[styles.errorText, { color: Colors.error }]}>❌ Processing failed. Please try uploading again.</Text>
//         </View>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={[styles.loadingText, { color: theme.placeholderText }]}>Loading uploads...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <ScrollView 
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
//           <Text style={[styles.title, { color: theme.text }]}>Track Uploads</Text>
//           <Text style={[styles.subtitle, { color: theme.placeholderText }]}>Monitor your road damage reports and AI analysis</Text>
//         </View>

//         {state.uploads.length > 0 && (
//           <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground }]}>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.length}</Text>
//               <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Total Uploads</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'success').length}</Text>
//               <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Completed</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'processing').length}</Text>
//               <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Processing</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'pending').length}</Text>
//               <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Pending</Text>
//             </View>
//           </View>
//         )}

//         {state.uploads.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="cloud-upload-outline" size={64} color={theme.placeholderText} />
//             <Text style={[styles.emptyTitle, { color: theme.placeholderText }]}>No uploads yet</Text>
//             <Text style={[styles.emptyText, { color: theme.placeholderText }]}>
//               Upload your first road damage image from the Upload tab to start tracking!
//             </Text>
//           </View>
//         ) : (
       

//           <View style={styles.uploadsContainer}>
//             {state.uploads.map(renderUploadItem)}
            
//             {state.uploads.length > 0 && (
//               <TouchableOpacity style={[styles.clearButton, { backgroundColor: Colors.error }]} onPress={clearAllUploads}>
//                 <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
//                 <Text style={styles.clearButtonText}>Clear All History</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   header: {
//     alignItems: 'center',
//     padding: 20,
//     paddingBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     marginHorizontal: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   statLabel: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 40,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 10,
//   },
//   emptyText: {
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   uploadsContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   uploadItem: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   uploadHeader: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   thumbnailImage: {
//     width: 80,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//     backgroundColor: '#E5E5EA',
//   },
//   uploadInfo: {
//     flex: 1,
//   },
//   uploadId: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   uploadDate: {
//     fontSize: 12,
//     marginBottom: 8,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 8,
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
//   processingIndicator: {
//     marginLeft: 4,
//   },
//   locationSection: {
//     marginBottom: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   locationText: {
//     fontSize: 12,
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   addressText: {
//     fontSize: 12,
//   },
//   aiResponseSection: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//   },
//   aiSummaryText: {
//     fontSize: 12,
//     marginBottom: 6,
//     lineHeight: 16,
//   },
//   repairStatusText: {
//     fontSize: 11,
//     fontWeight: '500',
//   },
//   errorSection: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//   },
//   errorText: {
//     fontSize: 12,
//   },
//   clearButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
// });



import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '../../components/Themed';
import { useUpload } from '../../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { UploadItem } from '../../context/UploadContext';

export default function TrackTabScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const { state, clearAllUploads } = useUpload();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.info;
      case 'success': return Colors.success;
      case 'failed': return Colors.error;
      default: return theme.placeholderText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'sync-outline';
      case 'success': return 'checkmark-circle-outline';
      case 'failed': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const renderUploadItem = (upload: UploadItem) => (
    <View key={upload.id || upload.timestamp} style={[styles.uploadItem, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.uploadHeader}>
        <Image source={{ uri: upload.imageUri }} style={styles.thumbnailImage} />
        <View style={styles.uploadInfo}>
          <Text style={[styles.uploadId, { color: theme.text }]}>ID: {upload.id || upload.timestamp}</Text>
          <Text style={[styles.uploadDate, { color: theme.placeholderText }]}>
            {new Date(upload.timestamp).toLocaleDateString()} {new Date(upload.timestamp).toLocaleTimeString()}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(upload.status) }]}>
              <Ionicons name={getStatusIcon(upload.status)} size={12} color="#FFFFFF" />
              <Text style={styles.statusText}>{upload.status.toUpperCase()}</Text>
            </View>
            {upload.status === 'processing' && (
              <ActivityIndicator size="small" color={Colors.primary} style={styles.processingIndicator} />
            )}
          </View>
        </View>
      </View>

      <View style={[styles.locationSection, { borderTopColor: theme.separator }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>📍 Location</Text>
        <Text style={[styles.locationText, { color: theme.text }]}>
          {upload.location.latitude.toFixed(6)}, {upload.location.longitude.toFixed(6)}
        </Text>
        {upload.location.address && (
          <Text style={[styles.addressText, { color: theme.placeholderText }]}>{upload.location.address}</Text>
        )}
      </View>

      {upload.aiSummary && (
        <View style={[styles.aiResponseSection, { borderTopColor: theme.separator }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🤖 AI Analysis</Text>
          <Text style={[styles.aiSummaryText, { color: theme.text }]}>
            {upload.aiSummary}
          </Text>
        </View>
      )}

      {/* ✅ Report ID display */}
      {upload.reportId && (
        <View style={[styles.aiResponseSection, { borderTopColor: theme.separator }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🆔 Report ID</Text>
          <Text style={[styles.aiSummaryText, { color: theme.placeholderText }]}>
            {upload.reportId}
          </Text>
        </View>
      )}

      {upload.status === 'failed' && (
        <View style={[styles.errorSection, { borderTopColor: theme.separator }]}>
          <Text style={[styles.errorText, { color: Colors.error }]}>❌ Processing failed. Please try uploading again.</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.loadingText, { color: theme.placeholderText }]}>Loading uploads...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>Track Uploads</Text>
          <Text style={[styles.subtitle, { color: theme.placeholderText }]}>Monitor your road damage reports and AI analysis</Text>
        </View>

        {state.uploads.length > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.length}</Text>
              <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Total Uploads</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'success').length}</Text>
              <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'processing').length}</Text>
              <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Processing</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary }]}>{state.uploads.filter(u => u.status === 'pending').length}</Text>
              <Text style={[styles.statLabel, { color: theme.placeholderText }]}>Pending</Text>
            </View>
          </View>
        )}

        {state.uploads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-upload-outline" size={64} color={theme.placeholderText} />
            <Text style={[styles.emptyTitle, { color: theme.placeholderText }]}>No uploads yet</Text>
            <Text style={[styles.emptyText, { color: theme.placeholderText }]}>
              Upload your first road damage image from the Upload tab to start tracking!
            </Text>
          </View>
        ) : (
          <View style={styles.uploadsContainer}>
            {state.uploads.map(renderUploadItem)}

            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: Colors.error }]}
              onPress={() => {
                Alert.alert(
                  'Clear All Uploads',
                  'Are you sure you want to clear all upload history?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: clearAllUploads,
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              <Text style={styles.clearButtonText}>Clear All History</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: {
    alignItems: 'center', padding: 20, paddingBottom: 10,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 8,
  },
  subtitle: { fontSize: 16, textAlign: 'center' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  emptyContainer: { alignItems: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  uploadsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  uploadItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  uploadHeader: { flexDirection: 'row', marginBottom: 12 },
  thumbnailImage: {
    width: 80, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#E5E5EA',
  },
  uploadInfo: { flex: 1 },
  uploadId: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  uploadDate: { fontSize: 12, marginBottom: 8 },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4,
  },
  processingIndicator: { marginLeft: 4 },
  locationSection: {
    marginBottom: 12, paddingTop: 12, borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 'bold', marginBottom: 6,
  },
  locationText: {
    fontSize: 12, fontFamily: 'monospace', marginBottom: 4,
  },
  addressText: { fontSize: 12 },
  aiResponseSection: {
    marginTop: 12, paddingTop: 12, borderTopWidth: 1,
  },
  aiSummaryText: {
    fontSize: 12, marginBottom: 6, lineHeight: 16,
  },
  repairStatusText: { fontSize: 11, fontWeight: '500' },
  errorSection: {
    marginTop: 12, paddingTop: 12, borderTopWidth: 1,
  },
  errorText: { fontSize: 12 },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  clearButtonText: {
    color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginLeft: 8,
  },
});
