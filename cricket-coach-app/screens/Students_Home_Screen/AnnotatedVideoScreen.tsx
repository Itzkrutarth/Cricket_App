import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./Header_1";
import { styles } from "../../styles/student_details";

// Annotated video type
type AnnotatedVideo = {
  id: string;
  videoId: string;
  annotationUrl: string;
  videoUrl: string;
  recordedFor: string;
  uploadedBy: string;
  assignedCoachId: string;
  uploadedAt: string;
  title: string;
  description: string;
  annotations?: any;
  annotationError?: string;
};

export default function AnnotatedVideosScreen() {
  const { studentId, coachEmail } = useLocalSearchParams();
  const router = useRouter();
  const [videos, setVideos] = useState<AnnotatedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const queryParam = studentId
          ? `studentEmail=${studentId}`
          : `coachEmail=${coachEmail}`;
        const endpoint = studentId
          ? "getAnnotationsByStudent"
          : "getAnnotationsByCoach";

        const res = await fetch(
          `https://becomebetter-api.azurewebsites.net/api/${endpoint}?${queryParam}`
        );
        const data = await res.json();

        const videosWithAnnotations = await Promise.all(
          (data || []).map(async (video: AnnotatedVideo) => {
            try {
              if (video.annotationUrl) {
                const annotationRes = await fetch(video.annotationUrl);
                if (!annotationRes.ok) {
                  return {
                    ...video,
                    annotationError: `(${annotationRes.status})`,
                  };
                }

                const text = await annotationRes.text();
                if (text.trim().startsWith("<")) {
                  return { ...video, annotationError: "Invalid format" };
                }

                const parsed = JSON.parse(text);
                const annotations = parsed.annotations || parsed;

                return { ...video, annotations };
              }
              return video;
            } catch (err) {
              return { ...video, annotationError: "Load failed" };
            }
          })
        );

        setVideos(videosWithAnnotations);
      } catch (err) {
        console.error("Error loading videos:", err);
      } finally {
        setLoading(false);
      }
   console.log("Videos fetched:------------------", coachEmail);
    };

    if (studentId || coachEmail) fetchVideos();
  }, [studentId, coachEmail]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar hidden />
      <Header title="Annotated Videos" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
          Annotated Sessions
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1D4ED8" />
        ) : videos.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 32 }}>
            No annotated videos available.
          </Text>
        ) : (
          videos.map((video, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/coach-home/vp",
                  params: {
                    videoSource: video.videoUrl ?? video.annotationUrl,
                    title: video.title,
                    id: video.videoId,
                    description: video.description,
                    studentId: video.recordedFor,
                    annotations: JSON.stringify(video.annotations || []),
                    hasAnnotations: video.annotations ? "true" : "false",
                  },
                })
              }
              style={{
                backgroundColor: "#1a1a1a",
                padding: 12,
                borderRadius: 12,
                marginBottom: 20,
                elevation: 2,
              }}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/fluency/240/video-playlist.png",
                }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />

              <Text
                style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
              >
                {video.title}
              </Text>
              <Text style={{ color: "#ccc", fontSize: 13, marginTop: 2 }}>
                {video.description}
              </Text>
              <Text style={{ color: "#777", fontSize: 11, marginTop: 4 }}>
                Uploaded: {new Date(video.uploadedAt).toLocaleString()}
              </Text>

              {video.annotations ? (
                <Text style={{ color: "#FFD700", fontSize: 11, marginTop: 4 }}>
                  {video.annotations.length} annotations
                </Text>
              ) : video.annotationError ? (
                <Text style={{ color: "#FF6B6B", fontSize: 11, marginTop: 4 }}>
                  Annotations unavailable: {video.annotationError}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[styles.recordButton, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.recordButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
