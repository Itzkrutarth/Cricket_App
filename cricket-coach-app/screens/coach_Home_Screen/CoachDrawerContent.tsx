import { Feather, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Alert, Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../../styles/CoachDrawerStyles"

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
		router.push("/coachhome")
	}
	function handlePersonalInfo(): void {
		router.push("/coach-home/personalinfo_screen")
	}
	function handleAllPicture(): void {
		router.push("/coach-home/AllPictureScreen")
	}
	function handleAllvideos(): void {
		router.push("/coach-home/AllVideoScreen")
	}
	function handleFavourite(): void {
		router.push("/coach-home/FavouriteScreen")
	}
	function handleSetting(): void {
		router.push("/coach-home/SettingScreen")
	}
	function handleStudent(): void {
		router.push("/coach-home/StudentScreen")
	}
	return (
		<View style={styles.container}>
			<View style={styles.profileContainer}>
				<Image
					source={
						profilePictureUrl
							? { uri: profilePictureUrl }
							: require("../../assets/images/boy.png")
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
				<Feather name="user" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Home</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handlePersonalInfo()}
				style={styles.menuItem}
			>
				<Feather name="user" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Personal Information</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => handleStudent()} style={styles.menuItem}>
				<Feather name="users" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Students</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handleAllvideos()}
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

			<TouchableOpacity
				onPress={() => handleFavourite()}
				style={styles.menuItem}
			>
				<Feather name="heart" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Favourites</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => handleSetting()} style={styles.menuItem}>
				<Feather name="settings" size={20} color="#1D4ED8" />
				<Text style={styles.menuText}>Settings</Text>
			</TouchableOpacity>

			{/* Logout */}
			<TouchableOpacity
				onPress={() => {
					Alert.alert(
						"Confirm Logout",
						"Are you sure you want to logout?",
						[
							{
								text: "Cancel",
								style: "cancel",
							},
							{
								text: "Logout",
								style: "destructive",
								onPress: async () => {
									console.log("Logging out...")
									await AsyncStorage.clear() // Optional: Clear all stored user data
									router.replace("/signin")
								},
							},
						],
						{ cancelable: true }
					)
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
