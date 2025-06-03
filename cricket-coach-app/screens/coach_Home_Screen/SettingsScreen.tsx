import React, { useState, useEffect } from "react";
import { View, Text, Switch, ScrollView, Alert } from "react-native";
import { styles } from "../../styles/SettingsStyles";
import Header from "./Header_1";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    autoplay: true,
    mute: true,
    notifications: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const keys = ["darkMode", "autoplay", "mute", "notifications"];
        const values = await AsyncStorage.multiGet(keys);
        const loadedSettings = {};
        values.forEach(([key, value]) => {
          if (value !== null) {
            loadedSettings[key] = JSON.parse(value);
          }
        });
        setSettings((prev) => ({ ...prev, ...loadedSettings }));
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      Alert.alert("Error", "Failed to save setting");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch value={settings.darkMode} onValueChange={() => toggleSetting("darkMode")} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Autoplay Videos</Text>
          <Switch value={settings.autoplay} onValueChange={() => toggleSetting("autoplay")} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mute by Default</Text>
          <Switch value={settings.mute} onValueChange={() => toggleSetting("mute")} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch value={settings.notifications} onValueChange={() => toggleSetting("notifications")} />
        </View>

        <Text style={styles.note}>More settings coming soon!</Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
