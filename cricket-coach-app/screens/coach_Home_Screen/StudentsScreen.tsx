import React, { useState, useEffect, useCallback } from "react"
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useFocusEffect } from "@react-navigation/native"
import Header from "./Header_1"
import { styles } from "../../styles/StudentsStyles"

type Student = {
	username: string
	id: string
	name: string
	photoUrl: string
	email?: string
	phoneNumber?: string
	address?: string
	role?: string
	experience?: string
	birthDate?: Date
	gender?: string
}
export default function StudentsScreen() {
	const [loading, setLoading] = useState(true)
	const [students, setStudents] = useState<Student[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const router = useRouter()
	const params = useLocalSearchParams()
	const viewMode = params.viewMode || "my"
	const DEFAULT_PROFILE_PIC =
		"https://cdn-icons-png.flaticon.com/512/149/149071.png"

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await fetch(
					"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Player"
				)
				const data = await response.json()

				const formatted: Student[] = data.map((user: any) => {
					const name = user.name.trim()

					return {
						id: user.id,
						name: name || "Unnamed Player",
						username: user.username,
						email: user.email || "",
						phoneNumber: user.phoneNumber || "",
						address: user.address || "",
						role: user.role || "",
						experience: user.experience || "",
						birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
						gender: user.gender || "",
						photoUrl:
							user.profilePictureUrl || user.photoUrl || DEFAULT_PROFILE_PIC,
					}
				})

				setStudents(formatted)
				router.setParams({ studentCount: formatted.length.toString() })
				setLoading(false)
			} catch (err) {
				console.error("❌ Failed to load students", err)
				setLoading(false)
			}
		}

		fetchStudents()
	}, [])

	useFocusEffect(
		useCallback(() => {
			// Refresh logic if needed
		}, [])
	)

	const addStudent = () => {
		router.push("/coach-home/add_student")
	}

	const removeStudent = (student: Student) => {
		Alert.alert(
			"Remove Student",
			`Are you sure you want to remove ${student.name}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						setStudents((curr) => curr.filter((s) => s.id !== student.id))
					},
				},
			]
		)
	}

	const openDetails = (student: Student) => {
		router.push({
			pathname: "/coach-home/student_details",
			params: {
				id: student.id,
				name: student.name,
				photoUrl: student.photoUrl,
				email: student.email || "",
				phoneNumber: student.phoneNumber || "",
				address: student.address || "",
				role: student.role || "",
				experience: student.experience || "",
				birthDate: student.birthDate?.toISOString() || "",
				gender: student.gender || "",
				viewMode, // Pass the viewMode parameter
			},
		})
	}

	const filteredStudents = students.filter((student) =>
		student.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<View style={styles.container}>
			<Header title="Students" />

			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<Feather name="search" size={18} color="#666" />
				<TextInput
					style={styles.searchInput}
					placeholder="Search students..."
					placeholderTextColor="#999"
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			{/* If no matches */}
			{loading ? (
				<Text style={{ textAlign: "center", marginTop: 20 }}>
					Loading students...
				</Text>
			) : filteredStudents.length === 0 ? (
				<View style={styles.emptyState}>
					<Feather name="users" size={64} color="#ccc" />
					<Text style={styles.emptyStateTitle}>No Matches</Text>
					<Text style={styles.emptyStateText}>No students found.</Text>
					{viewMode === "all" && (
						<TouchableOpacity
							style={[styles.button, styles.addButton, { marginTop: 16 }]}
							onPress={addStudent}
						>
							<Feather name="user-plus" size={20} color="#fff" />
							<Text style={[styles.buttonText, styles.addButtonText]}>
								Add New Student
							</Text>
						</TouchableOpacity>
					)}
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.scrollContent}>
					{filteredStudents.map((student) => (
						<View key={student.id} style={styles.card}>
							<TouchableOpacity
								style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
								onPress={() => openDetails(student)}
							>
								<Image
									source={{ uri: student.photoUrl }}
									style={styles.image}
								/>
								<View style={{ marginLeft: 12 }}>
									<Text style={{ fontWeight: "bold", fontSize: 16 }}>
										{student.name || "Unnamed Player"}
									</Text>
									<Text style={{ color: "#666", fontSize: 13 }}>
										@{student.username || "unknown"}
									</Text>
								</View>
							</TouchableOpacity>

							{viewMode === "all" && (
								<TouchableOpacity
									style={[styles.button, styles.addButton]}
									onPress={addStudent}
								>
									<Feather name="user-plus" size={16} color="#fff" />
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[styles.button, styles.removeButton]}
								onPress={() => removeStudent(student)}
							>
								<Feather name="user-minus" size={16} color="#dc3545" />
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	)
}
