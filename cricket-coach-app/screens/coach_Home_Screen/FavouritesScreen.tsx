import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/FavouritesStyles';
import Header from './Header_1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

// All available videos (same as in AllVideosScreen)
const videoData = [
  { id: '1', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 1' },
  { id: '2', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 2' },
  { id: '3', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 3' },
  { id: '4', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 4' },
  // Add more videos here if needed...
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const FavouritesScreen = () => {
  const [favoriteVideos, setFavoriteVideos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const favVideos = videoData.filter((video) => favoriteIds.includes(video.id));
        setFavoriteVideos(favVideos);
      }
    };
    loadFavorites();
  }, []);

  const handleVideoPress = (video: any) => {
    router.push({
      pathname: '/coach-home/VideoPlayerScreen',
      params: {
        videoSource: JSON.stringify(video.video),
        title: video.title,
        id: video.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Favourites" />
      {favoriteVideos.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
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
                source={item.video}
                style={styles.thumbnail}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isLooping={false}
                isMuted={true}
              />
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default FavouritesScreen;
