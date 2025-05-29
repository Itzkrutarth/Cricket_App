import { useNavigation } from "@react-navigation/native"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../styles/CoachHomeStyles"

const HomeContent = () => {
	const navigation = useNavigation()
	const params = useLocalSearchParams()
	const [studentCount, setStudentCount] = useState(3) // Default count

	// Update student count when returning from StudentScreen
	useEffect(() => {
		if (params.studentCount) {
			setStudentCount(Number(params.studentCount))
		}
	}, [params.studentCount])

	function handleStudent(): void {
		router.push("/coach-home/StudentScreen")
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.profile}>
					<Image
						source={require("../assets/images/boy.png")}
						style={styles.profileImage}
					/>
				</View>
				<Text>Hello Coach</Text>
			</View>

			{/* Stats */}
			<View style={styles.stats}>
				<TouchableOpacity
					style={styles.statBox}
					onPress={() => handleStudent()}
				>
					<Text style={styles.statLabel}>Students</Text>
					<Text style={styles.statValue}>{studentCount}</Text>
				</TouchableOpacity>

				<View style={styles.statBox}>
					<Text style={styles.statLabel}>Sessions</Text>
					<Text style={styles.statValue}>12</Text>
				</View>
				<View style={styles.statBox}>
					<Text style={styles.statLabel}>Videos</Text>
					<Text style={styles.statValue}>48</Text>
				</View>
			</View>
		</View>
	)
}

export default HomeContent