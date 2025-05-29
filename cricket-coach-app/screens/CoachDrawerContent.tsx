import { Feather, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../styles/CoachDrawerStyles"

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
		router.push("/coach-home/PersonalInfoScreen")
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
		</View>
	)
}

export default CoachDrawerContent
