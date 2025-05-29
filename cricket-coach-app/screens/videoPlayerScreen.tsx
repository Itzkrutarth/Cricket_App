import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState({});

  const { title, videoSource } = params;

  const getVideoSource = () => {
    if (typeof videoSource === 'string' && videoSource.startsWith('http')) {
      return { uri: videoSource };
    }
    return require('../assets/videos/video.mp4');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="blue" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          onPress={() => router.push('/coach-home/videoAnnotation')}
          style={styles.annotationIcon}
        >
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Video */}
      <View style={styles.videoContainer}>
        <Video
          source={getVideoSource()}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDescription}>
          This is a training video for coaches. Use the controls to play, pause, and seek through the video.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 15,
  },
  title: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  annotationIcon: {
    padding: 8,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  video: {
    width: width,
    height: height * 0.75,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  videoTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoDescription: {
    color: '#c9c9c9',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoPlayerScreen;
