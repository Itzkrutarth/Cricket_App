import React, { useCallback, useEffect, useState } from "react"
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import Header from "../../screens/Students_Home_Screen/Header_1"
import { styles } from "@/styles/coach_details"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Video, ResizeMode } from "expo-av"
import { useFocusEffect } from "@react-navigation/native"

type Coach = {
	id: string
	name?: string
	specialization?: string
	photoUrl?: string
}

type Params = {
	id: string
	name: string
	photoUrl: string
	viewMode?: string
	coaches?: string
}

type UploadedVideo = {
	id: string
	videoUrl: string
	uploadedBy: string
	ownerId: string
	assignedCoachId: string
	visibleTo: string[]
	type: string
	linkedVideoId: string | null
	isPrivate: boolean
	durationSeconds: number
	feedbackStatus: string
	uploadedAt: string
	sasUrl?: string
}

const fetchedCoaches: { [key: string]: boolean } = {}

export default function CoachDetailsScreen() {
	const router = useRouter()
	const params = useLocalSearchParams<Params>()
	const [studentVideos, setStudentVideos] = useState<UploadedVideo[]>([])
	const [loading, setLoading] = useState(false)
	const studentId = useSelector((state: RootState) => state.user.id)
	const coaches: Coach[] = params.coaches ? JSON.parse(params.coaches) : []
	const coachId = params.id

	const fetchVideos = async () => {
		setLoading(true)
		try {
			const response = await fetch(
				`https://becomebetter-api.azurewebsites.net/api/GetVideosByStudentCoach?studentId=${encodeURIComponent(
					studentId
				)}&coachId=${encodeURIComponent(coachId)}`
			)
			const data = await response.json()
			setStudentVideos(data)
			fetchedCoaches[coachId] = true
		} catch (error) {
			console.error("Error fetching student-coach videos:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchedCoaches[coachId] = false
	}, [coachId])

	useFocusEffect(
		useCallback(() => {
			if (studentId && coachId && !fetchedCoaches[coachId]) {
				fetchVideos()
			}
		}, [studentId, coachId])
	)

	return (
		<View style={styles.container}>
			<Header title="Coach Details" />
			<ScrollView
				style={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={() => {
							fetchedCoaches[coachId] = false
							fetchVideos()
						}}
					/>
				}
			>
				<Image source={{ uri: params.photoUrl }} style={styles.profileImage} />
				<Text style={styles.name}>{params.name}</Text>
				<Text style={styles.subTitle}>
					Specialization:{" "}
					{coaches.find((c) => c.id === params.id)?.specialization ||
						"Not specified"}
				</Text>
				<Text style={styles.sectionTitle}>Sample Shots</Text>
				<View style={styles.shotsContainer}>
					{studentVideos.length === 0 ? (
						<Text
							style={{ textAlign: "center", color: "#777", marginVertical: 10 }}
						>
							No videos uploaded for this coach yet.
						</Text>
					) : (
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								justifyContent: "space-between",
							}}
						>
							{studentVideos.map((video, idx) => (
								<View key={idx} style={{ width: "48%", marginBottom: 16 }}>
									<TouchableOpacity
										onPress={() =>
											router.navigate({
												pathname: "/coach-home/VideoPlayerScreen",
												params: {
													videoSource: video.sasUrl || video.videoUrl,
													title: video.id,
													id: video.id,
												},
											})
										}
									>
										<Video
											source={{ uri: video.sasUrl || video.videoUrl }}
											style={{
												width: "100%",
												height: 160,
												borderRadius: 8,
											}}
											resizeMode={ResizeMode.CONTAIN}
											shouldPlay={false}
											isMuted
											isLooping={false}
											useNativeControls={false}
										/>
									</TouchableOpacity>
									<Text
										style={{ fontSize: 12, marginTop: 4, textAlign: "center" }}
									>
										{new Date(video.uploadedAt).toLocaleDateString()} (
										{video.durationSeconds}s)
									</Text>
									<Text
										style={{
											color:
												video.feedbackStatus === "pending" ? "orange" : "green",
											fontSize: 12,
											textAlign: "center",
											marginTop: 2,
										}}
									>
										{video.feedbackStatus === "pending"
											? "Pending"
											: "Reviewed"}
									</Text>
								</View>
							))}
						</View>
					)}
				</View>
				<TouchableOpacity
					style={styles.recordButton}
					onPress={() =>
						router.push({
							pathname: "/coach-home/RecordVideo",
							params: {
								coachId: params.id, // coach's email/id
								studentEmail: studentId, // student is the logged-in user
							},
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
