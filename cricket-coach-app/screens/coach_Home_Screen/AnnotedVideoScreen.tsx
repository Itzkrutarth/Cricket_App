import React, { useEffect, useState } from "react"
import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Header from "./Header_1"
import { styles } from "../../styles/student_details"

type AnnotatedVideo = {
	videoId: string
	videoThumbnail: string
	sessionTitle: string
	videoUri: string
}

export default function AnnotatedVideosScreen() {
	const { studentId } = useLocalSearchParams()
	const router = useRouter()
	const [videos, setVideos] = useState<AnnotatedVideo[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await fetch(
					`https://<your-api>.azurewebsites.net/api/GetAnnotatedVideos?studentId=${studentId}`
				)
				const data = await res.json()
				setVideos(data || [])
			} catch (err) {
				console.error("Error loading videos:", err)
			} finally {
				setLoading(false)
			}
		}

		fetchVideos()
	}, [studentId])

	return (
		<View style={styles.container}>
			<Header title="Annotated Videos" />
			<ScrollView style={styles.scrollContent}>
				<Text style={styles.sectionTitle}>Videos with Annotations</Text>

				{loading ? (
					<ActivityIndicator size="large" color="#1D4ED8" />
				) : videos.length === 0 ? (
					<Text style={{ textAlign: "center", marginTop: 20 }}>
						No annotated videos yet.
					</Text>
				) : (
					<View style={styles.videoGrid}>
						{videos.map((video, index) => (
							<TouchableOpacity
								key={index}
								onPress={() =>
									router.push({
										pathname: "/student-home/VideoPlayerScreen",
										params: {
											videoId: video.videoId,
											videoUri: video.videoUri,
											studentId,
										},
									})
								}
							>
								<Image
									source={{ uri: video.videoThumbnail }}
									style={styles.videoThumbnail}
									resizeMode="cover"
								/>
								<Text style={styles.videoLabel}>{video.sessionTitle}</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				<TouchableOpacity
					style={styles.recordButton}
					onPress={() => router.back()}
				>
					<Text style={styles.recordButtonText}>Back</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}
