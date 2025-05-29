import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { styles } from '../styles/PersonalInfoStyles';
import Header from './Header_1';
const PersonalInfoScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title='Personal Information' />
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images/boy.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Mit</Text>
        <Text style={styles.role}>Head Coach</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>Mit Patel</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>Batting Coach</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Birthplace:</Text>
          <Text style={styles.value}>Ahmedabad, India</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Experience:</Text>
          <Text style={styles.value}>8 Years</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>History:</Text>
          <Text style={styles.value}>
            Former domestic cricketer and current U-19 national team coach.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PersonalInfoScreen;
