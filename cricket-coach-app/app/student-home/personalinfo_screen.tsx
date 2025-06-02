import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../screens/coach_Home_Screen/Header_1';
import { styles } from '../../styles/StudentDrawerStyles';

export default function PersonalInfoScreen() {
  return (
    <View style={styles.container}>
      <Header title="Personal Information" />
      <Text style={styles.menuText}>Personal Info Placeholder</Text>
    </View>
  );
} 