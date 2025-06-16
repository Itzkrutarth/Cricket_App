import React, { useState, useEffect, useRef } from "react"
import {
	View,
	Text,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Animated,
} from "react-native"

import { useRouter } from "expo-router"
import { styles } from "../../styles/AllVideosStyles"
import { Ionicons } from "@expo/vector-icons"
import Header from "./Header_1"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ResizeMode, Video } from "expo-av"

const numColumns = 2
const screenWidth = Dimensions.get("window").width
const itemSize = screenWidth / numColumns - 30

const fetchVideosByCoach = async (email: string) => {
	try {
		const response = await fetch(
			`https://becomebetter-api.azurewebsites.net/api/GetVideosByCoach?coachEmail=${encodeURIComponent(
				email
			)}`
		)
		if (!response.ok) throw new Error("Failed to fetch videos")
		const data = await response.json()
		return data
	} catch (error) {
		console.error("❌ Error fetching videos:", error)
		return []
	}
}

const AllVideosScreen = () => {
	const router = useRouter()
	const [videoData, setVideoData] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	const [favorites, setFavorites] = useState<string[]>([])
	const animations = useRef<{ [key: string]: Animated.Value }>({}).current

	useEffect(() => {
		const loadData = async () => {
			try {
				const storedFavorites = await AsyncStorage.getItem("favorites")
				if (storedFavorites) setFavorites(JSON.parse(storedFavorites))

				const email = await AsyncStorage.getItem("@userEmail")
				console.log("📧 Current Coach Email:", email)
				if (email) {
					const videos = await fetchVideosByCoach(email)
					setVideoData(videos)
				}
			} catch (err) {
				console.error("Error loading data", err)
			} finally {
				setLoading(false)
			}
		}
		loadData()
	}, [])

	const toggleFavorite = async (videoId: string) => {
		let updatedFavorites = [...favorites]
		if (favorites.includes(videoId)) {
			updatedFavorites = updatedFavorites.filter((id) => id !== videoId)
		} else {
			updatedFavorites.push(videoId)
			// Trigger animation
			if (!animations[videoId]) animations[videoId] = new Animated.Value(1)
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
			]).start()
		}
		setFavorites(updatedFavorites)
		await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
	}

	const handleVideoPress = (video: any) => {
		router.push({
			pathname: "/coach-home/VideoPlayerScreen",
			params: {
				videoSource: video.videoUrl,
				title: video.title || "Untitled Video",
				id: video.id,
			},
		})
	}

	return (
		<View style={styles.container}>
			<Header title="All Videos" />
			<FlatList
				data={videoData || []} // ✅ avoid undefined
				keyExtractor={(item) => item.id}
				numColumns={numColumns}
				renderItem={({ item }) => {
					const isFavorite = favorites.includes(item.id)
					if (!animations[item.id]) animations[item.id] = new Animated.Value(1)
					return (
						<View style={[styles.item, { width: itemSize }]}>
							<TouchableOpacity onPress={() => handleVideoPress(item)}>
								<Video
									source={{ uri: item.videoUrl }}
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
					)
				}}
			/>
		</View>
	)
}

export default AllVideosScreen
