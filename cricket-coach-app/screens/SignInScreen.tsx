import { AntDesign } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
	Alert,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from "react-native"
import { validateSignIn } from "../js/siginValidation"
import { styles } from "../styles/SignInStyles"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/userSlice"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registerForPushNotificationsAsync } from "@/utils/notifications"

export default function SignInScreen() {
	const router = useRouter()
	const dispatch = useDispatch()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [pushToken, setPushToken] = useState<string | null>(null)

	const handleLogin = async () => {
		const validationError = validateSignIn(email.trim(), password.trim())

		if (validationError) {
			setError(validationError)
			return
		}

		setError("")
		setLoading(true)

		try {
			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/SigninJWT",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			)

			const result = await response.json()

			if (response.ok) {
				const { token, name, role, id, profilePic } = result

				// Capitalize first letter of role
				const normalizedRole =
					role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase()

				// Save to Redux
				dispatch(
					setUser({
						name,
						email: result.email || email,
						id,
						role: normalizedRole,
						token,
						profilePicture: profilePic || "",
					})
				)

				// Save to AsyncStorage
				await AsyncStorage.setItem("@token", token)
				await AsyncStorage.setItem("@userName", name)
				await AsyncStorage.setItem("@role", normalizedRole)
				await AsyncStorage.setItem("@profilePicture", profilePic || "")

				Alert.alert("✅ Login Success", `Welcome, ${name}!`)

				if (pushToken) {
					await fetch(
						"https://becomebetter-api.azurewebsites.net/api/SavePushToken",
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ email: result.email || email, pushToken }),
						}
					)
				}

				// Navigate based on role
				if (normalizedRole === "Coach") {
					router.replace("/coachhome")
				} else if (normalizedRole === "Player") {
					router.replace("/studenthome")
				} else {
					Alert.alert("⚠️ Unknown Role", `Unhandled role: ${normalizedRole}`)
				}
			} else {
				Alert.alert("❌ Login Failed", result.message || "Invalid credentials")
			}
		} catch (err) {
			console.error("⚠️ Login Error:", err)
			Alert.alert("Error", "Login request failed.")
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		const getToken = async () => {
			const token = await registerForPushNotificationsAsync()
			console.log("📱 Push token:", token)
			setPushToken(token)
		}
		getToken()
	}, [])
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

				{loading ? (
					<ActivityIndicator size="large" color="#1D4ED8" />
				) : (
					<TouchableOpacity onPress={handleLogin} style={styles.button}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
				)}

				<View style={styles.rightAlignRow}>
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
