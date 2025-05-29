import { AntDesign } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { validateSignIn } from "../js/siginValidation"
import { styles } from "../styles/SignInStyles"

export default function SignInScreen() {
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const handleLogin = async () => {
		const validationError = validateSignIn(email.trim(), password.trim())

		if (validationError) {
			setError(validationError)
			return
		}

		setError("")
		console.log("📤 Sending login request...")

		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/SignIn?code=RHv5PZfoUpc9OjQgnS_eHQBdnCtKgUeqV4KzsCu2zednAzFu6mjybw==",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			)

			const result = await response.json()

			console.log("📥 Login Response:", result)

			if (response.ok) {
				const user = result.user
				const userName = user?.name || "User"
				const userRole = user?.role
				const profileUrl = user?.profilePictureUrl || ""

				// Save to AsyncStorage
				if (userName) await AsyncStorage.setItem("userName", userName)
				if (userRole) await AsyncStorage.setItem("userRole", userRole)
				if (profileUrl)
					await AsyncStorage.setItem("profilePictureUrl", profileUrl)
				if (user?.id) await AsyncStorage.setItem("userId", user.id)

				Alert.alert("✅ Login Success", `Welcome, ${userName}!`)

				if (userRole === "Coach") {
					router.replace("/coachhome")
				} else if (userRole === "Player") {
					router.replace("/playerhome")
				} else {
					Alert.alert("⚠️ Unknown Role", `Unhandled role: ${userRole}`)
				}
			} else {
				Alert.alert("❌ Login Failed", result.message || "Invalid credentials")
			}
		} catch (err) {
			console.error("⚠️ Login Error:", err)
			Alert.alert("Error", "Login request failed.")
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Welcome Back!</Text>

			<View style={styles.card}>
				<Text style={styles.title}>Login Account</Text>
				<TextInput
					style={styles.input}
					placeholder="Email Address"
					placeholderTextColor="#6B7280"
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					placeholderTextColor="#6B7280"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>

				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<View style={styles.rightAlignRow}>
					{/* <Text style={styles.rememberText}>Save Password</Text> */}
					<TouchableOpacity onPress={() => router.push("/forgotpassword")}>
						<Text style={styles.linkText}>Forgot Password</Text>
					</TouchableOpacity>
				</View>

				{error ? (
					<Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
						{error}
					</Text>
				) : null}

				<Text style={styles.orText}>Or</Text>
				<View style={styles.socialRow}>
					<TouchableOpacity
						style={styles.socialButton}
						onPress={() => router.push("/phonelogin")}
					>
						<AntDesign name="mobile1" size={24} color="#1D4ED8" />
						<Text style={styles.socialText}>Login with Phone Number</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity onPress={() => router.push("/signup")}>
				<Text style={styles.footer}>
					Do Not Have an Account?{" "}
					<Text style={styles.linkText}>Create Account</Text>
				</Text>
			</TouchableOpacity>
		</View>
	)
}
