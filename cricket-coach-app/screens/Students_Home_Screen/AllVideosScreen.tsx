import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/AllVideosStyles';
import Header from './Header_1';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';



const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 30;



const AllVideosScreen = () => {
  const router = useRouter();
const studentEmail = useSelector((state: RootState) => state.user.email);
const [videoData, setVideoData] = useState<any[]>([]);

 const handleVideoPress = (video: any) => {
  router.push({
    pathname: "/coach-home/VideoPlayerScreen",
    params: {
      videoSource: video.sasUrl, // or video.uri
      title: video.title,
      id: video.id
    }
  });
};

useEffect(() => {
	const fetchVideosForStudent = async () => {
		try {
      console.log("student is ",studentEmail)
			const response = await fetch(
				`https://becomebetter-api.azurewebsites.net/api/GetVideosForStudent?studentEmail=${encodeURIComponent(
					studentEmail
				)}`
			);
			const data = await response.json();
			setVideoData(data);
		} catch (error) {
			console.error("❌ Error fetching videos for student:", error);
		}
	};

	if (studentEmail) {
		fetchVideosForStudent();
	}
}, [studentEmail]);


   return (
  <View style={styles.container}>
    <Header title="All Videos" />
    <FlatList
      data={videoData || []}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.item, { width: itemSize }]}>
          <TouchableOpacity onPress={() => handleVideoPress(item)}>
            <Video
              source={{ uri: item.sasUrl }} // Use the SAS URL
              style={styles.thumbnail}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              isMuted={true}
            />
          </TouchableOpacity>
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
        </View>
      )}
    />
  </View>
)

};

export default AllVideosScreen;