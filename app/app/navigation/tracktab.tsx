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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AIResponse {
  damageType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  recommendations: string[];
  processingTime: number;
}

interface UploadData {
  id: string;
  imageUri: string;
  location: LocationData;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  aiResponse?: AIResponse;
}

export default function TrackTabScreen() {
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock AI responses for demonstration
  const mockAIResponses: AIResponse[] = [
    {
      damageType: 'Pothole',
      severity: 'High',
      confidence: 0.92,
      recommendations: ['Immediate repair required', 'Traffic diversion recommended', 'Safety barriers needed'],
      processingTime: 2.3
    },
    {
      damageType: 'Crack',
      severity: 'Medium',
      confidence: 0.87,
      recommendations: ['Schedule repair within 2 weeks', 'Monitor for expansion', 'Apply sealant'],
      processingTime: 1.8
    },
    {
      damageType: 'Surface Wear',
      severity: 'Low',
      confidence: 0.76,
      recommendations: ['Routine maintenance', 'Resurface in next cycle', 'Monitor condition'],
      processingTime: 1.5
    },
    {
      damageType: 'Edge Damage',
      severity: 'Critical',
      confidence: 0.94,
      recommendations: ['Emergency repair needed', 'Close lane immediately', 'Install warning signs'],
      processingTime: 2.7
    }
  ];

  const loadUploads = async () => {
    try {
      const storedUploads = await AsyncStorage.getItem('uploads');
      if (storedUploads) {
        const parsedUploads = JSON.parse(storedUploads);
        setUploads(parsedUploads);
      }
    } catch (error) {
      console.error('Error loading uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateAIProcessing = async (uploadId: string) => {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      const storedUploads = await AsyncStorage.getItem('uploads');
      if (storedUploads) {
        const parsedUploads: UploadData[] = JSON.parse(storedUploads);
        const uploadIndex = parsedUploads.findIndex(upload => upload.id === uploadId);
        
        if (uploadIndex !== -1) {
          // Randomly assign an AI response
          const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
          
          parsedUploads[uploadIndex] = {
            ...parsedUploads[uploadIndex],
            status: 'completed',
            aiResponse: randomResponse
          };
          
          await AsyncStorage.setItem('uploads', JSON.stringify(parsedUploads));
          setUploads(parsedUploads);
        }
      }
    } catch (error) {
      console.error('Error processing AI response:', error);
      // Mark as failed
      const storedUploads = await AsyncStorage.getItem('uploads');
      if (storedUploads) {
        const parsedUploads: UploadData[] = JSON.parse(storedUploads);
        const uploadIndex = parsedUploads.findIndex(upload => upload.id === uploadId);
        
        if (uploadIndex !== -1) {
          parsedUploads[uploadIndex].status = 'failed';
          await AsyncStorage.setItem('uploads', JSON.stringify(parsedUploads));
          setUploads(parsedUploads);
        }
      }
    }
  };

  const processNewUploads = async () => {
    const storedUploads = await AsyncStorage.getItem('uploads');
    if (storedUploads) {
      const parsedUploads: UploadData[] = JSON.parse(storedUploads);
      
      // Find pending uploads and start processing
      const pendingUploads = parsedUploads.filter(upload => upload.status === 'pending');
      
      for (const upload of pendingUploads) {
        // Update status to processing
        const uploadIndex = parsedUploads.findIndex(u => u.id === upload.id);
        if (uploadIndex !== -1) {
          parsedUploads[uploadIndex].status = 'processing';
        }
        
        // Start AI processing simulation
        simulateAIProcessing(upload.id);
      }
      
      if (pendingUploads.length > 0) {
        await AsyncStorage.setItem('uploads', JSON.stringify(parsedUploads));
        setUploads(parsedUploads);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUploads();
      processNewUploads();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUploads();
    await processNewUploads();
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
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('uploads');
              setUploads([]);
            } catch (error) {
              console.error('Error clearing uploads:', error);
            }
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'processing': return '#2f95dc';
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'High': return '#fd7e14';
      case 'Critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderUploadItem = (upload: UploadData) => (
    <View key={upload.id} style={styles.uploadItem}>
      <View style={styles.uploadHeader}>
        <Image source={{ uri: upload.imageUri }} style={styles.thumbnailImage} />
        <View style={styles.uploadInfo}>
          <Text style={styles.uploadId}>ID: {upload.id}</Text>
          <Text style={styles.uploadDate}>
            {new Date(upload.timestamp).toLocaleDateString()} {new Date(upload.timestamp).toLocaleTimeString()}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(upload.status) }]}>
              <Text style={styles.statusText}>{upload.status.toUpperCase()}</Text>
            </View>
            {upload.status === 'processing' && (
              <ActivityIndicator size="small" color="#2f95dc" style={styles.processingIndicator} />
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

      {upload.aiResponse && (
        <View style={styles.aiResponseSection}>
          <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
          
          <View style={styles.aiResponseHeader}>
            <View style={styles.damageTypeContainer}>
              <Text style={styles.damageType}>{upload.aiResponse.damageType}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(upload.aiResponse.severity) }]}>
                <Text style={styles.severityText}>{upload.aiResponse.severity}</Text>
              </View>
            </View>
            <Text style={styles.confidence}>
              Confidence: {(upload.aiResponse.confidence * 100).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {upload.aiResponse.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
            ))}
          </View>

          <Text style={styles.processingTime}>
            Processing time: {upload.aiResponse.processingTime}s
          </Text>
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
        <ActivityIndicator size="large" color="#2f95dc" />
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

      {uploads.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uploads.length}</Text>
            <Text style={styles.statLabel}>Total Uploads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uploads.filter(u => u.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uploads.filter(u => u.status === 'processing').length}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uploads.filter(u => u.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      )}

      {uploads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No uploads yet</Text>
          <Text style={styles.emptyText}>
            Upload your first road damage image from the Upload tab to start tracking!
          </Text>
        </View>
      ) : (
        <View style={styles.uploadsContainer}>
          {uploads.map(renderUploadItem)}
          
          <TouchableOpacity style={styles.clearButton} onPress={clearAllUploads}>
            <Text style={styles.clearButtonText}>🗑️ Clear All History</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
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
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f95dc',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 24,
  },
  uploadsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  uploadItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
  },
  uploadInfo: {
    flex: 1,
  },
  uploadId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uploadDate: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  processingIndicator: {
    marginLeft: 4,
  },
  locationSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#495057',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    opacity: 0.7,
  },
  aiResponseSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  aiResponseHeader: {
    marginBottom: 12,
  },
  damageTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  damageType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 12,
    opacity: 0.7,
  },
  recommendationsContainer: {
    marginBottom: 8,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationItem: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 2,
    paddingLeft: 8,
  },
  processingTime: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  errorSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});