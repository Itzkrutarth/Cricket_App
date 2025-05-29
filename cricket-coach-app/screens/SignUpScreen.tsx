import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
	ActivityIndicator,
	Alert,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native"
import { styles } from "../styles/SignUpStyles"

import { Ionicons } from "@expo/vector-icons"

export default function SignUpScreen() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [username, setUsername] = useState("")
	const [birthDate, setBirthDate] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [password, setPassword] = useState("")
	const [gender, setGender] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [email, setEmail] = useState("")
	const [image, setImage] = useState<string | null>(null)
	const [role, setRole] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Record<string, string>>({
		name: "",
		birthDate: "",
		email: "",
		username: "",
		gender: "",
		phoneNumber: "",
		role: "",
		password: "",
		confirmPassword: "",
	})

	const handleDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date
	) => {
		if (event.type === "dismissed") {
			setShowDatePicker(false)
			return
		}
		if (selectedDate) {
			const formattedDate = selectedDate
				.toLocaleDateString("en-GB")
				.replace(/\//g, "-") // "dd-mm-yyyy"
			setBirthDate(formattedDate)
		}
		setShowDatePicker(false)
	}

	// const handlePickImage = () => {
	// 	Alert.alert("Select Option", "Choose an image source", [
	// 		{
	// 			text: "Camera",
	// 			onPress: async () => {
	// 				const permission = await ImagePicker.requestCameraPermissionsAsync()
	// 				if (permission.granted) {
	// 					const result = await ImagePicker.launchCameraAsync({
	// 						mediaTypes: ImagePicker.MediaTypeOptions.Images,
	// 						quality: 1,
	// 					})
	// 					if (!result.canceled) setImage(result.assets[0].uri)
	// 				}
	// 			},
	// 		},
	// 		{
	// 			text: "Gallery",
	// 			onPress: async () => {
	// 				const permission =
	// 					await ImagePicker.requestMediaLibraryPermissionsAsync()
	// 				if (permission.granted) {
	// 					const result = await ImagePicker.launchImageLibraryAsync({
	// 						mediaTypes: ImagePicker.MediaTypeOptions.Images,
	// 						quality: 1,
	// 					})
	// 					if (!result.canceled) setImage(result.assets[0].uri)
	// 				}
	// 			},
	// 		},
	// 		{ text: "Cancel", style: "cancel" },
	// 	])
	// }

	// const handleSignup = async () => {
	// 	const validationErrors = validateSignUp({
	// 		name,
	// 		username,
	// 		email,
	// 		birthDate,
	// 		phoneNumber,
	// 		role,
	// 		password,
	// 		gender,
	// 		confirmPassword,
	// 	})

	// 	if (validationErrors) {
	// 		setError(validationErrors)
	// 		return
	// 	}

	// 	const userData = {
	// 		name,
	// 		email,
	// 		phoneNumber,
	// 		username,
	// 		birthDate,
	// 		role,
	// 		gender,
	// 		password,
	// 	}

	// 	try {
	// 		const response = await fetch(
	// 			"https://becomebetter-api.azurewebsites.net/api/signupUser",
	// 			{
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify(userData),
	// 			}
	// 		)

	// 		if (!response.ok) {
	// 			const errorText = await response.text()
	// 			console.error("API Error:", errorText)
	// 			Alert.alert("Signup Failed", errorText)
	// 			return
	// 		}

	// 		const result = await response.json()
	// 		console.log("Signup success:", result)
	// 		Alert.alert("Success", result.message)
	// 		router.replace("/coachhome")
	// 	} catch (error) {
	// 		console.error("Fetch error:", error)
	// 		Alert.alert("Error", "Something went wrong. Try again.")
	// 	}
	// }
	const handleSignup = async () => {
		let profilePictureUrl = null

		// ✅ Validation check (example only, you can expand this)
		if (!name || !email || !password || !role || !birthDate) {
			Alert.alert("Missing Fields", "Please fill out all required fields.")
			return
		}

		setLoading(true) // ✅ Show spinner after validation

		try {
			// 📸 Upload profile image if present
			if (image) {
				const fileName = email.replace(/[@.]/g, "_") + ".jpg"
				profilePictureUrl = await uploadImageToAzure(image, fileName)
			}

			const userData = {
				name,
				email,
				username,
				password,
				phoneNumber,
				gender,
				role,
				birthDate,
				profilePictureUrl,
			}

			console.log("📤 Sending signup request...")

			// Optional: Add delay to simulate cold start
			// await new Promise(resolve => setTimeout(resolve, 3000))

			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/SignUp",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				}
			)

			const resultText = await response.text()
			console.log("📩 Response:", resultText)

			if (response.ok) {
				Alert.alert("✅ Signup Success", resultText)
				router.replace("/coachhome") // or redirect to login
			} else {
				Alert.alert("❌ Signup Failed", resultText)
			}
		} catch (error) {
			console.error("⚠️ Signup error:", error)
			Alert.alert("Error", "Failed to connect to the server.")
		} finally {
			setLoading(false) // ✅ Always hide spinner
		}
	}

	const uploadImageToAzure = async (uri: string, fileName: string) => {
		try {
			const accountName = "becomebetterstorage"
			const containerName = "profile-pictures"
			const sasToken =
				"sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-09-02T03:51:16Z&st=2025-05-27T19:51:16Z&spr=https&sig=qTyBjiN05FSygK9%2B4oSDG78wANn7w7BWc7PfRLqNvzA%3D" // no '?'
			const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`

			const response = await FileSystem.uploadAsync(blobUrl, uri, {
				httpMethod: "PUT",
				uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
				headers: {
					"x-ms-blob-type": "BlockBlob",
					"Content-Type": "image/jpeg",
				},
			})

			console.log("✅ Image uploaded:", blobUrl.split("?")[0])
			return blobUrl.split("?")[0]
		} catch (error) {
			console.error("❌ Upload error:", (error as Error).message)
			return null
		}
	}

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			// convert to JPEG
			const manipulated = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[],
				{ compress: 1, format: ImageManipulator.SaveFormat.JPEG }
			)
			setImage(manipulated.uri)
		}
	}

	const pickImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (permissionResult.granted === false) {
			alert("Permission to access gallery is required!")
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})

		if (!result.canceled) {
			setImage(result.assets[0].uri)
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentContainerStyle={styles.container}
						keyboardShouldPersistTaps="handled"
					>
						<TouchableOpacity
							style={styles.profilePicWrapper}
							onPress={handlePickImage}
						>
							{image ? (
								<Image source={{ uri: image }} style={styles.profilePic} />
							) : (
								<Ionicons
									name="person-circle-outline"
									size={120}
									color="#ccc"
								/>
							)}
							<Ionicons
								name="camera"
								size={28}
								color="#000"
								style={styles.cameraIcon}
							/>
						</TouchableOpacity>

						<TextInput
							style={styles.input}
							placeholder="Full Name"
							placeholderTextColor="#6B7280"
							value={name}
							onChangeText={setName}
						/>
						{error.name ? <Text style={styles.error}>{error.name}</Text> : null}

						<TextInput
							style={styles.input}
							placeholder="Email Address"
							placeholderTextColor="#6B7280"
							keyboardType="email-address"
							autoCapitalize="none"
							value={email}
							onChangeText={setEmail}
						/>
						{error.email ? (
							<Text style={styles.error}>{error.email}</Text>
						) : null}

						<TextInput
							style={styles.input}
							placeholder="Phone Number (10 digits)"
							placeholderTextColor="#6B7280"
							keyboardType="number-pad"
							maxLength={10}
							value={phoneNumber}
							onChangeText={(text) =>
								setPhoneNumber(text.replace(/[^0-9]/g, ""))
							}
						/>
						{error.phoneNumber ? (
							<Text style={styles.error}>{error.phoneNumber}</Text>
						) : null}

						<TextInput
							style={styles.input}
							placeholder="Username"
							placeholderTextColor="#6B7280"
							autoCapitalize="none"
							value={username}
							onChangeText={setUsername}
						/>
						{error.username ? (
							<Text style={styles.error}>{error.username}</Text>
						) : null}

						<TouchableOpacity onPress={() => setShowDatePicker(true)}>
							<View pointerEvents="none">
								<TextInput
									style={styles.input}
									placeholder="Birth Date (dd-mm-yyyy)"
									placeholderTextColor="#6B7280"
									value={birthDate}
									editable={false}
								/>
							</View>
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								style={styles.date}
								value={
									birthDate
										? new Date(birthDate.split("-").reverse().join("-"))
										: new Date()
								}
								mode="date"
								display="default"
								onChange={handleDateChange}
								maximumDate={new Date()}
							/>
						)}
						{error.birthDate ? (
							<Text style={styles.error}>{error.birthDate}</Text>
						) : null}
						<TextInput
							style={styles.input}
							placeholder="Password"
							placeholderTextColor="#6B7280"
							value={password}
							secureTextEntry
							onChangeText={setPassword}
						/>
						{error.password ? (
							<Text style={styles.error}>{error.password}</Text>
						) : null}

						<TextInput
							style={styles.input}
							placeholder="Confirm Password"
							placeholderTextColor="#6B7280"
							value={confirmPassword}
							secureTextEntry
							onChangeText={setConfirmPassword}
						/>
						{error.confirmPassword ? (
							<Text style={styles.error}>{error.confirmPassword}</Text>
						) : null}

						<View style={styles.radioContainer}>
							<Text style={styles.askuserrole}>User Role</Text>
							<TouchableOpacity
								onPress={() => setRole("Player")}
								style={styles.radioButton}
							>
								<View style={styles.radioCircle}>
									{role === "Player" && <View style={styles.radioDot} />}
								</View>
								<Text>Player</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setRole("Coach")}
								style={styles.radioButton}
							>
								<View style={styles.radioCircle}>
									{role === "Coach" && <View style={styles.radioDot} />}
								</View>
								<Text>Coach</Text>
							</TouchableOpacity>
						</View>
						{error.role ? <Text style={styles.error}>{error.role}</Text> : null}

						<View style={styles.radioContainer}>
							<Text style={styles.askuserrole}>Gender</Text>

							<TouchableOpacity
								onPress={() => setGender("Male")}
								style={styles.radioButton}
							>
								<View style={styles.radioCircle}>
									{gender === "Male" && <View style={styles.radioDot} />}
								</View>
								<Text>Male</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setGender("Female")}
								style={styles.radioButton}
							>
								<View style={styles.radioCircle}>
									{gender === "Female" && <View style={styles.radioDot} />}
								</View>
								<Text>Female</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setGender("Other")}
								style={styles.radioButton}
							>
								<View style={styles.radioCircle}>
									{gender === "Other" && <View style={styles.radioDot} />}
								</View>
								<Text>Other</Text>
							</TouchableOpacity>
						</View>
						{error.gender ? (
							<Text style={styles.error}>{error.gender}</Text>
						) : null}

						{loading ? (
							<ActivityIndicator size="large" color="#1D4ED8" />
						) : (
							<TouchableOpacity onPress={handleSignup} style={styles.button}>
								<Text style={styles.buttonText}>Create Account</Text>
							</TouchableOpacity>
						)}

						<TouchableOpacity onPress={() => router.push("/")}>
							<Text style={styles.footerText}>
								Already have an account?{" "}
								<Text style={styles.linkText}>Back to Login</Text>
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
