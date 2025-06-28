import React, { useState, useEffect, useCallback } from "react"
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useFocusEffect } from "@react-navigation/native"
import Header from "./Header_1"
import { styles } from "@/styles/StudentsStyles" // reusing same layout style
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

type Coach = {
	id: string
	username: string
	name: string
	photoUrl: string
	email?: string
	role?: string
	students: string[]
}

export default function CoachesScreen() {
	const [loading, setLoading] = useState(true)
	const [coaches, setCoaches] = useState<Coach[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [assigningId, setAssigningId] = useState<string | null>(null)
	const params = useLocalSearchParams()
	const viewMode = params.viewMode || "my"
	const router = useRouter()
	const studentId = useSelector((state: RootState) => state.user.id)
	const DEFAULT_PROFILE_PIC =
		"https://cdn-icons-png.flaticon.com/512/149/149071.png"

	const fetchCoaches = async () => {
		setLoading(true)
		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Coach"
			)
			const data = await response.json()

			const formatted: Coach[] = data.map((user: any) => ({
				id: user.id,
				username: user.username,
				name: user.name || "Unnamed Coach",
				email: user.email || "",
				role: user.role || "",
				photoUrl: user.profilePictureUrl || DEFAULT_PROFILE_PIC,
				students: user.students || [],
			}))

			// ✅ Filter only coaches assigned to this student
			const filtered =
				viewMode === "my"
					? formatted.filter((c) => c.students.includes(studentId))
					: formatted

			setCoaches(filtered)
		} catch (err) {
			console.error("❌ Failed to load coaches", err)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchCoaches()
	}, [])

	useFocusEffect(
		useCallback(() => {
			fetchCoaches() // refresh on screen focus
		}, [])
	)

	const handleAssignCoach = async (coach: Coach) => {
		setAssigningId(coach.id)
		try {
			const updatedStudents = Array.from(
				new Set([...(coach.students || []), studentId])
			)

			await fetch("https://becomebetter-api.azurewebsites.net/api/UpdateUser", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: coach.id, students: updatedStudents }),
			})

			await fetch(
				`https://becomebetter-api.azurewebsites.net/api/AddCoachToStudent?code=${process.env.EXPO_PUBLIC_ADD_COACH_KEY}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ studentId, coachId: coach.id }),
				}
			)

			Alert.alert("Success", `${coach.name} has been added to your coaches.`)
			await fetchCoaches() // Refresh list
		} catch (error) {
			console.error("❌ Failed to assign coach:", error)
			Alert.alert("Error", "Something went wrong while assigning coach.")
		} finally {
			setAssigningId(null)
		}
	}

	const removeCoach = (coach: Coach) => {
		Alert.alert(
			"Remove Coach",
			`Are you sure you want to remove ${coach.name}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						try {
							// Step 1: Remove coach from student's list
							await fetch(
								`https://becomebetter-api.azurewebsites.net/api/RemoveCoachFromStudent?code=${process.env.EXPO_PUBLIC_REMOVE_COACH_KEY}`,
								{
									method: "PUT",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ coachId: coach.id, studentId }),
								}
							)

							// Step 2: Remove student from coach's list
							await fetch(
								`https://becomebetter-api.azurewebsites.net/api/RemoveStudentFromCoach?code=${process.env.EXPO_PUBLIC_REMOVE_STUDENT_KEY}`,
								{
									method: "PUT",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ coachId: coach.id, studentId }),
								}
							)

							// Update UI (filter out removed coach)
							setCoaches((curr) => curr.filter((c) => c.id !== coach.id))

							Alert.alert("Removed", `${coach.name} has been removed.`)
						} catch (err) {
							console.error("❌ Failed to remove coach:", err)
							Alert.alert("Error", "Failed to remove coach from backend.")
						}
					},
				},
			]
		)
	}

	const openDetails = (coach: Coach) => {
		router.push({
			pathname: "/student-home/coach-detail",
			params: {
				id: coach.id,
				name: coach.name,
				username: coach.username,
				photoUrl: coach.photoUrl,
			},
		})
	}

	const filteredCoaches = coaches.filter((coach) =>
		coach.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<View style={styles.container}>
			<Header title="Coaches" />

			<View style={styles.searchContainer}>
				<Feather name="search" size={18} color="#666" />
				<TextInput
					style={styles.searchInput}
					placeholder="Search coaches..."
					placeholderTextColor="#999"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			{loading ? (
				<Text style={{ textAlign: "center", marginTop: 20 }}>
					Loading coaches...
				</Text>
			) : filteredCoaches.length === 0 ? (
				<View style={styles.emptyState}>
					<Feather name="users" size={64} color="#ccc" />
					<Text style={styles.emptyStateTitle}>No Matches</Text>
					<Text style={styles.emptyStateText}>No coaches found.</Text>
					{/* {viewMode === "all" && (
						<TouchableOpacity
							style={[styles.button, styles.addButton, { marginTop: 16 }]}
							onPress={addCoach}
						>
							<Feather name="user-plus" size={20} color="#fff" />
							<Text style={[styles.buttonText, styles.addButtonText]}>
								Add New Coach
							</Text>
						</TouchableOpacity>
					)} */}
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{filteredCoaches.map((coach) => (
						<View key={coach.id} style={styles.card}>
							<TouchableOpacity
								style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
								onPress={() => openDetails(coach)}
							>
								<Image source={{ uri: coach.photoUrl }} style={styles.image} />
								<View style={{ marginLeft: 12 }}>
									<Text style={{ fontWeight: "bold", fontSize: 16 }}>
										{coach.name || "Unnamed Coach"}
									</Text>
									<Text style={{ color: "#666", fontSize: 13 }}>
										@{coach.username || "unknown"}
									</Text>
								</View>
							</TouchableOpacity>

							{viewMode === "all" ? (
								coach.students.includes(studentId) ? (
									<Text style={{ color: "#28a745", fontWeight: "600" }}>
										✓ Already Added
									</Text>
								) : (
									<TouchableOpacity
										style={[styles.button, styles.addButton]}
										onPress={() => handleAssignCoach(coach)}
										disabled={assigningId === coach.id}
									>
										{assigningId === coach.id ? (
											<ActivityIndicator color="#fff" size="small" />
										) : (
											<Feather name="user-plus" size={16} color="#fff" />
										)}
									</TouchableOpacity>
								)
							) : (
								<TouchableOpacity
									style={[styles.button, styles.removeButton]}
									onPress={() => removeCoach(coach)}
								>
									<Feather name="user-minus" size={16} color="#dc3545" />
								</TouchableOpacity>
							)}
						</View>
					))}
				</ScrollView>
			)}
		</View>
	)
}
