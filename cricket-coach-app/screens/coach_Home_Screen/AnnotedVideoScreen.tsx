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

export default function AnnotatedVideosScreen() {
  const { studentId } = useLocalSearchParams<Params>();
  const router = useRouter();

  // Placeholder for annotated videos
  const annotatedVideos = [
    "https://picsum.photos/200/300?10",
    "https://picsum.photos/200/300?11",
    "https://picsum.photos/200/300?12",
    "https://picsum.photos/200/300?13",
  ];

  return (
    <View style={styles.container}>
      <Header title="Annotated Videos" />

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Videos with Annotations</Text>

        <View style={styles.videoGrid}>
          {annotatedVideos.map((uri, index) => (
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
