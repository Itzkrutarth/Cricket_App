// src/components/StudentHome.tsx
//import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState, useCallback } from "react"
import {
	Image,
	Text,
	TouchableOpacity,
	View,
	ScrollView,
	Modal,
	Alert,
	RefreshControl,
	ActivityIndicator,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { styles } from "../../styles/StudentHomeStyles"
import {
	Coach,
	Event,
	Video,
	StudentStats,
	dummyCoaches,
	dummyCoachRequests,
	dummyEvents,
	dummyVideos,
	getEventColor,
} from "../../app/student-home/CoachData"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const StudentHomeContent = () => {
	const params = useLocalSearchParams()
	const [coachCount, setCoachCount] = useState(0)
	const [selectedRequest, setSelectedRequest] = useState<Coach | null>(null)
	const [coaches, setCoaches] = useState<Coach[]>(dummyCoaches)
	const [coachRequests, setCoachRequests] =
		useState<Coach[]>(dummyCoachRequests)
	const [events, setEvents] = useState<Event[]>(dummyEvents)
	const [videos, setVideos] = useState<Video[]>(dummyVideos)
	const [refreshing, setRefreshing] = useState(false)
	const [loading, setLoading] = useState(true)

	const studentName = useSelector((state: RootState) => state.user.name)
	const profileUrl = useSelector(
		(state: RootState) => state.user.profilePicture
	)

	const [stats, setStats] = useState({
	myCoach: 0,
	totalCoaches: 0,
	sessions: 0, // placeholder — keep your existing logic or add API later
	videos: 0,
	events: 0,   // optional if not using API yet
})


	// Calculate stats
	const calculateStats = useCallback(() => {
		const myCoach = coaches.filter((c) => c.isMyCoach).length
		const totalCoaches = coaches.length
		const upcomingEvents = events.filter(
			(e) => new Date(e.date) >= new Date()
		).length

		setStats({
			myCoach,
			totalCoaches,
			sessions: upcomingEvents,
			videos: videos.length,
			events: events.length,
		})
	}, [coaches, events, videos])

	useEffect(() => {
		const fetchCoachCount = async () => {
			try {
				const response = await fetch(
					"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Coach"
				)
				const data = await response.json()
				setCoachCount(data.length || 0)
			} catch (err) {
				console.error("❌ Failed to load coach count", err)
			} finally {
				setLoading(false) // ✅ make sure loading stops
			}
		}

		fetchCoachCount()
	}, [])

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		try {
			// Simulate API refresh
			await new Promise((resolve) => setTimeout(resolve, 1000))
			calculateStats()
		} catch (error) {
			console.error("Error refreshing data:", error)
		} finally {
			setRefreshing(false)
		}
	}, [calculateStats])

	// Navigation functions
	const handleMyCoach = () => {
		router.push({
			pathname: "/student-home/CoachesScreen",
			params: {
				viewMode: "my",
				coaches: JSON.stringify(coaches.filter((c) => c.isMyCoach)),
			},
		})
	}

	const handleTotalCoaches = () => {
		router.push({
			pathname: "/student-home/CoachesScreen",
			params: {
				viewMode: "all", // pass a flag to show all coaches
			},
		})
	}

	const handleCalendar = () => {
		router.push({
			pathname: "/coach-home/CalendarScreen",
			params: {
				events: JSON.stringify(events),
			},
		})
	}

	const handleVideos = () => {
		router.push({
			pathname: "/student-home/AllVideosScreen",
			params: {
				videos: JSON.stringify(videos),
			},
		})
	}

	const handleAcceptRequest = async (id: string) => {
		try {
			const request = coachRequests.find((r) => r.id === id)
			if (request) {
				// First, set any existing myCoach to false
				const updatedCoaches = coaches.map((c) => ({ ...c, isMyCoach: false }))

				// Then add the new coach as myCoach
				const updatedCoach = {
					...request,
					isMyCoach: true,
					joinDate: new Date().toISOString().split("T")[0],
				}
				setCoaches([...updatedCoaches, updatedCoach])
				setCoachRequests((prev) => prev.filter((r) => r.id !== id))
				setSelectedRequest(null)

				Alert.alert("Success", `You are now learning from ${request.name}!`)
			}
		} catch (error) {
			console.error("Error accepting request:", error)
			Alert.alert("Error", "Failed to accept coach request")
		}
	}

	const handleRejectRequest = async (id: string) => {
		try {
			const request = coachRequests.find((r) => r.id === id)
			if (request) {
				Alert.alert(
					"Confirm Rejection",
					`Are you sure you want to reject ${request.name}'s coaching request?`,
					[
						{ text: "Cancel", style: "cancel" },
						{
							text: "Reject",
							style: "destructive",
							onPress: () => {
								setCoachRequests((prev) => prev.filter((r) => r.id !== id))
								setSelectedRequest(null)
							},
						},
					]
				)
			}
		} catch (error) {
			console.error("Error rejecting request:", error)
			Alert.alert("Error", "Failed to reject request")
		}
	}

	if (loading) {
		return (
			<View
				style={[
					styles.container,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color="#4e73df" />
				<Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
			</View>
		)
	}

	return (
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.profile}>
					<Image
						source={
							profileUrl
								? { uri: profileUrl }
								: require("../../assets/images/boy.png")
						}
						style={styles.profileImage}
					/>
					<View style={styles.greetingContainer}>
						<Text style={styles.greetingText}>
							Hello, {studentName || "Student"}
						</Text>
						<Text style={styles.subGreeting}>
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.notificationButton}>
					<Feather name="bell" size={24} color="#4e73df" />
					{coachRequests.length > 0 && (
						<View style={styles.notificationBadge}>
							<Text style={styles.badgeText}>{coachRequests.length}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{/* Stats Grid */}
			<View style={styles.statsGrid}>
				<TouchableOpacity
					style={[styles.statBox, styles.blueBox]}
					onPress={handleMyCoach}
				>
					<Feather name="user" size={24} color="#fff" />
					<Text style={styles.statLabel}>My Coach</Text>
					<Text style={styles.statValue}>{stats.myCoach}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.statBox, styles.purpleBox]}
					onPress={handleTotalCoaches}
				>
					<Feather name="users" size={24} color="#fff" />
					<Text style={styles.statLabel}>Total Coaches</Text>
					<Text style={styles.statValue}>{coachCount}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.statBox, styles.greenBox]}
					onPress={handleCalendar}
				>
					<Feather name="calendar" size={24} color="#fff" />
					<Text style={styles.statLabel}>Events</Text>
					<Text style={styles.statValue}>{stats.events}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.statBox, styles.orangeBox]}
					onPress={handleVideos}
				>
					<Feather name="video" size={24} color="#fff" />
					<Text style={styles.statLabel}>Videos</Text>
					<Text style={styles.statValue}>{stats.videos}</Text>
				</TouchableOpacity>
			</View>

			{/* Coach Requests */}
			<View style={styles.requestsContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Coach Requests</Text>
					{coachRequests.length > 0 && (
						<View style={styles.requestsBadge}>
							<Text style={styles.requestsBadgeText}>
								{coachRequests.length}
							</Text>
						</View>
					)}
				</View>

				{coachRequests.length === 0 ? (
					<View style={styles.emptyState}>
						<Feather name="user-check" size={48} color="#ccc" />
						<Text style={styles.emptyText}>No pending coach requests</Text>
						<Text style={styles.emptySubText}>
							New requests will appear here
						</Text>
					</View>
				) : (
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{coachRequests.map((req) => (
							<TouchableOpacity
								key={req.id}
								style={styles.requestCard}
								onPress={() => setSelectedRequest(req)}
							>
								<Image
									source={{ uri: req.profileUrl }}
									style={styles.requestImage}
								/>
								<View style={styles.requestInfo}>
									<Text style={styles.requestName}>{req.name}</Text>
									<Text style={styles.requestRole}>{req.specialization}</Text>
									<View style={styles.greetingContainer}>
										<Feather name="star" size={14} color="#f6c23e" />
										<Text style={styles.greetingText}>{req.rating}</Text>
									</View>
								</View>
								<View style={styles.requestActions}>
									<TouchableOpacity
										style={styles.quickAcceptButton}
										onPress={() => handleAcceptRequest(req.id)}
									>
										<Feather name="check" size={16} color="#fff" />
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.quickRejectButton}
										onPress={() => handleRejectRequest(req.id)}
									>
										<Feather name="x" size={16} color="#fff" />
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</View>

			{/* Upcoming Events Preview */}
			<View style={styles.eventsContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Upcoming Events</Text>
					<TouchableOpacity onPress={handleCalendar}>
						<Text style={styles.viewAllText}>View All</Text>
					</TouchableOpacity>
				</View>

				{events.slice(0, 3).map((event) => (
					<TouchableOpacity
						key={event.id}
						style={styles.eventCard}
						onPress={handleCalendar}
					>
						<View
							style={[
								styles.eventTypeIndicator,
								{ backgroundColor: getEventColor(event.type) },
							]}
						/>
						<View style={styles.eventInfo}>
							<Text style={styles.eventTitle}>{event.title}</Text>
							<Text style={styles.eventDate}>
								{new Date(event.date).toLocaleDateString()} at {event.time}
							</Text>
							{event.description && (
								<Text style={styles.eventDescription}>{event.description}</Text>
							)}
						</View>
						<Feather name="chevron-right" size={20} color="#999" />
					</TouchableOpacity>
				))}
			</View>

			{/* Recent Videos Preview */}
			<View style={styles.videosContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Recent Videos</Text>
					{/* <TouchableOpacity onPress={handleVideos}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{videos.slice(0, 5).map((video) => (
						<TouchableOpacity
							key={video.id}
							style={styles.videoCard}
							onPress={handleVideos}
						>
							<Image
								source={{ uri: video.thumbnail }}
								style={styles.videoThumbnail}
							/>
							<View style={styles.videoDuration}>
								<Text style={styles.videoDurationText}>{video.duration}</Text>
							</View>
							<Text style={styles.videoTitle} numberOfLines={2}>
								{video.title}
							</Text>
							<Text style={styles.videoCategory}>
								{video.category.toUpperCase()}
							</Text>
							{video.coachId && (
								<Text style={styles.videoCoach}>
									By{" "}
									{coaches.find((c) => c.id === video.coachId)?.name || "Coach"}
								</Text>
							)}
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Modal for Coach Request Details */}
			<Modal visible={!!selectedRequest} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>{selectedRequest?.name}</Text>
							<TouchableOpacity onPress={() => setSelectedRequest(null)}>
								<Feather name="x" size={24} color="#666" />
							</TouchableOpacity>
						</View>

						{selectedRequest && (
							<>
								<Image
									source={{ uri: selectedRequest.profileUrl }}
									style={styles.modalImage}
								/>
								<Text style={styles.modalRole}>
									{selectedRequest.specialization}
								</Text>
								<Text style={styles.modalCareer}>{selectedRequest.bio}</Text>

								<View style={styles.performanceContainer}>
									<Text style={styles.performanceTitle}>Coach Details</Text>
									<View style={styles.performanceMetrics}>
										<View style={styles.metricItem}>
											<Text style={styles.metricLabel}>Rating</Text>
											<Text style={styles.metricValue}>
												{selectedRequest.rating}/5
											</Text>
										</View>
										<View style={styles.metricItem}>
											<Text style={styles.metricLabel}>Experience</Text>
											<Text style={styles.metricValue}>
												{selectedRequest.experience}
											</Text>
										</View>
									</View>
								</View>

								<View style={styles.modalActions}>
									<TouchableOpacity
										style={[styles.actionButton, styles.acceptButton]}
										onPress={() => handleAcceptRequest(selectedRequest.id)}
									>
										<Feather name="check" size={20} color="#fff" />
										<Text style={styles.actionButtonText}>Accept</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.actionButton, styles.rejectButton]}
										onPress={() => handleRejectRequest(selectedRequest.id)}
									>
										<Feather name="x" size={20} color="#fff" />
										<Text style={styles.actionButtonText}>Reject</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</View>
				</View>
			</Modal>
		</ScrollView>
	)
}

export default StudentHomeContent
