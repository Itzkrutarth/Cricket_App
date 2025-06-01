import { styles } from "@/styles/StudentDrawerStyles"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

const CoachDrawerContent: React.FC<DrawerContentComponentProps> = ({
	navigation,
}) => {
	const handleNavigate = (screen: string) => {
		console.log("navigate", screen)
		navigation.navigate(screen as never)
	}

	const [coachName, setCoachName] = useState("Coach")
	const [profilePictureUrl, setProfilePictureUrl] = useState("")

	useEffect(() => {
		const loadCoachData = async () => {
			const name = await AsyncStorage.getItem("userName")
			const photo = await AsyncStorage.getItem("profilePictureUrl")
			if (name) setCoachName(name)
			if (photo) setProfilePictureUrl(photo)
		}
		loadCoachData()
	}, [])

	function handleHome(): void {
		router.push("./StudentHomeScreen")
	}
	function handlePersonalInfo(): void {
		router.push("./personalinfo_screen")
	}
	function handleAllPicture(): void {
		router.push("./AllPicturesScreen")
	}
	function handleAllVideos(): void {
		router.push("./AllVideosScreen")
	}
	function handleDrills(): void {
		router.push("./DrillsScreen")
	}
	function handleSettings(): void {
		router.push("./SettingsScreen")
	}
	function handleCoaches(): void {
		router.push("./CoachesScreen")
	}

	return (
		<View style={styles.container}>
			<View style={styles.profileContainer}>
				<Image
					source={
						profilePictureUrl
							? { uri: profilePictureUrl }
							: require("../assets/images/boy.png")
					}
					style={styles.profileImage}
				/>
				<Text style={styles.coachName}>{coachName}</Text>
				<TouchableOpacity>
					<View style={styles.editImageContainer}>
						<Feather name="edit" size={16} color="#1D4ED8" />
						<Text style={styles.editImageText}>Edit Image</Text>
					</View>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={() => handleHome()} style={styles.menuItem}>
				<Feather name="home" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Home</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => handlePersonalInfo()}
				style={styles.menuItem}
			>
				<Feather name="user" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Personal Information</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => handleCoaches()} style={styles.menuItem}>
				<Feather name="users" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Coaches</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => handleAllVideos()}
				style={styles.menuItem}
			>
				<Feather name="video" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>All Videos</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => handleAllPicture()}
				style={styles.menuItem}
			>
				<Feather name="image" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>All Pictures</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => handleDrills()} style={styles.menuItem}>
				<Feather name="heart" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Drills</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => handleSettings()}
				style={styles.menuItem}
			>
				<Feather name="settings" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Settings</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					console.log("Logging out...")
					router.replace("/signin")
				}}
				style={styles.logoutItem}
			>
				<MaterialIcons name="logout" size={20} color="#DC2626" />
				<Text style={styles.logoutText}>Logout</Text>
			</TouchableOpacity>
		</View>
	)
}

export default CoachDrawerContent
