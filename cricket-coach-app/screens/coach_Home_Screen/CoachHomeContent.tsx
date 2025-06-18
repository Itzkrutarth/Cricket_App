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
	TextInput,
	Platform,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { styles } from "../../styles/CoachHomeStyles"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

// --------- Types
export interface Student {
	id: string
	name: string
	profileUrl: string
	role: string
	careerInfo: string
	isMyStudent: boolean
	joinDate?: string
	performance?: {
		batting: number
		bowling: number
		fielding: number
	}
}
export interface Event {
	id: string
	title: string
	date: string
	time: string
	description?: string
	type: "session" | "match" | "workshop" | "meeting"
}
export interface Video {
	id: string
	title: string
	thumbnail: string
	duration: string
	uploadDate: string
	category: "batting" | "bowling" | "fielding" | "fitness"
	studentId?: string
}
export interface CoachStats {
	myStudents: number
	totalStudents: number
	sessions: number
	videos: number
	events: number
}

// --------- Dummy Data
const dummyStudents: Student[] = [
	{
		id: "1",
		name: "Virat Kohli",
		profileUrl: "https://picsum.photos/300/300?1",
		role: "Batsman",
		careerInfo:
			"Aggressive right-handed batsman with excellent technique and leadership qualities.",
		isMyStudent: true,
		joinDate: "2024-01-15",
		performance: { batting: 92, bowling: 45, fielding: 88 },
	},
	{
		id: "2",
		name: "Rohit Sharma",
		profileUrl: "https://picsum.photos/300/300?2",
		role: "Opener",
		careerInfo:
			"Elegant opener known for his timing and ability to score big centuries.",
		isMyStudent: true,
		joinDate: "2024-02-01",
		performance: { batting: 89, bowling: 30, fielding: 82 },
	},
	{
		id: "3",
		name: "Jasprit Bumrah",
		profileUrl: "https://picsum.photos/300/300?3",
		role: "Fast Bowler",
		careerInfo:
			"Right-arm fast bowler with unique action and excellent death bowling skills.",
		isMyStudent: false,
		joinDate: "2024-03-10",
		performance: { batting: 25, bowling: 95, fielding: 75 },
	},
	{
		id: "4",
		name: "Hardik Pandya",
		profileUrl: "https://picsum.photos/300/300?4",
		role: "All-rounder",
		careerInfo:
			"Dynamic all-rounder who can change the game with both bat and ball.",
		isMyStudent: false,
		joinDate: "2024-01-20",
		performance: { batting: 78, bowling: 82, fielding: 85 },
	},
	{
		id: "5",
		name: "KL Rahul",
		profileUrl: "https://picsum.photos/300/300?5",
		role: "Wicket-keeper Batsman",
		careerInfo:
			"Versatile wicket-keeper batsman who can adapt to any batting position.",
		isMyStudent: true,
		joinDate: "2024-02-15",
		performance: { batting: 85, bowling: 20, fielding: 90 },
	},
]

const dummyJoinRequests: Student[] = [
	{
		id: "pending_1",
		name: "Shubman Gill",
		profileUrl: "https://picsum.photos/300/300?6",
		role: "Top Order Batsman",
		careerInfo: "Young promising batsman with solid technique and temperament.",
		isMyStudent: false,
		performance: { batting: 82, bowling: 15, fielding: 78 },
	},
	{
		id: "pending_2",
		name: "Prithvi Shaw",
		profileUrl: "https://picsum.photos/300/300?7",
		role: "Opener",
		careerInfo: "Aggressive opener with natural stroke-making ability.",
		isMyStudent: false,
		performance: { batting: 79, bowling: 10, fielding: 70 },
	},
]

const dummyEvents: Event[] = [
	{
		id: "1",
		title: "Academy League Finals",
		date: "2025-06-15",
		time: "16:00",
		description: "Final match of the academy league",
		type: "match",
	},
	{
		id: "2",
		title: "Spin Bowling Workshop",
		date: "2025-06-20",
		time: "10:00",
		description: "Advanced spin bowling techniques workshop",
		type: "workshop",
	},
	{
		id: "3",
		title: "Team Meeting",
		date: "2025-06-12",
		time: "14:00",
		description: "Monthly team performance review",
		type: "meeting",
	},
]

const dummyVideos: Video[] = [
	{
		id: "1",
		title: "Cover Drive Technique",
		thumbnail: "https://picsum.photos/400/225?8",
		duration: "5:32",
		uploadDate: "2025-06-10",
		category: "batting",
	},
	{
		id: "2",
		title: "Yorker Bowling Masterclass",
		thumbnail: "https://picsum.photos/400/225?9",
		duration: "8:15",
		uploadDate: "2025-06-09",
		category: "bowling",
	},
	{
		id: "3",
		title: "Catching Drills",
		thumbnail: "https://picsum.photos/400/225?10",
		duration: "6:42",
		uploadDate: "2025-06-08",
		category: "fielding",
	},
	{
		id: "4",
		title: "Fitness Training Routine",
		thumbnail: "https://picsum.photos/400/225?11",
		duration: "12:30",
		uploadDate: "2025-06-07",
		category: "fitness",
	},
]

// --------- Helper
const getEventColor = (type: Event["type"]) => {
	switch (type) {
		case "session":
			return "#4e73df"
		case "match":
			return "#e74a3b"
		case "workshop":
			return "#f6c23e"
		case "meeting":
			return "#36b9cc"
		default:
			return "#858796"
	}
}

// --------- Main Component
const HomeContent = () => {
	const params = useLocalSearchParams()
	const coachName = useSelector((state: RootState) => state.user.name)
	const profileUrl = useSelector(
		(state: RootState) => state.user.profilePicture
	)
	const [selectedRequest, setSelectedRequest] = useState<Student | null>(null)
	const [students, setStudents] = useState<Student[]>(dummyStudents)
	const [joinRequests, setJoinRequests] = useState<Student[]>(dummyJoinRequests)
	const [events, setEvents] = useState<Event[]>(dummyEvents)
	const [videos, setVideos] = useState<Video[]>(dummyVideos)
	const [refreshing, setRefreshing] = useState(false)
	const [loading, setLoading] = useState(true)

	// Event editing states
	const [isEventModalVisible, setIsEventModalVisible] = useState(false)
	const [editingEvent, setEditingEvent] = useState<Event | null>(null)
	const [newEvent, setNewEvent] = useState<Event>({
		id: "",
		title: "",
		date: new Date().toISOString().split("T")[0],
		time: "10:00",
		type: "session",
		description: "",
	})
	const [showDatePicker, setShowDatePicker] = useState(false)
	const user = useSelector((state: RootState) => state.user)
	const [showTimePicker, setShowTimePicker] = useState(false)

	const [stats, setStats] = useState<CoachStats>({
		myStudents: 0,
		totalStudents: 0,
		sessions: 0,
		videos: 0,
		events: 0,
	})

	const fetchRealStudentCount = async () => {
		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Player",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				}
			)

			if (!response.ok) throw new Error("Failed to fetch student list")

			const data = await response.json()
			const totalCount = data.length || 0

			setStats((prev) => ({
				...prev,
				totalStudents: totalCount,
			}))
		} catch (error) {
			console.error("❌ Failed to fetch total student count", error)
		}
	}

	const calculateStats = useCallback(() => {
		const myStudents = students.filter((s) => s.isMyStudent).length
		const upcomingEvents = events.filter(
			(e) => new Date(e.date) >= new Date()
		).length

		setStats((prev) => ({
			...prev, // keep totalStudents from API
			myStudents,
			sessions: upcomingEvents,
			videos: videos.length,
			events: events.length,
		}))
	}, [students, events, videos])

	useEffect(() => {
		const loadInitialStats = async () => {
			await fetchRealStudentCount() // total from API
			calculateStats() // rest from dummy/local data
			setLoading(false)
		}
		loadInitialStats()
	}, [calculateStats])

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		try {
			await Promise.all([
				new Promise((resolve) => setTimeout(resolve, 1000)), // simulate API
				fetchRealStudentCount(),
			])
			calculateStats() // will not overwrite totalStudents now
		} catch (error) {
			console.error("Error refreshing data:", error)
		} finally {
			setRefreshing(false)
		}
	}, [calculateStats])

	// Students/Requests Handlers
	const handleMyStudents = () => {
		router.push({
			pathname: "/coach-home/StudentScreen",
			params: {
				viewMode: "my",
				students: JSON.stringify(students.filter((s) => s.isMyStudent)),
			},
		})
	}
	const handleTotalStudents = () => {
		router.push({
			pathname: "/coach-home/StudentScreen",
			params: {
				viewMode: "all",
				students: JSON.stringify(students),
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
			pathname: "/coach-home/AllVideoScreen",
			params: {
				videos: JSON.stringify(videos),
			},
		})
	}
	const handleAcceptRequest = async (id: string) => {
		try {
			const request = joinRequests.find((r) => r.id === id)
			if (request) {
				const updatedStudent: Student = {
					...request,
					isMyStudent: true,
					joinDate: new Date().toISOString().split("T")[0],
				}
				setStudents((prev) => [...prev, updatedStudent])
				setJoinRequests((prev) => prev.filter((r) => r.id !== id))
				setSelectedRequest(null)
				Alert.alert(
					"Success",
					`${request.name} has been accepted as your student!`
				)
			}
		} catch (error) {
			Alert.alert("Error", "Failed to accept request")
		}
	}
	const handleRejectRequest = async (id: string) => {
		try {
			const request = joinRequests.find((r) => r.id === id)
			if (request) {
				Alert.alert(
					"Confirm Rejection",
					`Are you sure you want to reject ${request.name}'s request?`,
					[
						{ text: "Cancel", style: "cancel" },
						{
							text: "Reject",
							style: "destructive",
							onPress: () => {
								setJoinRequests((prev) => prev.filter((r) => r.id !== id))
								setSelectedRequest(null)
							},
						},
					]
				)
			}
		} catch (error) {
			Alert.alert("Error", "Failed to reject request")
		}
	}

	// --------- Event management
	const handleAddEvent = () => {
		setEditingEvent(null)
		setNewEvent({
			id: "",
			title: "",
			date: new Date().toISOString().split("T")[0],
			time: "10:00",
			type: "session",
			description: "",
		})
		setIsEventModalVisible(true)
	}
	const handleEditEvent = (event: Event) => {
		setEditingEvent(event)
		setNewEvent({ ...event })
		setIsEventModalVisible(true)
	}
	const handleSaveEvent = () => {
		if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type) {
			Alert.alert("Error", "Please fill all required fields")
			return
		}
		if (editingEvent) {
			// Update existing event
			const updatedEvents = events.map((e) =>
				e.id === editingEvent.id ? { ...e, ...newEvent } : e
			)
			setEvents(updatedEvents)
			Alert.alert("Success", "Event updated successfully")
		} else {
			// Add new event
			const event: Event = {
				...newEvent,
				id: `event_${Date.now()}`,
			}
			setEvents([...events, event])
			Alert.alert("Success", "Event added successfully")
		}
		setIsEventModalVisible(false)
		calculateStats()
	}
	const handleDeleteEvent = (id: string) => {
		Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					setEvents(events.filter((e) => e.id !== id))
					setIsEventModalVisible(false)
					calculateStats()
				},
			},
		])
	}
	const handleDateChange = (_event: any, selectedDate?: Date) => {
		setShowDatePicker(false)
		if (selectedDate) {
			setNewEvent({
				...newEvent,
				date: selectedDate.toISOString().split("T")[0],
			})
		}
	}
	const handleTimeChange = (_event: any, selectedTime?: Date) => {
		setShowTimePicker(false)
		if (selectedTime) {
			const hours = selectedTime.getHours().toString().padStart(2, "0")
			const minutes = selectedTime.getMinutes().toString().padStart(2, "0")
			setNewEvent({
				...newEvent,
				time: `${hours}:${minutes}`,
			})
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
							Hello, {coachName || "Coach"}
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
					{joinRequests.length > 0 && (
						<View style={styles.notificationBadge}>
							<Text style={styles.badgeText}>{joinRequests.length}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{/* Stats Grid */}
			<View style={styles.statsGrid}>
				<TouchableOpacity
					style={[styles.statBox, styles.blueBox]}
					onPress={handleMyStudents}
				>
					<Feather name="users" size={24} color="#fff" />
					<Text style={styles.statLabel}>My Students</Text>
					<Text style={styles.statValue}>{stats.myStudents}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.statBox, styles.purpleBox]}
					onPress={handleTotalStudents}
				>
					<Feather name="globe" size={24} color="#fff" />
					<Text style={styles.statLabel}>Total Students</Text>
					<Text style={styles.statValue}>{stats.totalStudents}</Text>
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

			{/* Student Join Requests */}
			<View style={styles.requestsContainer}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Student Join Requests</Text>
					{joinRequests.length > 0 && (
						<View style={styles.requestsBadge}>
							<Text style={styles.requestsBadgeText}>
								{joinRequests.length}
							</Text>
						</View>
					)}
				</View>
				{joinRequests.length === 0 ? (
					<View style={styles.emptyState}>
						<Feather name="user-check" size={48} color="#ccc" />
						<Text style={styles.emptyText}>No pending join requests</Text>
						<Text style={styles.emptySubText}>
							New requests will appear here
						</Text>
					</View>
				) : (
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{joinRequests.map((req) => (
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
									<Text style={styles.requestRole}>{req.role}</Text>
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
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity
							onPress={handleCalendar}
							style={{ marginRight: 15 }}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleAddEvent}>
							<Feather name="plus" size={20} color="#4e73df" />
						</TouchableOpacity>
					</View>
				</View>
				{events.slice(0, 3).map((event) => (
					<TouchableOpacity
						key={event.id}
						style={styles.eventCard}
						onPress={() => handleEditEvent(event)}
						onLongPress={() => handleDeleteEvent(event.id)}
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
					<TouchableOpacity onPress={handleVideos}>
						<Text style={styles.viewAllText}>View All</Text>
					</TouchableOpacity>
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
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Modal for Join Request Details */}
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
								<Text style={styles.modalRole}>{selectedRequest.role}</Text>
								<Text style={styles.modalCareer}>
									{selectedRequest.careerInfo}
								</Text>
								{selectedRequest.performance && (
									<View style={styles.performanceContainer}>
										<Text style={styles.performanceTitle}>
											Performance Metrics
										</Text>
										<View style={styles.performanceMetrics}>
											<View style={styles.metricItem}>
												<Text style={styles.metricLabel}>Batting</Text>
												<Text style={styles.metricValue}>
													{selectedRequest.performance.batting}%
												</Text>
											</View>
											<View style={styles.metricItem}>
												<Text style={styles.metricLabel}>Bowling</Text>
												<Text style={styles.metricValue}>
													{selectedRequest.performance.bowling}%
												</Text>
											</View>
											<View style={styles.metricItem}>
												<Text style={styles.metricLabel}>Fielding</Text>
												<Text style={styles.metricValue}>
													{selectedRequest.performance.fielding}%
												</Text>
											</View>
										</View>
									</View>
								)}
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

			{/* Modal for Add/Edit Event */}
			<Modal visible={isEventModalVisible} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{editingEvent ? "Edit Event" : "Add New Event"}
							</Text>
							<TouchableOpacity onPress={() => setIsEventModalVisible(false)}>
								<Feather name="x" size={24} color="#666" />
							</TouchableOpacity>
						</View>
						<ScrollView
							style={{ maxHeight: 400 }} // limit to avoid overflow, allow scrolling
							contentContainerStyle={{ paddingBottom: 30 }}
							showsVerticalScrollIndicator={false}
							keyboardShouldPersistTaps="handled"
						>
							<View style={styles.formGroup}>
								<Text style={styles.formLabel}>Event Title*</Text>
								<TextInput
									style={styles.formInput}
									placeholder="Enter event title"
									value={newEvent.title}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, title: text })
									}
								/>
							</View>
							{/* ... Event Type, Date, Time, Description fields ... */}
							<View style={styles.formGroup}>
								<Text style={styles.formLabel}>Event Type*</Text>
								<View style={styles.typeSelector}>
									{(["session", "match", "workshop", "meeting"] as const).map(
										(type) => (
											<TouchableOpacity
												key={type}
												style={[
													styles.typeButton,
													newEvent.type === type && styles.selectedTypeButton,
													{ backgroundColor: getEventColor(type) },
												]}
												onPress={() => setNewEvent({ ...newEvent, type })}
											>
												<Text style={styles.typeButtonText}>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</Text>
											</TouchableOpacity>
										)
									)}
								</View>
							</View>
							<View style={styles.formGroup}>
								<Text style={styles.formLabel}>Date*</Text>
								<TouchableOpacity
									style={styles.formInput}
									onPress={() => setShowDatePicker(true)}
								>
									<Text>{newEvent.date}</Text>
								</TouchableOpacity>
								{showDatePicker && (
									<DateTimePicker
										value={newEvent.date ? new Date(newEvent.date) : new Date()}
										mode="date"
										display="default"
										onChange={handleDateChange}
									/>
								)}
							</View>
							<View style={styles.formGroup}>
								<Text style={styles.formLabel}>Time*</Text>
								<TouchableOpacity
									style={styles.formInput}
									onPress={() => setShowTimePicker(true)}
								>
									<Text>{newEvent.time}</Text>
								</TouchableOpacity>
								{showTimePicker && (
									<DateTimePicker
										value={
											newEvent.time
												? new Date(`1970-01-01T${newEvent.time}:00`)
												: new Date("1970-01-01T10:00:00")
										}
										mode="time"
										display="default"
										onChange={handleTimeChange}
									/>
								)}
							</View>
							<View style={styles.formGroup}>
								<Text style={styles.formLabel}>Description</Text>
								<TextInput
									style={[
										styles.formInput,
										{ height: 80, textAlignVertical: "top" },
									]}
									placeholder="Enter event description"
									multiline
									value={newEvent.description}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, description: text })
									}
								/>
							</View>
						</ScrollView>
						<View style={styles.modalActions}>
							{editingEvent && (
								<TouchableOpacity
									style={[styles.actionButton, styles.deleteButton]}
									onPress={() => handleDeleteEvent(editingEvent.id)}
								>
									<Feather name="trash-2" size={20} color="#fff" />
									<Text style={styles.actionButtonText}>Delete</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[styles.actionButton, styles.saveButton]}
								onPress={handleSaveEvent}
							>
								<Feather name="save" size={20} color="#fff" />
								<Text style={styles.actionButtonText}>
									{editingEvent ? "Update" : "Save"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</ScrollView>
	)
}

export default HomeContent
