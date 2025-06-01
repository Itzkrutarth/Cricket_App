import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Header from "./Header_1"
import { styles } from "@/styles/DrillsStyles"

type DrillDetail = {
	id: string
	name: string
	equipment: string
	improves: string
	instructions: string
	frequency: string
}

const drillDetails: Record<string, DrillDetail> = {
	"1": {
		id: "1",
		name: "Lunge with intent drill",
		equipment: "Cones, chalk",
		improves: "Balance, foot movement",
		instructions: "Step forward with intent, maintain balance",
		frequency: "Twice a week",
	},
	"2": {
		id: "2",
		name: "Cut shot drill",
		equipment: "Cones, chalk",
		improves: "Foot movement, precision",
		instructions: "Practice cutting the ball with quick footwork",
		frequency: "Once a week",
	},
	"3": {
		id: "3",
		name: "Pull shot drill",
		equipment: "Balls, net",
		improves: "Power, timing",
		instructions: "Pull the ball with force across the field",
		frequency: "Twice a week",
	},
	"4": {
		id: "4",
		name: "Scoop drill",
		equipment: "Balls, mat",
		improves: "Finesse, wrist work",
		instructions: "Scoop the ball gently over the keeper",
		frequency: "Once a week",
	},
}

export default function DrillDetailsScreen() {
	const { id, name } = useLocalSearchParams<{
		id: string
		name: string
	}>()
	const router = useRouter()

	const drill = drillDetails[id as string]

	if (!drill) {
		return (
			<View style={styles.container}>
				<Header title="Drill Details" />
				<Text style={styles.name}>Drill not found</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<Header title={drill.name} />
			<View style={styles.detailsContainer}>
				<TouchableOpacity
					style={styles.playButton}
					onPress={() => console.log("Play drill video")}
					accessibilityLabel={`Play ${drill.name} video`}
					accessibilityRole="button"
				>
					<Text style={styles.playButtonText}>▶ Play Drill</Text>
				</TouchableOpacity>
				<Text style={styles.detailText}>
					Equipment needed: {drill.equipment}
				</Text>
				<Text style={styles.detailText}>Improves: {drill.improves}</Text>
				<Text style={styles.detailText}>
					Instructions: {drill.instructions}
				</Text>
				<Text style={styles.detailText}>Frequency: {drill.frequency}</Text>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => console.log("Get directions")}
					accessibilityLabel="Get directions to drill location"
					accessibilityRole="button"
				>
					<Text style={styles.buttonText}>Get Directions</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => console.log("Share drill")}
					accessibilityLabel="Share drill"
					accessibilityRole="button"
				>
					<Text style={styles.buttonText}>Share</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
