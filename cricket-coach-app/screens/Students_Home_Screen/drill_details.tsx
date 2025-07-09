import React from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Header from "./Header_1"
import { Feather } from "@expo/vector-icons"
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
	const { id } = useLocalSearchParams<{ id: string }>()
	const drill = drillDetails[id as string]
	const router = useRouter()

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
			<Header title="Drill Details" />

			<ScrollView
				contentContainerStyle={{
					padding: 16,
				}}
			>
				<View
					style={{
						backgroundColor: "#fff",
						borderRadius: 12,
						padding: 20,
						marginBottom: 16,
						shadowColor: "#000",
						shadowOpacity: 0.1,
						shadowRadius: 6,
						elevation: 3,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: "#1D3557",
							marginBottom: 10,
							textAlign: "center",
						}}
					>
						{drill.name}
					</Text>

					<TouchableOpacity
						style={{
							backgroundColor: "#4e73df",
							padding: 12,
							borderRadius: 8,
							marginVertical: 10,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
						onPress={() => console.log("Play drill video")}
					>
						<Feather name="play-circle" size={18} color="#fff" />
						<Text
							style={{
								color: "#fff",
								marginLeft: 8,
								fontWeight: "600",
							}}
						>
							Play Drill
						</Text>
					</TouchableOpacity>

					<Text style={styles.detailText}>
						<Text style={{ fontWeight: "bold" }}>Equipment:</Text> {drill.equipment}
					</Text>
					<Text style={styles.detailText}>
						<Text style={{ fontWeight: "bold" }}>Improves:</Text> {drill.improves}
					</Text>
					<Text style={styles.detailText}>
						<Text style={{ fontWeight: "bold" }}>Instructions:</Text> {drill.instructions}
					</Text>
					<Text style={styles.detailText}>
						<Text style={{ fontWeight: "bold" }}>Frequency:</Text> {drill.frequency}
					</Text>
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: "#2563EB",
							padding: 12,
							borderRadius: 8,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
							marginRight: 8,
						}}
						onPress={() => console.log("Get directions")}
					>
						<Feather name="map-pin" size={16} color="#fff" />
						<Text
							style={{
								color: "#fff",
								fontWeight: "600",
								marginLeft: 6,
							}}
						>
							Get Directions
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: "#7C3AED",
							padding: 12,
							borderRadius: 8,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
							marginLeft: 8,
						}}
						onPress={() => console.log("Share drill")}
					>
						<Feather name="share-2" size={16} color="#fff" />
						<Text
							style={{
								color: "#fff",
								fontWeight: "600",
								marginLeft: 6,
							}}
						>
							Share
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	)
}
