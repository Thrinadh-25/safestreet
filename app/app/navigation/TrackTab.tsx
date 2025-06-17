import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUpload } from '../context/UploadContext';
import UploadCard from '../components/UploadCard';
import { Colors } from '../../constants/Colors';

const TrackTab = () => {
  const { state } = useUpload();
  const { uploads } = state;

  console.log('TrackTab re-rendered', { uploadsCount: uploads.length });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Road Repairs</Text>
      {uploads.length === 0 ? (
        <View style={styles.noUploadsContainer}>
          <Ionicons name="information-circle" size={48} color={Colors.gray} />
          <Text style={styles.noUploads}>No uploads yet.</Text>
          <Text style={styles.noUploadsSubtext}>Upload a road image to start tracking repairs.</Text>
        </View>
      ) : (
        <FlatList
          data={uploads}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => <UploadCard upload={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.lightBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.darkText,
    marginBottom: 20,
  },
  noUploadsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noUploads: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  noUploadsSubtext: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TrackTab;