import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	GestureResponderEvent,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import Header from "./Header_1"
import { styles } from "@/styles/CoachesStyle"

type Coach = {
	id: string
	username: string
	name: string
	photoUrl: string
	email?: string
	role?: string
}

export default function CoachesScreen() {
	const [coaches, setCoaches] = useState<Coach[]>([])
	const router = useRouter()

	useEffect(() => {
		const fetchCoaches = async () => {
			try {
				const response = await fetch(
					"https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Coach"
				)
				const data = await response.json()

				const formatted: Coach[] = data.map((user: any) => ({
					id: user.id,
					username: user.username || "",
					name:
						user.name ||
						`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
						"Unnamed Coach",
					email: user.email || "",
					role: user.role || "",
					photoUrl:
						user.profilePictureUrl ||
						user.photoUrl ||
						"https://cdn-icons-png.flaticon.com/512/149/149071.png",
				}))

				setCoaches(formatted)
				router.setParams({ coachCount: formatted.length.toString() })
			} catch (err) {
				console.error("❌ Failed to fetch coaches:", err)
			}
		}

		fetchCoaches()
	}, [])

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
	function addCoach(event: GestureResponderEvent): void {
		throw new Error("Function not implemented.")
	}

	function removeCoach(event: GestureResponderEvent): void {
		throw new Error("Function not implemented.")
	}

	return (
		<View style={styles.container}>
			<Header title="Coaches" />
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.grid}>
					{coaches.map((coach) => (
						<TouchableOpacity
							key={coach.id}
							style={styles.card}
							onPress={() => openDetails(coach)}
						>
							<Image source={{ uri: coach.photoUrl }} style={styles.image} />
							<Text style={styles.name}>{coach.name}</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={addCoach} style={styles.button}>
					<Feather name="user-plus" size={20} color="#1D3557" />
					<Text style={styles.buttonText}>Add Coach</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={removeCoach} style={styles.button}>
					<Feather name="user-minus" size={20} color="#1D3557" />
					<Text style={styles.buttonText}>Remove Coach</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
