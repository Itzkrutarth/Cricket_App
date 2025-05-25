import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import { useRouter } from "expo-router"
import React, { useState } from "react"

import {
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

import * as ImagePicker from "expo-image-picker"

import { Ionicons } from "@expo/vector-icons"
import { validateSignUp } from "../js/signupValidation"

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

	const handlePickImage = () => {
		Alert.alert("Select Option", "Choose an image source", [
			{
				text: "Camera",
				onPress: async () => {
					const permission = await ImagePicker.requestCameraPermissionsAsync()
					if (permission.granted) {
						const result = await ImagePicker.launchCameraAsync({
							mediaTypes: ImagePicker.MediaTypeOptions.Images,
							quality: 1,
						})
						if (!result.canceled) setImage(result.assets[0].uri)
					}
				},
			},
			{
				text: "Gallery",
				onPress: async () => {
					const permission =
						await ImagePicker.requestMediaLibraryPermissionsAsync()
					if (permission.granted) {
						const result = await ImagePicker.launchImageLibraryAsync({
							mediaTypes: ImagePicker.MediaTypeOptions.Images,
							quality: 1,
						})
						if (!result.canceled) setImage(result.assets[0].uri)
					}
				},
			},
			{ text: "Cancel", style: "cancel" },
		])
	}

	const handleSignup = async () => {
		const validationErrors = validateSignUp({
			name,
			username,
			email,
			birthDate,
			phoneNumber,
			role,
			password,
			gender,
			confirmPassword,
		})

		if (validationErrors) {
			setError(validationErrors)
			return
		}

		const userData = {
			name,
			email,
			phoneNumber,
			username,
			birthDate,
			role,
			gender,
			password,
		}

		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/signupUser",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				}
			)

			if (!response.ok) {
				const errorText = await response.text()
				console.error("API Error:", errorText)
				Alert.alert("Signup Failed", errorText)
				return
			}

			const result = await response.json()
			console.log("Signup success:", result)
			Alert.alert("Success", result.message)
			router.replace("/coachhome")
		} catch (error) {
			console.error("Fetch error:", error)
			Alert.alert("Error", "Something went wrong. Try again.")
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
		<SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.headerContainer}>
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color="#2563EB" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Sign Up</Text>
					<View style={{ width: 24 }} /> {/* Placeholder for symmetry */}
				</View>
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

						<TouchableOpacity style={styles.button} onPress={handleSignup}>
							<Text style={styles.buttonText}>Create Account</Text>
						</TouchableOpacity>

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
