import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { styles } from '../styles/AllVideosStyles';
import Header from './Header_1';
const videoData = [
  { id: '1', thumbnail: require('../assets/videos/video.mp4') },
  { id: '2', thumbnail: require('../assets/videos/video.mp4') },
  { id: '3', thumbnail: require('../assets/videos/video.mp4') },
  { id: '4', thumbnail: require('../assets/videos/video.mp4') },
  // Add more video thumbnails here...
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;

const AllVideosScreen = () => {
  return (
    <View style={styles.container}>
     <Header title='All Videos'/>
      <FlatList
        data={videoData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: itemSize }]}>
            <Image source={item.thumbnail} style={styles.thumbnail} />
          </View>
        )}
      />
    </View>
  );
};

export default AllVideosScreen;
