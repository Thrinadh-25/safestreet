import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { useUpload } from '../context/UploadContext';
import { Colors } from '../../constants/Colors';
import { UploadItem } from '../context/UploadContext';

export default function TrackTabScreen() {
  const { state } = useUpload();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const clearAllUploads = () => {
    Alert.alert(
      'Clear All Uploads',
      'Are you sure you want to clear all upload history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            // This would need to be implemented in the context
            console.log('Clear all uploads');
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.info;
      case 'success': return Colors.success;
      case 'failed': return Colors.error;
      default: return Colors.gray;
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
    <View key={upload.id || upload.timestamp} style={styles.uploadItem}>
      <View style={styles.uploadHeader}>
        <Image source={{ uri: upload.imageUri }} style={styles.thumbnailImage} />
        <View style={styles.uploadInfo}>
          <Text style={styles.uploadId}>ID: {upload.id || upload.timestamp}</Text>
          <Text style={styles.uploadDate}>
            {new Date(upload.timestamp).toLocaleDateString()} {new Date(upload.timestamp).toLocaleTimeString()}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(upload.status) }]}>
              <Ionicons name={getStatusIcon(upload.status)} size={12} color={Colors.white} />
              <Text style={styles.statusText}>{upload.status.toUpperCase()}</Text>
            </View>
            {upload.status === 'processing' && (
              <ActivityIndicator size="small" color={Colors.primary} style={styles.processingIndicator} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.locationText}>
          {upload.location.latitude.toFixed(6)}, {upload.location.longitude.toFixed(6)}
        </Text>
        {upload.location.address && (
          <Text style={styles.addressText}>{upload.location.address}</Text>
        )}
      </View>

      {upload.aiSummary && (
        <View style={styles.aiResponseSection}>
          <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
          <Text style={styles.aiSummaryText}>{upload.aiSummary}</Text>
          <Text style={styles.repairStatusText}>Status: {upload.repairStatus}</Text>
        </View>
      )}

      {upload.status === 'failed' && (
        <View style={styles.errorSection}>
          <Text style={styles.errorText}>❌ Processing failed. Please try uploading again.</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading uploads...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Track Uploads</Text>
        <Text style={styles.subtitle}>Monitor your road damage reports and AI analysis</Text>
      </View>

      {state.uploads.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.uploads.length}</Text>
            <Text style={styles.statLabel}>Total Uploads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.uploads.filter(u => u.status === 'success').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.uploads.filter(u => u.status === 'processing').length}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.uploads.filter(u => u.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      )}

      {state.uploads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-upload-outline" size={64} color={Colors.gray} />
          <Text style={styles.emptyTitle}>No uploads yet</Text>
          <Text style={styles.emptyText}>
            Upload your first road damage image from the Upload tab to start tracking!
          </Text>
        </View>
      ) : (
        <View style={styles.uploadsContainer}>
          {state.uploads.map(renderUploadItem)}
          
          {state.uploads.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllUploads}>
              <Ionicons name="trash-outline" size={16} color={Colors.white} />
              <Text style={styles.clearButtonText}>Clear All History</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.gray,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.darkText,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    color: Colors.gray,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.lightText,
    lineHeight: 24,
  },
  uploadsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  uploadItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  uploadHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbnailImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.darkText,
  },
  uploadDate: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  processingIndicator: {
    marginLeft: 4,
  },
  locationSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: Colors.darkText,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
    color: Colors.text,
  },
  addressText: {
    fontSize: 12,
    color: Colors.gray,
  },
  aiResponseSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  aiSummaryText: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 16,
  },
  repairStatusText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  errorSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
  },
  clearButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  clearButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});