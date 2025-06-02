import React, { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import Header from "./Header_1"
import { styles } from "@/styles/CoachesStyle"

type Coach = {
	id: string
	name: string
	photoUrl: string
}

const initialCoaches: Coach[] = [
	{ id: "1", name: "Andy", photoUrl: "https://picsum.photos/300/300?1" },
	{ id: "2", name: "Brian", photoUrl: "https://picsum.photos/300/300?2" },
	{ id: "3", name: "Josh", photoUrl: "https://picsum.photos/300/300?3" },
]

export default function CoachesScreen() {
	const [coaches, setCoaches] = useState<Coach[]>(initialCoaches)
	const router = useRouter()

	useEffect(() => {
		router.setParams({ coachCount: coaches.length.toString() })
	}, [coaches.length])

	const addCoach = () => {
		const nextId = (coaches.length + 1).toString()
		setCoaches((curr) => [
			...curr,
			{
				id: nextId,
				name: `New ${nextId}`,
				photoUrl: "https://picsum.photos/300/300?rand",
			},
		])
	}

	const removeCoach = () => {
		setCoaches((curr) => curr.slice(0, -1))
	}

	const openDetails = (coach: Coach) => {
		router.push({
			pathname: "/student-home/coach-detail",
			params: {
				id: coach.id,
				name: coach.name,
				photoUrl: coach.photoUrl,
			},
		})
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
