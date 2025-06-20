import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./Header_1";
import { styles } from "../../styles/StudentsStyles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Student = {
	username: string;
	id: string;
	name: string;
	photoUrl: string;
	email?: string;
	phoneNumber?: string;
	address?: string;
	role?: string;
	experience?: string;
	birthDate?: Date;
	gender?: string;
	coaches: string[];
};

export default function StudentsScreen() {
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState<Student[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [assigningId, setAssigningId] = useState<string | null>(null);
	const router = useRouter();
	const params = useLocalSearchParams();
	const viewMode = params.viewMode || "my";
	const DEFAULT_PROFILE_PIC = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
	const coachId = useSelector((state: RootState) => state.user.id);

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Player"
			);
			const data = await response.json();

			const formatted: Student[] = data.map((user: any) => {
				const name = user.name?.trim();
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
					photoUrl: user.profilePictureUrl || DEFAULT_PROFILE_PIC,
					coaches: user.coaches || [],
				};
			});

			const filtered =
				viewMode === "my"
					? formatted.filter((s) => s.coaches?.includes(coachId))
					: formatted;

			setStudents(filtered);
			router.setParams({ studentCount: filtered.length.toString() });
		} catch (err) {
			console.error("❌ Failed to load students", err);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchStudents(); // Refresh when screen is focused
		}, [])
	);

	const handleAssignStudent = async (student: Student) => {
		setAssigningId(student.id);
		try {
			const updatedCoaches = Array.from(new Set([...(student.coaches || []), coachId]));

			await fetch(`https://becomebetter-api.azurewebsites.net/api/UpdateUser`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: student.id, coaches: updatedCoaches }),
			});

			await fetch(
				`https://becomebetter-api.azurewebsites.net/api/AddStudentToCoach?code=${process.env.EXPO_PUBLIC_ADD_STUDENT_KEY}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ coachId, studentId: student.id }),
				}
			);

			Alert.alert("Success", `${student.name} has been added to your students.`);
			await fetchStudents(); // Refresh list
		} catch (error) {
			console.error("Failed to assign student:", error);
			Alert.alert("Error", "Something went wrong while assigning student.");
		} finally {
			setAssigningId(null);
		}
	};

	const removeStudent = (student: Student) => {
		Alert.alert(
			"Remove Student",
			`Are you sure you want to remove ${student.name}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						try {
							const updatedCoaches = student.coaches.filter((id) => id !== coachId);

							await fetch(`https://becomebetter-api.azurewebsites.net/api/UpdateUser`, {
								method: "PUT",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ id: student.id, coaches: updatedCoaches }),
							});

							await fetch(
								`https://becomebetter-api.azurewebsites.net/api/RemoveStudentFromCoach?code=${process.env.EXPO_PUBLIC_REMOVE_STUDENT_KEY}`,
								{
									method: "PUT",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ coachId, studentId: student.id }),
								}
							);

							setStudents((curr) => curr.filter((s) => s.id !== student.id));
							Alert.alert("Removed", `${student.name} has been removed.`);
						} catch (err) {
							console.error("❌ Failed to remove student:", err);
							Alert.alert("Error", "Failed to remove student from backend.");
						}
					},
				},
			]
		);
	};

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
				viewMode,
			},
		});
	};

	const filteredStudents = students.filter((student) =>
		student.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const addStudent = () => router.push("/coach-home/add_student");

	return (
		<View style={styles.container}>
			<Header title="Students" />

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

			{loading ? (
				<Text style={{ textAlign: "center", marginTop: 20 }}>Loading students...</Text>
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
							<Text style={[styles.buttonText, styles.addButtonText]}>Add New Student</Text>
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
								<Image source={{ uri: student.photoUrl }} style={styles.image} />
								<View style={{ marginLeft: 12 }}>
									<Text style={{ fontWeight: "bold", fontSize: 16 }}>
										{student.name || "Unnamed Player"}
									</Text>
									<Text style={{ color: "#666", fontSize: 13 }}>
										@{student.username || "unknown"}
									</Text>
								</View>
							</TouchableOpacity>

							{viewMode === "all" ? (
								student.coaches.includes(coachId) ? (
									<Text style={{ color: "#28a745", fontWeight: "600" }}>
										✓ Already Added
									</Text>
								) : (
									<TouchableOpacity
										style={[styles.button, styles.addButton]}
										onPress={() => handleAssignStudent(student)}
										disabled={assigningId === student.id}
									>
										{assigningId === student.id ? (
											<ActivityIndicator color="#fff" size="small" />
										) : (
											<Feather name="user-plus" size={16} color="#fff" />
										)}
									</TouchableOpacity>
								)
							) : (
								<TouchableOpacity
									style={[styles.button, styles.removeButton]}
									onPress={() => removeStudent(student)}
								>
									<Feather name="user-minus" size={16} color="#dc3545" />
								</TouchableOpacity>
							)}
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
}
