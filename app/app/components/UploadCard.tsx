import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { UploadItem } from '../context/UploadContext';

interface UploadCardProps {
  upload: UploadItem;
}

const UploadCard: React.FC<UploadCardProps> = ({ upload }) => {
  console.log('UploadCard rendered for timestamp:', upload.timestamp);

  return (
    <View style={styles.card}>
      <Image source={{ uri: upload.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Upload Status: </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  upload.status === 'success'
                    ? Colors.success
                    : upload.status === 'failed'
                    ? Colors.error
                    : Colors.warning,
              },
            ]}
          >
            {upload.status}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Repair Status: </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  upload.repairStatus === 'Completed'
                    ? Colors.success
                    : upload.repairStatus === 'In Progress'
                    ? Colors.warning
                    : Colors.primary,
              },
            ]}
          >
            {upload.repairStatus}
          </Text>
        </View>

        <Text style={styles.label}>
          Latitude: {upload.location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.label}>
          Longitude: {upload.location.longitude.toFixed(6)}
        </Text>
        <Text style={styles.label}>
          Uploaded: {new Date(upload.timestamp).toLocaleString()}
        </Text>

        {upload.aiSummary && (
          <View style={styles.aiSummary}>
            <Text style={styles.aiSummaryTitle}>AI Analysis:</Text>
            <Text style={styles.aiSummaryText}>{upload.aiSummary}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  aiSummary: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  aiSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkText,
    marginBottom: 4,
  },
  aiSummaryText: {
    fontSize: 14,
    color: Colors.text,
  },
});

export default UploadCard;