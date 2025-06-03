import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/AllVideosStyles';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header_1';
import AsyncStorage from '@react-native-async-storage/async-storage';

const videoData = [
  { id: '1', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 1' },
  { id: '2', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 2' },
  { id: '3', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 3' },
  { id: '4', video: require('../../assets/videos/jay.mp4'), title: 'Training Video 4' },
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const AllVideosScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const animations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (videoId: string) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(videoId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== videoId);
    } else {
      updatedFavorites.push(videoId);
      // Trigger animation
      if (!animations[videoId]) animations[videoId] = new Animated.Value(1);
      Animated.sequence([
        Animated.timing(animations[videoId], { toValue: 1.5, duration: 150, useNativeDriver: true }),
        Animated.timing(animations[videoId], { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleVideoPress = (video: any) => {
    router.push({
      pathname: '/coach-home/VideoPlayerScreen',
      params: { videoSource: JSON.stringify(video.video), title: video.title, id: video.id },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="All Videos" />
      <FlatList
        data={videoData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          if (!animations[item.id]) animations[item.id] = new Animated.Value(1);
          return (
            <View style={[styles.item, { width: itemSize }]}>
              <TouchableOpacity onPress={() => handleVideoPress(item)}>
                <Video
                  source={item.video}
                  style={styles.thumbnail}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                  isLooping={false}
                  isMuted={true}
                />
              </TouchableOpacity>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={{ alignSelf: 'center', marginTop: 5 }}
              >
                <Animated.View style={{ transform: [{ scale: animations[item.id] }] }}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? 'red' : 'gray'}
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
