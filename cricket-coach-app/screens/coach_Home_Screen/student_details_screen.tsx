// StudentDetail.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Feather } from "@expo/vector-icons";
import Header from "./Header_1";
import { styles } from "../../styles/student_details";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ResizeMode, Video } from "expo-av";

export default function StudentDetail() {
  const router = useRouter();
  const coachEmail = useSelector((state: RootState) => state.user.email);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  const fetchStudentCoachVideos = async () => {
    if (!email || !coachEmail) return;

    try {
      const response = await fetch(
        `https://becomebetter-api.azurewebsites.net/api/GetVideosByStudentCoach?studentId=${encodeURIComponent(
          email as string
        )}&coachId=${encodeURIComponent(coachEmail)}`
      );
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      setRecentVideos(sorted);
    } catch (error) {
      console.error("❌ Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "my") {
      fetchStudentCoachVideos();
    }
  }, []);

  const performance = {
    batting: 82,
    bowling: 15,
    fielding: 78,
  };
  const handleVideoPress = (video: any) => {
    router.push({
      pathname: "/coach-home/VideoPlayerScreen",
      params: {
        videoSource: video.sasUrl, // Using uri from API
        title: video.title || video.id || "Untitled Video",
        id: video.id,
        description: video.description || "No description available",
        studentId: video.recordedFor, // Ensure this is the correct field
      },
    });
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
              {recentVideos.length === 0 ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#777",
                    marginVertical: 10,
                  }}
                >
                  No videos uploaded yet.
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {recentVideos.slice(0, 2).map((video, idx) => (
                    <View key={idx} style={{ width: "48%", marginBottom: 16 }}>
                      <TouchableOpacity onPress={() => handleVideoPress(video)}>
                        <Video
                          source={{ uri: video.sasUrl || video.videoUrl }}
                          style={{
                            width: "100%",
                            height: 160,
                            borderRadius: 8,
                          }}
                          resizeMode={ResizeMode.CONTAIN}
                          shouldPlay={false}
                          isMuted
                          isLooping={false}
                          useNativeControls={false}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        {video.title || "Untitled Video"}
                      </Text>
                      <Text
                        style={{
                          color:
                            video.feedbackStatus === "pending"
                              ? "orange"
                              : "green",
                          fontSize: 12,
                          textAlign: "center",
                          marginTop: 2,
                        }}
                      >
                        {video.feedbackStatus === "pending"
                          ? "Pending"
                          : "Reviewed"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Saved/Annotated Video Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.savedButton]}
                onPress={
                  () =>
                    router.push({
                      pathname: "/coach-home/SavedVideo",
                      params: {
                        studentId: id,
                        videos: JSON.stringify(recentVideos), // send videos directly
                      },
                    })
                  // router.push(`/coach-home/SavedVideo?studentId=${id}`)
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
                  params: { coachId: coachEmail, studentEmail: email },
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
