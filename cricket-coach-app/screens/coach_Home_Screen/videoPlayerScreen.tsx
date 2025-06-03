import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "./Header_1";

const { width, height } = Dimensions.get("window");

const VideoPlayerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState({});
  const videoRef = useRef<Video>(null); // Added ref

  const { title, videoPath } = params;

  const getVideoSource = () => {
    if (typeof videoPath === "string" && videoPath.startsWith("http")) {
      return { uri: videoPath };
    }
    return require("../../assets/videos/jay.mp4"); // fallback
  };

  const handleEditPress = async () => {
    // Pause video
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }
    // Navigate to annotation
    router.push({
      pathname: "/coach-home/videoAnnotation",
      params: { title: title?.toString() || "Video" },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Header
        title={title?.toString() || "Video"}
        onEditPress={handleEditPress}
      />

      {/* Video */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef} // Attach ref
          source={getVideoSource()}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDescription}>
          This is a training video for coaches. Use the controls to play, pause,
          and seek through the video.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height * 0.75,
  },
  infoSection: {
    padding: 20,
    backgroundColor: "#111",
  },
  videoTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  videoDescription: {
    color: "#c9c9c9",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoPlayerScreen;
