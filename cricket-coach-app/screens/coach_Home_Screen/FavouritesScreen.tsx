import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { styles } from "../../styles/FavouritesStyles";
import Header from "./Header_1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / numColumns - 30;

// Fetch videos by coach (reuse logic from AllVideosScreen)
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

const FavouritesScreen = () => {
  const [favoriteVideos, setFavoriteVideos] = useState<any[]>([]);
  const router = useRouter();
  const userEmail = useSelector((state: RootState) => state.user.email);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      if (userEmail) {
        const allVideos = await fetchVideosByCoach(userEmail);
        const favVideos = allVideos.filter((video: any) =>
          favoriteIds.includes(video.id)
        );
        setFavoriteVideos(favVideos);
      }
    };
    loadFavorites();
  }, [userEmail]);

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
      <Header title="Favourites" />
      {favoriteVideos.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50, color: "#666" }}>
          No favourites yet!
        </Text>
      ) : (
        <FlatList
          data={favoriteVideos}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, { width: itemSize }]}
              onPress={() => handleVideoPress(item)}
            >
              <Video
                source={{ uri: item.sasUrl }}
                style={styles.thumbnail}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isLooping={false}
                isMuted={true}
              />
              <Text style={styles.videoTitle}>
                {item.title || "Untitled Video"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default FavouritesScreen;
