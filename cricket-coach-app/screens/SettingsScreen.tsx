import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/SettingsStyles';
// import { AntDesign } from '@expo/vector-icons';
import Header from './Header_1';
const SettingsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>

      {/* Title */}
      <Header title='Settings' />

      {/* Placeholder Content */}
      <Text style={styles.placeholder}>Customize your preferences here.</Text>
    </View>
  );
};

export default SettingsScreen;
