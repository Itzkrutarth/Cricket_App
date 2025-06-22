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
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./Header_1";
import { styles } from "@/styles/StudentsStyles"; // reusing same layout style
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Coach = {
	id: string;
	username: string;
	name: string;
	photoUrl: string;
	email?: string;
	role?: string;
	students: string[];
};

export default function CoachesScreen() {
	const [loading, setLoading] = useState(true);
	const [coaches, setCoaches] = useState<Coach[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [assigningId, setAssigningId] = useState<string | null>(null);
	const router = useRouter();
	const studentId = useSelector((state: RootState) => state.user.id);
	const DEFAULT_PROFILE_PIC = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

	const fetchCoaches = async () => {
		setLoading(true);
		try {
			const response = await fetch("https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Coach");
			const data = await response.json();

			const formatted: Coach[] = data.map((user: any) => ({
				id: user.id,
				username: user.username,
				name: user.name || "Unnamed Coach",
				email: user.email || "",
				role: user.role || "",
				photoUrl: user.profilePictureUrl || DEFAULT_PROFILE_PIC,
				students: user.students || [],
			}));

			setCoaches(formatted);
		} catch (err) {
			console.error("❌ Failed to load coaches", err);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchCoaches();
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchCoaches(); // refresh on screen focus
		}, [])
	);

	const handleAssignCoach = async (coach: Coach) => {
		setAssigningId(coach.id);
		try {
			const updatedStudents = Array.from(new Set([...(coach.students || []), studentId]));

			await fetch("https://becomebetter-api.azurewebsites.net/api/UpdateUser", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: coach.id, students: updatedStudents }),
			});

			await fetch(
				`https://becomebetter-api.azurewebsites.net/api/AddCoachToStudent?code=${process.env.EXPO_PUBLIC_ADD_COACH_KEY}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ studentId, coachId: coach.id }),
				}
			);

			Alert.alert("Success", `${coach.name} has been added to your coaches.`);
			await fetchCoaches(); // Refresh list
		} catch (error) {
			console.error("❌ Failed to assign coach:", error);
			Alert.alert("Error", "Something went wrong while assigning coach.");
		} finally {
			setAssigningId(null);
		}
	};

	const openDetails = (coach: Coach) => {
		router.push({
			pathname: "/student-home/coach-detail",
			params: {
				id: coach.id,
				name: coach.name,
				username: coach.username,
				photoUrl: coach.photoUrl,
			},
		});
	};

	const filteredCoaches = coaches.filter((coach) =>
		coach.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<View style={styles.container}>
			<Header title="All Coaches" />

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
				<Text style={{ textAlign: "center", marginTop: 20 }}>Loading coaches...</Text>
			) : filteredCoaches.length === 0 ? (
				<View style={styles.emptyState}>
					<Feather name="users" size={64} color="#ccc" />
					<Text style={styles.emptyStateTitle}>No Matches</Text>
					<Text style={styles.emptyStateText}>No coaches found.</Text>
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
										{coach.name}
									</Text>
									<Text style={{ color: "#666", fontSize: 13 }}>
										@{coach.username || "unknown"}
									</Text>
								</View>
							</TouchableOpacity>

							{coach.students.includes(studentId) ? (
								<Text style={{ color: "#28a745", fontWeight: "600" }}>✓ Already Added</Text>
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
							)}
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
}
