import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Feather } from "@expo/vector-icons";
import Header from "../../screens/Students_Home_Screen/Header_1";
import { styles } from "@/styles/coach_details";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Video, ResizeMode } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

type Coach = {
  id: string;
  name?: string;
  specialization?: string;
  photoUrl?: string;
};

type UploadedVideo = {
  id: string;
  videoUrl: string;
  uploadedBy: string;
  ownerId: string;
  assignedCoachId: string;
  visibleTo: string[];
  type: string;
  linkedVideoId: string | null;
  isPrivate: boolean;
  durationSeconds: number;
  feedbackStatus: string;
  uploadedAt: string;
  sasUrl?: string;
  title: string;
  description: string;
};

type Params = {
  id: string;
  name: string;
  photoUrl: string;
  viewMode?: string;
  coaches?: string;
};

const fetchedCoaches: { [key: string]: boolean } = {};

export default function CoachDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const [coachVideos, setCoachVideos] = useState<UploadedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const studentId = useSelector((state: RootState) => state.user.id);
  const coachId = params.id;
  const coaches: Coach[] = params.coaches ? JSON.parse(params.coaches) : [];

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://becomebetter-api.azurewebsites.net/api/GetVideosByStudentCoach?studentId=${encodeURIComponent(
          studentId
        )}&coachId=${encodeURIComponent(coachId)}`
      );
      const data = await response.json();
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      setCoachVideos(sorted);
      fetchedCoaches[coachId] = true;
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedCoaches[coachId] = false;
  }, [coachId]);

  useFocusEffect(
    useCallback(() => {
      if (studentId && coachId && !fetchedCoaches[coachId]) {
        fetchVideos();
      }
    }, [studentId, coachId])
  );

  const handleVideoPress = (video: UploadedVideo) => {
    router.push({
      pathname: "/coach-home/VideoPlayerScreen",
      params: {
        videoSource: video.sasUrl || video.videoUrl,
        title: video.title,
        id: video.id,
        description: video.description,
      },
    });
  };

  const coach = coaches.find((c) => c.id === coachId);

  return (
    <View style={styles.container}>
      <Header title="Coach" />
      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchedCoaches[coachId] = false;
              fetchVideos();
            }}
          />
        }
      >
        {/* Coach Card */}
        <View style={styles.card}>
          <Image source={{ uri: params.photoUrl }} style={styles.profileImage} />
          <Text style={styles.name}>{params.name}</Text>
          <Text style={styles.role}>{coach?.specialization || "Specialist"}</Text>
        </View>

        {/* Experience / Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Coach Bio</Text>
          <Text style={styles.experience}>
            {coach?.specialization
              ? `Expertise in ${coach.specialization} with a strong coaching background.`
              : "Dedicated to improving student performance through strategic training and analysis."}
          </Text>
        </View>

        {/* Video Section */}
        <Text style={styles.sectionTitle}>Recent Videos</Text>
        <View style={styles.videoGrid}>
          {coachVideos.length === 0 ? (
            <Text
              style={{ textAlign: "center", color: "#777", marginVertical: 10 }}
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
              {coachVideos.slice(0, 2).map((video, idx) => (
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
                    {video.title}
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
                    {video.feedbackStatus === "pending"
                      ? "Pending"
                      : "Reviewed"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.savedButton]}
            onPress={() =>
              router.push({
                pathname: "/coach-home/SavedVideo",
                params: {
                  studentId: studentId,
                  videos: JSON.stringify(coachVideos),
                },
              })
            }
          >
            <Feather name="video" size={16} color="#fff" />
            <Text style={styles.actionText}>Saved Videos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.annotatedButton]}
            onPress={() =>
              router.push(`/coach-home/AnnotatedVideos?studentId=${studentId}`)
            }
          >
            <Feather name="edit-3" size={16} color="#fff" />
            <Text style={styles.actionText}>Annotated Videos</Text>
          </TouchableOpacity>
        </View>

        {/* Record Button */}
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() =>
            router.push({
              pathname: "/coach-home/RecordVideo",
              params: {
                coachId: coachId,
                studentEmail: studentId,
              },
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
