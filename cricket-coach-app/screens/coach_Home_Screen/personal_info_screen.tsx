import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useState } from "react"
import { Image, ScrollView, Text, View } from "react-native"
import { styles } from "../../styles/PersonalInfoStyles"
import Header from "./Header_1"
const PersonalInfoScreen = () => {
	const [name, setName] = useState("Coach")
	const [profilePictureUrl, setProfilePictureUrl] = useState("")
	const [role, setRole] = useState("Coach") // Default fallback

	useEffect(() => {
		const loadUserData = async () => {
			const storedName = await AsyncStorage.getItem("userName")
			const storedProfile = await AsyncStorage.getItem("profilePictureUrl")
			const storedRole = await AsyncStorage.getItem("userRole")

			if (storedName) setName(storedName)
			if (storedProfile) setProfilePictureUrl(storedProfile)
			if (storedRole) setRole(storedRole)
		}
		loadUserData()
	}, [])

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Header title="Personal Information" />
			<View style={styles.profileSection}>
				<Image
					source={
						profilePictureUrl
							? { uri: profilePictureUrl }
							: require("../../assets/images/boy.png")
					}
					style={styles.profileImage}
				/>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.role}>{role}</Text>
			</View>

			<View style={styles.infoSection}>
				<View style={styles.infoItem}>
					<Text style={styles.label}>Full Name:</Text>
					<Text style={styles.value}>{name}</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.label}>Role:</Text>
					<Text style={styles.value}>{role}</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.label}>Birthplace:</Text>
					<Text style={styles.value}>Ahmedabad, India</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.label}>Experience:</Text>
					<Text style={styles.value}>8 Years</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={styles.label}>History:</Text>
					<Text style={styles.value}>
						Former domestic cricketer and current U-19 national team coach.
					</Text>
				</View>
			</View>
		</ScrollView>
	)
}

export default PersonalInfoScreen
