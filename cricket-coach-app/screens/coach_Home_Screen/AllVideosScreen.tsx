import React from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/AllVideosStyles';
import Header from './Header_1';

const videoData = [
  { 
    id: '1', 
    video: require('../../assets/videos/jay.mp4'),
    title: 'Training Video 1'
  },
  { 
    id: '2', 
    video: require('../../assets/videos/jay.mp4'),
    title: 'Training Video 2'
  },
  { 
    id: '3', 
    video: require('../../assets/videos/jay.mp4'),
    title: 'Training Video 3'
  },
  { 
    id: '4', 
    video: require('../../assets/videos/jay.mp4'),
    title: 'Training Video 4'
  },
  // Add more videos here...
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const AllVideosScreen = () => {
  const router = useRouter();

  const handleVideoPress = (video: any) => {
    router.push({
      pathname: '/coach-home/VideoPlayerScreen',
      params: {
        videoSource: JSON.stringify(video.video), // For local videos
        title: video.title,
        id: video.id
      }
    });
  };

  return (
    <View style={styles.container}>
     <Header title='All Videos'/>
      <FlatList
        data={videoData}
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
    </View>
  );
};

export default AllVideosScreen;