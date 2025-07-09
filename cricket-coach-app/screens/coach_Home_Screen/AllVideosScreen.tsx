import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { styles } from "../../styles/AllVideosStyles";
import { Ionicons } from "@expo/vector-icons";
import Header from "./Header_1";
import { ResizeMode, Video } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / numColumns - 30;

// ============ API FUNCTIONS ============

const fetchVideosByCoach = async (email: string) => {
  try {
    const response = await fetch(
      `https://becomebetter-api.azurewebsites.net/api/GetVideosByCoach?coachEmail=${encodeURIComponent(
        email
      )}`
    );
    if (!response.ok) throw new Error("Failed to fetch videos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return [];
  }
};

const deleteVideoById = async (videoId: string) => {
  try {
    const response = await fetch(
      `https://becomebetter-api.azurewebsites.net/api/DeleteVideoById?id=${encodeURIComponent(
        videoId
      )}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to delete video");
    return true;
  } catch (error) {
    console.error("❌ Error deleting video:", error);
    return false;
  }
};

const AllVideosScreen = () => {
  const router = useRouter();
  const [videoData, setVideoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const userEmail = useSelector((state: RootState) => state.user.email);

  const [favorites, setFavorites] = useState<string[]>([]);
  const animations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

        // ============ API CODE ============

        console.log("📧 Current Coach Email:", userEmail);
        if (userEmail) {
          const videos = await fetchVideosByCoach(userEmail);
          const sorted = videos.sort(
            (a: any, b: any) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          );
          setVideoData(sorted);
          console.log("📹 Fetched Videos:", videos);
        }

        // ============ ASYNC STORAGE CODE (COMMENTED OUT) ============
        // const videos = await fetchVideosFromStorage()
        // setVideoData(videos)
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userEmail]);

  const toggleFavorite = async (videoId: string) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(videoId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== videoId);
    } else {
      updatedFavorites.push(videoId);
      // Trigger animation
      if (!animations[videoId]) animations[videoId] = new Animated.Value(1);
      Animated.sequence([
        Animated.timing(animations[videoId], {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animations[videoId], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleVideoPress = (video: any) => {
    router.push({
      pathname: "/coach-home/VideoPlayerScreen",
      params: {
        videoSource: video.sasUrl, // Using uri from API
        title: video.title || video.id || "Untitled Video",
        description: video.description || "No description available",
        id: video.id,
      },
    });
  };

  const handleDeleteVideo = async (videoId: string) => {
    Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // ============ API DELETE CODE ============
          const success = await deleteVideoById(videoId);
          if (success) {
            setVideoData((prev) => prev.filter((v) => v.id !== videoId));
          } else {
            Alert.alert("Error", "Failed to delete video.");
          }

          // ============ ASYNC STORAGE DELETE CODE (COMMENTED OUT) ============
          // const success = await deleteVideoFromStorage(videoId)
          // if (success) {
          // 	setVideoData((prev) =>
          // 		prev.filter((v) => v.id !== videoId)
          // 	)
          // } else {
          // 	Alert.alert("Error", "Failed to delete video.")
          // }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="All Videos" />
      <FlatList
        data={videoData || []}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          if (!animations[item.id]) animations[item.id] = new Animated.Value(1);
          return (
            <View style={[styles.item, { width: itemSize }]}>
              <View>
                <TouchableOpacity onPress={() => handleVideoPress(item)}>
                  <Video
                    source={{ uri: item.sasUrl }} // Using uri from API
                    style={styles.thumbnail}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    isLooping={false}
                    isMuted={true}
                  />
                </TouchableOpacity>
                {/* Delete Icon */}
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 16,
                    padding: 2,
                  }}
                  onPress={() => handleDeleteVideo(item.id)}
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
              <Text style={styles.videoTitle}>
                {item.title || item.id || "Untitled Video"}
              </Text>
              <Text
                style={{
                  color: item.feedbackStatus === "pending" ? "orange" : "green",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {item.feedbackStatus === "pending" ? "Pending" : "Reviewed"}
              </Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={{ alignSelf: "center", marginTop: 5 }}
              >
                <Animated.View
                  style={{ transform: [{ scale: animations[item.id] }] }}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavorite ? "red" : "gray"}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AllVideosScreen;
