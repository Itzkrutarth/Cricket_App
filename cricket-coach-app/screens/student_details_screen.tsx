// app/coach-home/student-detail.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import Header from './Header_1';
import { styles } from '@/styles/student_details';

type Params = {
  id:       string;
  name:     string;
  photoUrl: string;
};

const { width } = Dimensions.get('window');

export default function StudentDetail() {
  const router = useRouter();
  const { name, photoUrl } = useLocalSearchParams<Params>();

  return (
    <ScrollView style={styles.container}>
      {/* header */}
     <Header title='Student'/>
      {/* profile */}
      <Image source={{ uri: photoUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subTitle}>You have saved 3 images</Text>

      {/* TODO: render grid of that student’s images/videos */}
      <View style={styles.placeholderGrid}>
        <Text style={styles.placeholderText}>
          Your images/videos go here…
        </Text>
      </View>
    </ScrollView>
  );
}


