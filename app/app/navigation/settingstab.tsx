import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  autoLocation: boolean;
  highQualityImages: boolean;
  dataUsageWarning: boolean;
}

export default function SettingsTabScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    notifications: true,
    autoLocation: true,
    highQualityImages: true,
    dataUsageWarning: true,
  });

  const [appInfo, setAppInfo] = useState({
    version: '1.0.0',
    buildNumber: '1',
    totalUploads: 0,
    storageUsed: '0 MB',
  });

  useEffect(() => {
    loadSettings();
    loadAppInfo();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadAppInfo = async () => {
    try {
      const uploads = await AsyncStorage.getItem('uploads');
      const totalUploads = uploads ? JSON.parse(uploads).length : 0;
      
      // Calculate approximate storage used (simplified)
      const storageUsed = totalUploads > 0 ? `${(totalUploads * 2.5).toFixed(1)} MB` : '0 MB';
      
      setAppInfo(prev => ({
        ...prev,
        totalUploads,
        storageUsed,
      }));
    } catch (error) {
      console.error('Error loading app info:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: keyof AppSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const clearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all uploads, settings, and cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings({
                darkMode: false,
                notifications: true,
                autoLocation: true,
                highQualityImages: true,
                dataUsageWarning: true,
              });
              setAppInfo(prev => ({
                ...prev,
                totalUploads: 0,
                storageUsed: '0 MB',
              }));
              Alert.alert('Success', 'All app data has been cleared.');
            } catch (error) {
              console.error('Error clearing app data:', error);
              Alert.alert('Error', 'Failed to clear app data.');
            }
          }
        },
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Export functionality will be available in a future update. This will allow you to backup your upload history and settings.',
      [{ text: 'OK' }]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@safestreet.com?subject=Safe Street App Support');
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#2f95dc' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

  const renderInfoItem = (label: string, value: string, icon: string) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const renderActionItem = (title: string, onPress: () => void, icon: string, color?: string) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={[styles.actionTitle, color && { color }]}>{title}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your Safe Street experience</Text>
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        
        {renderSettingItem(
          'Dark Mode',
          'Switch between light and dark themes',
          settings.darkMode,
          () => toggleSetting('darkMode'),
          '🌙'
        )}
        
        {renderSettingItem(
          'Push Notifications',
          'Get notified about upload status and updates',
          settings.notifications,
          () => toggleSetting('notifications'),
          '🔔'
        )}
        
        {renderSettingItem(
          'Auto Location',
          'Automatically capture location with images',
          settings.autoLocation,
          () => toggleSetting('autoLocation'),
          '📍'
        )}
        
        {renderSettingItem(
          'High Quality Images',
          'Upload images in higher resolution',
          settings.highQualityImages,
          () => toggleSetting('highQualityImages'),
          '📸'
        )}
        
        {renderSettingItem(
          'Data Usage Warning',
          'Warn before uploading on mobile data',
          settings.dataUsageWarning,
          () => toggleSetting('dataUsageWarning'),
          '📊'
        )}
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        {renderInfoItem('Version', appInfo.version, '📱')}
        {renderInfoItem('Build Number', appInfo.buildNumber, '🔧')}
        {renderInfoItem('Total Uploads', appInfo.totalUploads.toString(), '📤')}
        {renderInfoItem('Storage Used', appInfo.storageUsed, '💾')}
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        {renderActionItem('Export Data', exportData, '📋')}
        {renderActionItem('Clear App Data', clearAppData, '🗑️', '#dc3545')}
      </View>

      {/* Support & Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        
        {renderActionItem('Contact Support', contactSupport, '💬')}
        {renderActionItem('Privacy Policy', openPrivacyPolicy, '🔒')}
        {renderActionItem('Terms of Service', openTermsOfService, '📄')}
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Safe Street</Text>
        <Text style={styles.aboutText}>
          Safe Street helps communities report and track road damage using AI-powered analysis. 
          Together, we can make our roads safer for everyone.
        </Text>
        <Text style={styles.aboutCopyright}>
          © 2025 Safe Street. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2f95dc',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  actionArrow: {
    fontSize: 20,
    opacity: 0.5,
  },
  aboutSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2f95dc',
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
    opacity: 0.8,
  },
  aboutCopyright: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});