import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../screens/coach_Home_Screen/Header_1';
import { styles } from '../../styles/StudentDrawerStyles';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <Text style={styles.menuText}>Settings Placeholder</Text>
    </View>
  );
}