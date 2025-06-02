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
import Header from './Header_1';
import { styles } from '../../styles/student_details';

type Params = {
  id:       string;
  name:     string;
  photoUrl: string;
};

export default function StudentDetail() {
  const router = useRouter();
  const { id, name, photoUrl } = useLocalSearchParams<Params>();

  // placeholder URIs for sample cricket shots
  const sampleShots = [
    'https://picsum.photos/200/200?cricket1',
    'https://picsum.photos/200/200?cricket2',
    'https://picsum.photos/200/200?cricket3',
    'https://picsum.photos/200/200?cricket4',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Student" />

      <ScrollView style={styles.scrollContent}>
        {/* Profile */}
        <Image source={{ uri: photoUrl }} style={styles.profileImage} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subTitle}>You have saved 3 images</Text>

        {/* Sample Shots Section */}
        <Text style={styles.sectionTitle}>Sample Shots</Text>
        <View style={styles.shotsContainer}>
          {sampleShots.reduce((rows, uri, idx) => {
            if (idx % 2 === 0) {
              rows.push([uri]);
            } else {
              rows[rows.length - 1].push(uri);
            }
            return rows;
          }, []).map((row, rowIdx) => (
            <View key={rowIdx} style={styles.shotRow}>
              {row.map((uri, colIdx) => (
                <Image
                  key={`${rowIdx}-${colIdx}`}
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
              params: { studentId: id },
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