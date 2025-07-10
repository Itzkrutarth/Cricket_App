import React, { useRef, useState } from "react"
import { View, Text, Dimensions, StatusBar, StyleSheet } from "react-native"
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Header from "./Header_1"

const { width, height } = Dimensions.get("window")

const VideoPlayerScreen = () => {
	const router = useRouter()
	const params = useLocalSearchParams()
	const [status, setStatus] = useState<AVPlaybackStatus | null>(null)

	const videoRef = useRef<Video>(null) // Added ref

	const { title, description, videoSource, id, studentId } = params

	const getVideoSource = () => {
		if (typeof videoSource === "string" && videoSource.startsWith("https")) {
			return { uri: videoSource }
		}
		return require("../../assets/videos/jay.mp4") // fallback
	}

	const handleEditPress = async () => {
		// Pause video
		if (videoRef.current) {
			await videoRef.current.pauseAsync()
		}

		const secureUrl =
			typeof videoSource === "string" && videoSource.startsWith("http")
				? videoSource
				: ""

		// Navigate to annotation
		router.push({
			pathname: "/coach-home/videoAnnotation",
			params: {
				title: title?.toString() || "Video",
				videoSource: secureUrl,
				videoId: id,
				studentId: studentId,
			},
		})
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<Header
				title={"Video"} //temporary static given
				onEditPress={handleEditPress}
			/>

			{/* Video */}
			<View style={styles.videoContainer}>
				<Video
					ref={videoRef}
					key={Array.isArray(params.id) ? params.id[0] : params.id}
					source={{ uri: videoSource }}
					style={styles.video}
					useNativeControls
					resizeMode={ResizeMode.CONTAIN}
					isMuted={false}
					shouldPlay={true}
					onLoad={() => {
						console.log("✅ Video loaded")
						setTimeout(() => {
							if (videoRef.current) {
								videoRef.current
									.setStatusAsync({ shouldPlay: true, rate: 1 })
									.catch((err) => console.error("❌ setStatusAsync error", err))
							}
						}, 200)
					}}
					onPlaybackStatusUpdate={(status) => {
						console.log("🎬 Status", status)
					}}
					onError={(e) => {
						console.error("❌ Error playing video", e)
					}}
				/>
			</View>

			{/* Info */}
			<View style={styles.infoSection}>
				<Text style={styles.videoTitle}>{title}</Text>
				<Text style={styles.videoDescription}>{description}</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#000" },
	videoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	video: {
		width: width,
		height: height * 0.75,
	},
	infoSection: {
		padding: 20,
		backgroundColor: "#111",
	},
	videoTitle: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	videoDescription: {
		color: "#c9c9c9",
		fontSize: 14,
		lineHeight: 20,
	},
})

export default VideoPlayerScreen
