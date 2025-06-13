import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  TextInput,
  // Slider,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import Header from "./Header_1";

interface SettingsState {
  // Display Settings
  darkMode: boolean;
  language: string;
  fontSize: number;
  
  // Video Settings
  autoplay: boolean;
  videoQuality: string;
  mute: boolean;
  
  // Notification Settings
  notifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  eventReminders: boolean;
  studentUpdates: boolean;
  
  // Privacy Settings
  profileVisibility: string;
  dataSharing: boolean;
  analyticsTracking: boolean;
  
  // Backup Settings
  autoBackup: boolean;
  backupFrequency: string;
  cloudSync: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
];

const VIDEO_QUALITIES = [
  { value: 'auto', label: 'Auto' },
  { value: '720p', label: '720p HD' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
];

const BACKUP_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const PROFILE_VISIBILITY = [
  { value: 'public', label: 'Public' },
  { value: 'students', label: 'Students Only' },
  { value: 'private', label: 'Private' },
];

const SettingsScreen = () => {
  const [settings, setSettings] = useState<SettingsState>({
    // Display Settings
    darkMode: false,
    language: 'en',
    fontSize: 16,
    
    // Video Settings
    autoplay: true,
    videoQuality: 'auto',
    mute: true,
    
    // Notification Settings
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    eventReminders: true,
    studentUpdates: true,
    
    // Privacy Settings
    profileVisibility: 'students',
    dataSharing: false,
    analyticsTracking: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'weekly',
    cloudSync: false,
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVideoQualityModal, setShowVideoQualityModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const keys = Object.keys(settings);
      const values = await AsyncStorage.multiGet(keys);
      const loadedSettings: Partial<SettingsState> = {};
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          try {
            loadedSettings[key as keyof SettingsState] = JSON.parse(value);
          } catch {
            loadedSettings[key as keyof SettingsState] = value as any;
          }
        }
      });
      
      setSettings(prev => ({ ...prev, ...loadedSettings }));
    } catch (error) {
      console.error("Error loading settings:", error);
      Alert.alert("Error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      ]) as [string, string][];
      
      await AsyncStorage.multiSet(settingsArray);
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    }
  };

  useEffect(() => {
    if (!loading) {
      saveSettings();
    }
  }, [settings, loading]);

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings({
                darkMode: false,
                language: 'en',
                fontSize: 16,
                autoplay: true,
                videoQuality: 'auto',
                mute: true,
                notifications: true,
                pushNotifications: true,
                emailNotifications: false,
                eventReminders: true,
                studentUpdates: true,
                profileVisibility: 'students',
                dataSharing: false,
                analyticsTracking: true,
                autoBackup: true,
                backupFrequency: 'weekly',
                cloudSync: false,
              });
              Alert.alert("Success", "Settings have been reset to default");
            } catch (error) {
              Alert.alert("Error", "Failed to reset settings");
            }
          }
        }
      ]
    );
  };

  const exportSettings = async () => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2);
      Alert.alert("Export Settings", "Settings exported successfully!\n\n" + settingsJson);
    } catch (error) {
      Alert.alert("Error", "Failed to export settings");
    }
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Feather name={icon as any} size={20} color="#4e73df" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#e3e6f0', true: '#4e73df' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const renderSelectItem = (
    title: string,
    subtitle: string,
    value: string,
    onPress: () => void,
    icon: string
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Feather name={icon as any} size={20} color="#4e73df" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
        <Text style={styles.settingValue}>{value}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderSliderItem = (
    title: string,
    subtitle: string,
    value: number,
    onValueChange: (value: number) => void,
    min: number,
    max: number,
    step: number,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Feather name={icon as any} size={20} color="#4e73df" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{value}</Text>
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={onValueChange}
            minimumTrackTintColor="#4e73df"
            maximumTrackTintColor="#e3e6f0"
            // thumbStyle={{ backgroundColor: '#4e73df' }}
          />
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Feather name={icon as any} size={18} color="#4e73df" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
        <Text style={{ marginTop: 10 }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Display Settings */}
        {renderSectionHeader("Display Settings", "monitor")}
        {renderSettingItem(
          "Dark Mode",
          "Enable dark theme for better night viewing",
          settings.darkMode,
          () => toggleSetting('darkMode'),
          "moon"
        )}
        {renderSelectItem(
          "Language",
          "Select your preferred language",
          LANGUAGES.find(lang => lang.code === settings.language)?.name || 'English',
          () => setShowLanguageModal(true),
          "globe"
        )}
        {renderSliderItem(
          "Font Size",
          "Adjust the text size for better readability",
          settings.fontSize,
          (value) => updateSetting('fontSize', value),
          12,
          24,
          1,
          "type"
        )}

        {/* Video Settings */}
        {renderSectionHeader("Video Settings", "video")}
        {renderSettingItem(
          "Autoplay Videos",
          "Videos will automatically play when opened",
          settings.autoplay,
          () => toggleSetting('autoplay'),
          "play-circle"
        )}
        {renderSelectItem(
          "Video Quality",
          "Select your preferred video quality",
          VIDEO_QUALITIES.find(qual => qual.value === settings.videoQuality)?.label || 'Auto',
          () => setShowVideoQualityModal(true),
          "film"
        )}
        {renderSettingItem(
          "Mute Videos by Default",
          "Videos will start muted",
          settings.mute,
          () => toggleSetting('mute'),
          "volume-x"
        )}

        {/* Notification Settings */}
        {renderSectionHeader("Notifications", "bell")}
        {renderSettingItem(
          "Enable Notifications",
          "Receive all notifications",
          settings.notifications,
          () => toggleSetting('notifications'),
          "bell"
        )}
        {renderSettingItem(
          "Push Notifications",
          "Receive notifications on your device",
          settings.pushNotifications,
          () => toggleSetting('pushNotifications'),
          "smartphone"
        )}
        {renderSettingItem(
          "Email Notifications",
          "Receive notifications via email",
          settings.emailNotifications,
          () => toggleSetting('emailNotifications'),
          "mail"
        )}
        {renderSettingItem(
          "Event Reminders",
          "Get reminders for upcoming events",
          settings.eventReminders,
          () => toggleSetting('eventReminders'),
          "calendar"
        )}
        {renderSettingItem(
          "Student Updates",
          "Get updates about your students",
          settings.studentUpdates,
          () => toggleSetting('studentUpdates'),
          "users"
        )}

        {/* Privacy Settings */}
        {renderSectionHeader("Privacy", "lock")}
        {renderSelectItem(
          "Profile Visibility",
          "Control who can see your profile",
          PROFILE_VISIBILITY.find(vis => vis.value === settings.profileVisibility)?.label || 'Students Only',
          () => setShowPrivacyModal(true),
          "eye"
        )}
        {renderSettingItem(
          "Data Sharing",
          "Allow sharing of anonymous usage data",
          settings.dataSharing,
          () => toggleSetting('dataSharing'),
          "share-2"
        )}
        {renderSettingItem(
          "Analytics Tracking",
          "Help us improve by sharing usage analytics",
          settings.analyticsTracking,
          () => toggleSetting('analyticsTracking'),
          "bar-chart-2"
        )}

        {/* Backup Settings */}
        {renderSectionHeader("Backup & Sync", "cloud")}
        {renderSettingItem(
          "Auto Backup",
          "Automatically backup your data",
          settings.autoBackup,
          () => toggleSetting('autoBackup'),
          "save"
        )}
        {renderSelectItem(
          "Backup Frequency",
          "How often to backup your data",
          BACKUP_FREQUENCIES.find(freq => freq.value === settings.backupFrequency)?.label || 'Weekly',
          () => setShowBackupModal(true),
          "refresh-cw"
        )}
        {renderSettingItem(
          "Cloud Sync",
          "Sync your data across devices",
          settings.cloudSync,
          () => toggleSetting('cloudSync'),
          "upload-cloud"
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={resetSettings}
          >
            <Text style={styles.buttonText}>Reset All Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.exportButton]} 
            onPress={exportSettings}
          >
            <Text style={styles.buttonText}>Export Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <ScrollView>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.modalItem,
                    settings.language === lang.code && styles.selectedItem
                  ]}
                  onPress={() => {
                    updateSetting('language', lang.code);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{lang.name}</Text>
                  {settings.language === lang.code && (
                    <Feather name="check" size={20} color="#4e73df" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Video Quality Modal */}
      <Modal
        visible={showVideoQualityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVideoQualityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Video Quality</Text>
            <ScrollView>
              {VIDEO_QUALITIES.map((quality) => (
                <TouchableOpacity
                  key={quality.value}
                  style={[
                    styles.modalItem,
                    settings.videoQuality === quality.value && styles.selectedItem
                  ]}
                  onPress={() => {
                    updateSetting('videoQuality', quality.value);
                    setShowVideoQualityModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{quality.label}</Text>
                  {settings.videoQuality === quality.value && (
                    <Feather name="check" size={20} color="#4e73df" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowVideoQualityModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Backup Frequency Modal */}
      <Modal
        visible={showBackupModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBackupModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Backup Frequency</Text>
            <ScrollView>
              {BACKUP_FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.modalItem,
                    settings.backupFrequency === freq.value && styles.selectedItem
                  ]}
                  onPress={() => {
                    updateSetting('backupFrequency', freq.value);
                    setShowBackupModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{freq.label}</Text>
                  {settings.backupFrequency === freq.value && (
                    <Feather name="check" size={20} color="#4e73df" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBackupModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Visibility Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Profile Visibility</Text>
            <ScrollView>
              {PROFILE_VISIBILITY.map((vis) => (
                <TouchableOpacity
                  key={vis.value}
                  style={[
                    styles.modalItem,
                    settings.profileVisibility === vis.value && styles.selectedItem
                  ]}
                  onPress={() => {
                    updateSetting('profileVisibility', vis.value);
                    setShowPrivacyModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{vis.label}</Text>
                  {settings.profileVisibility === vis.value && (
                    <Feather name="check" size={20} color="#4e73df" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#4e73df',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3e6f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6c757d',
  },
  settingValue: {
    fontSize: 14,
    color: '#4e73df',
    marginTop: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 30,
    textAlign: 'center',
    marginRight: 8,
    color: '#4e73df',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  resetButton: {
    backgroundColor: '#e74a3b',
  },
  exportButton: {
    backgroundColor: '#36b9cc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#4e73df',
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
  },
  selectedItem: {
    backgroundColor: '#f8f9fc',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#4e73df',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default SettingsScreen;