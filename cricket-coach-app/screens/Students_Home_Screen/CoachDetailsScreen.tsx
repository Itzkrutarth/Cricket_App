import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import Header from '../../screens/Students_Home_Screen/Header_1';
import { styles } from '../../styles/student_details';

type Coach = {
  id: string;
  name?: string;
  specialization?: string;
  photoUrl?: string;
  // Add other coach properties as needed
};

type Params = {
  id: string;
  name: string;
  photoUrl: string;
  viewMode?: string;
  coaches?: string; // This is passed as a stringified JSON
};

export default function CoachDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  // Properly type the coaches array
  const coaches: Coach[] = params.coaches ? JSON.parse(params.coaches) : [];

  // placeholder URIs for sample cricket shots
  const sampleShots: string[] = [
    'https://picsum.photos/200/200?cricket1',
    'https://picsum.photos/200/200?cricket2',
    'https://picsum.photos/200/200?cricket3',
    'https://picsum.photos/200/200?cricket4',
  ];

  // Create rows with 2 images each
  const createImageRows = (images: string[]): string[][] => {
    const rows: string[][] = [];
    for (let i = 0; i < images.length; i += 2) {
      const row = images.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  };

  const imageRows = createImageRows(sampleShots);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Coach Details" />

      <ScrollView style={styles.scrollContent}>
        {/* Profile */}
        <Image source={{ uri: params.photoUrl }} style={styles.profileImage} />
        <Text style={styles.name}>{params.name}</Text>
        <Text style={styles.subTitle}>
          Specialization: {coaches.find(c => c.id === params.id)?.specialization || 'Not specified'}
        </Text>

        {/* Sample Shots Section */}
        <Text style={styles.sectionTitle}>Sample Shots</Text>
        <View style={styles.shotsContainer}>
          {imageRows.map((row, rowIdx) => (
            <View key={`row-${rowIdx}`} style={styles.shotRow}>
              {row.map((uri, colIdx) => (
                <Image
                  key={`img-${rowIdx}-${colIdx}`}
                  source={{ uri }}
                  style={styles.shotImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          ))}
        </View>

        {/* Record Video Button */}
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() =>
            router.push({
              pathname: '/coach-home/RecordVideo',
              params: { studentId: params.id },
            })
          }
        >
          <Entypo name="video-camera" size={24} color="#fff" />
          <Text style={styles.recordButtonText}>Record Video</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}