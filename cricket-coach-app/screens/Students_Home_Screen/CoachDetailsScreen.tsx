import React, { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import Header from "../../screens/Students_Home_Screen/Header_1"
import { styles } from "@/styles/coach_details"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Video, ResizeMode } from "expo-av"

type Coach = {
	id: string
	name?: string
	specialization?: string
	photoUrl?: string
	// Add other coach properties as needed
}

type Params = {
	id: string
	name: string
	photoUrl: string
	viewMode?: string
	coaches?: string // This is passed as a stringified JSON
}

type UploadedVideo = {
	videoUrl: string
	uploadedAt: string
	durationSeconds: number
}

export default function CoachDetailsScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<Params>()
	const [studentVideos, setStudentVideos] = useState<UploadedVideo[]>([])
	const studentId = useSelector((state: RootState) => state.user.id)
	// Properly type the coaches array
	const coaches: Coach[] = params.coaches ? JSON.parse(params.coaches) : []

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch(
					"https://becomebetter-api.azurewebsites.net/api/GetVideosByStudentCoach?code=AQ2nnLPZa_HBt30WGj-Rn28c5UVujkukSkSFQY9x-jDKAzFumuFCHQ==",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ studentId: studentId, coachId: params.id }),
					}
				)

				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`)
				}

				const data = await response.json()
				setStudentVideos(data)
			} catch (error) {
				console.error("Error fetching student-coach videos:", error)
			}
		}

		if (studentId && params.id) fetchVideos()
	}, [studentId, params.id])

	return (
		<View style={styles.container}>
			{/* Header */}
			<Header title="Coach Details" />

			<ScrollView style={styles.scrollContent}>
				{/* Profile */}
				<Image source={{ uri: params.photoUrl }} style={styles.profileImage} />
				<Text style={styles.name}>{params.name}</Text>
				<Text style={styles.subTitle}>
					Specialization:{" "}
					{coaches.find((c) => c.id === params.id)?.specialization ||
						"Not specified"}
				</Text>

				{/* Sample Shots Section */}
				<Text style={styles.sectionTitle}>Sample Shots</Text>

				<View style={styles.shotsContainer}>
					{studentVideos.length === 0 ? (
						<Text
							style={{ textAlign: "center", color: "#777", marginVertical: 10 }}
						>
							No videos uploaded for this coach yet.
						</Text>
					) : (
						studentVideos.map((video, idx) => (
							<View
								key={idx}
								style={{ marginBottom: 16, alignItems: "center" }}
							>
								<Video
									source={{ uri: video.videoUrl }}
									style={styles.videoThumbnail}
									useNativeControls
									resizeMode={ResizeMode.COVER}
								/>

								<Text style={styles.videoTitle}>
									Uploaded on {new Date(video.uploadedAt).toLocaleDateString()}{" "}
									({video.durationSeconds}s)
								</Text>
							</View>
						))
					)}
				</View>
				{/* Record Video Button */}
				<TouchableOpacity
					style={styles.recordButton}
					onPress={() =>
						router.push({
							pathname: "/coach-home/RecordVideo",
							params: { coachId: params.id }, // ✅ Pass coach ID
						})
					}
				>
					<Entypo name="video-camera" size={24} color="#fff" />
					<Text style={styles.recordButtonText}>Record Video</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}
