import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./Header_1";
import { styles } from "../../styles/student_details";

type Params = {
  studentId: string;
};

export default function SavedVideosScreen() {
  const { studentId } = useLocalSearchParams<Params>();
  const router = useRouter();

  // Placeholder for saved videos
  const savedVideos = [
    "https://picsum.photos/200/300?5",
    "https://picsum.photos/200/300?6",
    "https://picsum.photos/200/300?7",
    "https://picsum.photos/200/300?8",
  ];

  return (
    <View style={styles.container}>
      <Header title="Saved Videos" />

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>All Saved Videos</Text>

        <View style={styles.videoGrid}>
          {savedVideos.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
          ))}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => router.back()}
        >
          <Text style={styles.recordButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
