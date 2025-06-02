import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { router, useLocalSearchParams } from "expo-router"

import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../../styles/CoachHomeStyles"

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

	const [coachName, setCoachName] = useState("")
	const [profileUrl, setProfileUrl] = useState("")

	useEffect(() => {
		const loadCoachData = async () => {
			const name = await AsyncStorage.getItem("userName")
			const photo = await AsyncStorage.getItem("profilePictureUrl")
			if (name) setCoachName(name)
			if (photo) setProfileUrl(photo)
		}
		loadCoachData()
	}, [])

	function handleStudent(): void {
		router.push("/coach-home/StudentScreen")
	}

	return (
		<View style={styles.container}>
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
					</View>
				</View>
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
