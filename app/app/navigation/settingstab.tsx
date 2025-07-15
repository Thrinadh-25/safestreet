import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from '../../components/Themed';
import  {Colors}  from '../../constants/Colors';


//import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../context/AuthContext';

interface AppSettings {
  notifications: boolean;
  autoLocation: boolean;
  highQualityImages: boolean;
  dataUsageWarning: boolean;
}

export default function SettingsTabScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const { state, logout } = useAuth();
  
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data, uploads, and account information will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          style: 'destructive',
          onPress: () => setShowDeleteModal(true)
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete my account') {
      Alert.alert('Error', 'Please type "delete my account" exactly to confirm.');
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Replace with actual API call to delete account
      // const response = await fetch('YOUR_BACKEND_URL/api/user/delete', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${state.token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // if (response.ok) {
      //   // Account deleted successfully on server
      //   await AsyncStorage.clear();
      //   router.replace('/auth/register');
      // } else {
      //   throw new Error('Failed to delete account');
      // }

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear all local data
      await AsyncStorage.clear();
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. Thank you for using Safe Street.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowDeleteModal(false);
              router.replace('/auth/register');
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
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

 
  const contactSupport = () => {
    Linking.openURL('mailto:safestreetps@gmail.com?subject=Safe Street App Support');
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    iconName: string
  ) => (
    <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.settingInfo}>
        <Ionicons name={iconName as any} size={20} color={Colors.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: theme.placeholderText }]}>{subtitle}</Text>
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
    <View style={[styles.infoItem, { backgroundColor: theme.secondaryBackground }]}>
      <Ionicons name={iconName as any} size={18} color={Colors.primary} style={styles.infoIcon} />
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: theme.placeholderText }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );

  const renderActionItem = (title: string, onPress: () => void, iconName: string, color?: string) => (
    <TouchableOpacity 
      style={[styles.actionItem, { backgroundColor: theme.cardBackground }]} 
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={18} color={color || Colors.primary} style={styles.actionIcon} />
      <Text style={[styles.actionTitle, { color: theme.text }, color && { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.placeholderText} />
    </TouchableOpacity>
  );

  const DeleteAccountModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDeleteModal}
      onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.deleteModalContent, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.deleteModalHeader}>
            <Ionicons name="warning" size={32} color={Colors.error} />
            <Text style={[styles.deleteModalTitle, { color: theme.text }]}>Delete Account</Text>
          </View>
          
          <Text style={[styles.deleteModalText, { color: theme.text }]}>
            This action is permanent and cannot be undone. All your data will be deleted including:
          </Text>
          
          <View style={styles.deleteModalList}>
            <Text style={[styles.deleteModalListItem, { color: theme.placeholderText }]}>• All uploaded images and reports</Text>
            <Text style={[styles.deleteModalListItem, { color: theme.placeholderText }]}>• Account information and settings</Text>
            <Text style={[styles.deleteModalListItem, { color: theme.placeholderText }]}>• Upload history and AI analysis</Text>
            <Text style={[styles.deleteModalListItem, { color: theme.placeholderText }]}>• All associated data</Text>
          </View>
          
          <Text style={[styles.deleteModalConfirmText, { color: theme.text }]}>
            Type "delete my account" to confirm:
          </Text>
          
          <TextInput
            style={[styles.deleteModalInput, { 
              backgroundColor: theme.secondaryBackground, 
              color: theme.text,
              borderColor: theme.borderColor 
            }]}
            placeholder="delete my account"
            placeholderTextColor={theme.placeholderText}
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            autoCapitalize="none"
            editable={!isDeleting}
          />
          
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.cancelButton, { backgroundColor: theme.secondaryBackground }]}
              onPress={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
              }}
              disabled={isDeleting}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteButton, { 
                backgroundColor: isDeleting ? theme.placeholderText : Colors.error 
              }]}
              onPress={confirmDeleteAccount}
              disabled={isDeleting || deleteConfirmText.toLowerCase() !== 'delete my account'}
            >
              {isDeleting ? (
                <Text style={styles.deleteButtonText}>Deleting...</Text>
              ) : (
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.placeholderText }]}>
            Customize your Safe Street experience
          </Text>
        </View>

        {/* User Profile */}
        {state.user && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>👤 Profile</Text>
            <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.profileInfo}>
                <View style={[styles.profileAvatar, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.profileAvatarText}>
                    {state.user.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileDetails}>
                  <Text style={[styles.profileName, { color: theme.text }]}>{state.user.fullName}</Text>
                  <Text style={[styles.profileEmail, { color: theme.placeholderText }]}>{state.user.email}</Text>
                  {state.user.phone && (
                    <Text style={[styles.profilePhone, { color: theme.placeholderText }]}>{state.user.phone}</Text>
                  )}
                </View>
              </View>
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                  <Text style={[styles.signOutText, { color: Colors.error }]}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                  <Text style={styles.deleteAccountText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}


        {/* App Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>📱 App Information</Text>
          
          {renderInfoItem('Version', appInfo.version, 'information-circle')}
          {renderInfoItem('Build Number', appInfo.buildNumber, 'build')}
          {renderInfoItem('Total Uploads', appInfo.totalUploads.toString(), 'cloud-upload')}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>🛠️ Support & Legal</Text>
          {renderActionItem('Clear App Data', clearAppData, 'trash', Colors.error)}
          {renderActionItem('Contact Suport', contactSupport, 'mail')}

        </View>

        {/* About */}
        <View style={[styles.aboutSection, { backgroundColor: theme.secondaryBackground }]}>
          <Text style={[styles.aboutTitle, { color: Colors.primary }]}>About Safe Street</Text>
          <Text style={[styles.aboutText, { color: theme.placeholderText }]}>
            Safe Street helps communities report and track road damage using AI-powered analysis. 
            Together, we can make our roads safer for everyone.
          </Text>
          <Text style={[styles.aboutCopyright, { color: theme.placeholderText }]}>
            © 2025 Safe Street. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      <DeleteAccountModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  },
  profileCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
  },
  profileActions: {
    gap: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    gap: 8,
  },
  deleteAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  // Delete Account Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  deleteModalText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  deleteModalList: {
    marginBottom: 20,
  },
  deleteModalListItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  deleteModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  deleteModalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});