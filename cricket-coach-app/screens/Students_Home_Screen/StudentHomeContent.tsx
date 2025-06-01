import { styles } from "@/styles/StudentHomeStyles"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

const HomeContent = () => {
	const navigation = useNavigation()
	const params = useLocalSearchParams()
	const [coachCount, setCoachCount] = useState(3)

	useEffect(() => {
		if (params.coachCount) {
			setCoachCount(Number(params.coachCount))
		}
	}, [params.coachCount])

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

	function handleCoaches(): void {
		router.push("./CoachesScreen")
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.profile}>
					<Image
						source={
							profileUrl
								? { uri: profileUrl }
								: require("../assets/images/boy.png")
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
			<View style={styles.stats}>
				<TouchableOpacity
					style={styles.statBox}
					onPress={() => handleCoaches()}
				>
					<Text style={styles.statLabel}>Coaches</Text>
					<Text style={styles.statValue}>{coachCount}</Text>
				</TouchableOpacity>
				<View style={styles.statBox}>
					<Text style={styles.statLabel}>Sessions</Text>
					<Text style={styles.statValue}>12</Text>
				</View>
				<View style={styles.statBox}>
					<Text style={styles.statLabel}>Drills</Text>
					<Text style={styles.statValue}>48</Text>
				</View>
			</View>
		</View>
	)
}

export default HomeContent
