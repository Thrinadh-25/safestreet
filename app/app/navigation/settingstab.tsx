import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Linking,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface AppSettings {
  notifications: boolean;
  autoLocation: boolean;
  highQualityImages: boolean;
  dataUsageWarning: boolean;
}

export default function SettingsTabScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [settings, setSettings] = useState<AppSettings>({
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
    iconName: string
  ) => (
    <View style={[styles.settingItem, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground }]}>
      <View style={styles.settingInfo}>
        <Ionicons name={iconName as any} size={20} color={Colors.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: Colors.primary }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

  const renderInfoItem = (label: string, value: string, iconName: string) => (
    <View style={[styles.infoItem, { backgroundColor: isDark ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground }]}>
      <Ionicons name={iconName as any} size={18} color={Colors.primary} style={styles.infoIcon} />
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const renderActionItem = (title: string, onPress: () => void, iconName: string, color?: string) => (
    <TouchableOpacity 
      style={[styles.actionItem, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground }]} 
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={18} color={color || Colors.primary} style={styles.actionIcon} />
      <Text style={[styles.actionTitle, color && { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={isDark ? Colors.dark.placeholderText : Colors.light.placeholderText} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={[styles.subtitle, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
          Customize your Safe Street experience
        </Text>
      </View>

      {/* Theme Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Theme</Text>
        <View style={[styles.themeInfo, { backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground }]}>
          <View style={styles.themeRow}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={Colors.primary} />
            <View style={styles.themeText}>
              <Text style={styles.themeTitle}>Current Theme</Text>
              <Text style={[styles.themeSubtitle, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'} (Device Default)
              </Text>
            </View>
          </View>
          <Text style={[styles.themeDescription, { color: isDark ? Colors.dark.placeholderText : Colors.light.placeholderText }]}>
            Theme automatically follows your device settings
          </Text>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ App Preferences</Text>
        
        {renderSettingItem(
          'Push Notifications',
          'Get notified about upload status and updates',
          settings.notifications,
          () => toggleSetting('notifications'),
          'notifications'
        )}
        
        {renderSettingItem(
          'Auto Location',
          'Automatically capture location with images',
          settings.autoLocation,
          () => toggleSetting('autoLocation'),
          'location'
        )}
        
        {renderSettingItem(
          'High Quality Images',
          'Upload images in higher resolution',
          settings.highQualityImages,
          () => toggleSetting('highQualityImages'),
          'camera'
        )}
        
        {renderSettingItem(
          'Data Usage Warning',
          'Warn before uploading on mobile data',
          settings.dataUsageWarning,
          () => toggleSetting('dataUsageWarning'),
          'cellular'
        )}
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 App Information</Text>
        
        {renderInfoItem('Version', appInfo.version, 'information-circle')}
        {renderInfoItem('Build Number', appInfo.buildNumber, 'build')}
        {renderInfoItem('Total Uploads', appInfo.totalUploads.toString(), 'cloud-upload')}
        {renderInfoItem('Storage Used', appInfo.storageUsed, 'server')}
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Data Management</Text>
        
        {renderActionItem('Export Data', exportData, 'download')}
        {renderActionItem('Clear App Data', clearAppData, 'trash', Colors.error)}
      </View>

      {/* Support & Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Support & Legal</Text>
        
        {renderActionItem('Contact Support', contactSupport, 'mail')}
        {renderActionItem('Privacy Policy', openPrivacyPolicy, 'shield-checkmark')}
        {renderActionItem('Terms of Service', openTermsOfService, 'document-text')}
      </View>

      {/* About */}
      <View style={[styles.aboutSection, { backgroundColor: isDark ? Colors.dark.secondaryBackground : '#f0f8ff' }]}>
        <Text style={styles.aboutTitle}>About Safe Street</Text>
        <Text style={[styles.aboutText, { color: isDark ? Colors.dark.placeholderText : '#666' }]}>
          Safe Street helps communities report and track road damage using AI-powered analysis. 
          Together, we can make our roads safer for everyone.
        </Text>
        <Text style={[styles.aboutCopyright, { color: isDark ? Colors.dark.placeholderText : '#999' }]}>
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
    color: Colors.primary,
  },
  themeInfo: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeText: {
    marginLeft: 12,
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 12,
  },
  themeDescription: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
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
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
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
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  aboutSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  aboutCopyright: {
    fontSize: 12,
    textAlign: 'center',
  },
});