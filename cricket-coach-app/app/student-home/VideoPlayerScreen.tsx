import React from 'react';
import { View, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../screens/coach_Home_Screen/Header_1';
import { styles } from '../../styles/AllVideosStyles';

export default function VideoPlayerScreen() {
  const { videoSource, title, id } = useLocalSearchParams<{
    videoSource: string;
    title: string;
    id: string;
  }>();

  if (!videoSource || !title || !id) {
    return (
      <View style={styles.container}>
        <Header title="Video Player" />
        <Text style={styles.videoTitle}>Video not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={title} />
      <Video
        source={JSON.parse(videoSource)}
        style={styles.thumbnail}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        isLooping
      />
      <Text style={styles.videoTitle}>ID: {id}</Text>
    </View>
  );
}