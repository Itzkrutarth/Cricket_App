// StudentDetail.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Feather } from "@expo/vector-icons";
import Header from "./Header_1";
import { styles } from "../../styles/student_details";

export default function StudentDetail() {
  const router = useRouter();
  const {
    id,
    name,
    photoUrl,
    role1 = "Batsman",
    email,
    phoneNumber,
    experience1 = "Aggressive right-handed batsman with excellent technique.",
    viewMode = "my",
  } = useLocalSearchParams();

  const recentVideos = [
    {
      id: "1",
      title: "Drive Practice",
      path: "../../assets/videos/jay.mp4",
      thumbnail: "https://picsum.photos/200/300?1",
    },
    {
      id: "2",
      title: "Cover Shot",
      path: "../../assets/videos/video.mp4",
      thumbnail: "https://picsum.photos/200/300?2",
    },
  ];

  const performance = {
    batting: 82,
    bowling: 15,
    fielding: 78,
  };

  return (
    <View style={styles.container}>
      <Header title="Student" />
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.card}>
          <Image source={{ uri: photoUrl }} style={styles.profileImage} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role1}</Text>
          {email && <Text style={styles.contact}>📧 {email}</Text>}
          {phoneNumber && <Text style={styles.contact}>📞 {phoneNumber}</Text>}
        </View>

        {/* Personal Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.experience}>{experience1}</Text>
        </View>

        {/* Performance Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.performanceMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Batting</Text>
              <Text style={styles.metricValue}>{performance.batting}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Bowling</Text>
              <Text style={styles.metricValue}>{performance.bowling}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Fielding</Text>
              <Text style={styles.metricValue}>{performance.fielding}%</Text>
            </View>
          </View>
        </View>

        {viewMode === "my" && (
          <>
            <Text style={styles.sectionTitle}>Recent Videos</Text>
            <View style={styles.videoGrid}>
              {recentVideos.map((video) => (
                <View key={video.id} style={{ marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/coach-home/VideoPlayerScreen",
                        params: {
                          videoPath: video.path,
                          title: video.title,
                        },
                      })
                    }
                  >
                    <Image
                      source={{ uri: video.thumbnail }}
                      style={styles.videoThumbnail}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                </View>
              ))}
            </View>

            {/* Saved/Annotated Video Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.savedButton]}
                onPress={() =>
                  router.push(`/coach-home/SavedVideo?studentId=${id}`)
                }
              >
                <Feather name="video" size={16} color="#fff" />
                <Text style={styles.actionText}>Saved Videos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.annotatedButton]}
                onPress={() =>
                  router.push(`/coach-home/AnnotatedVideos?studentId=${id}`)
                }
              >
                <Feather name="edit-3" size={16} color="#fff" />
                <Text style={styles.actionText}>Annotated Videos</Text>
              </TouchableOpacity>
            </View>

            {/* Record Video Button */}
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() =>
                router.push({
                  pathname: "/coach-home/RecordVideo",
                  params: { studentId: id },
                })
              }
            >
              <Entypo name="video-camera" size={24} color="#fff" />
              <Text style={styles.recordButtonText}>Record Video</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
