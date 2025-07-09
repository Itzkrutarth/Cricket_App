import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./Header_1";
import { styles } from "../../styles/student_details";
import { ResizeMode, Video } from "expo-av";

type Params = {
  studentId: string;
  videos?: string; // JSON stringified video array
};

export default function SavedVideosScreen() {
  const { studentId, videos } = useLocalSearchParams<Params>();
  const router = useRouter();

  const parsedVideos = videos ? JSON.parse(videos) : [];
  const handleVideoPress = (video: any) => {
    router.push({
      pathname: "/coach-home/VideoPlayerScreen",
      params: {
        videoSource: video.sasUrl || video.videoUrl,
        title: video.title || video.id || "Untitled Video",
        id: video.id,
        description: video.description || "No description available",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Saved Videos" />

      <ScrollView style={styles.scrollContent}>
        {parsedVideos.length === 0 ? (
          <Text
            style={{ textAlign: "center", color: "#777", marginVertical: 10 }}
          >
            No saved videos available.
          </Text>
        ) : (
          <View style={styles.videoGrid}>
            {parsedVideos.map((video: any, index: number) => (
              <View key={index} style={{ width: "48%", marginBottom: 16 }}>
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
                      video.feedbackStatus === "pending" ? "orange" : "green",
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  {video.feedbackStatus === "pending" ? "Pending" : "Reviewed"}
                </Text>
              </View>
            ))}
          </View>
        )}

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
