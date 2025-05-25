import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
	Keyboard,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native"
import { styles } from "../styles/SignInStyles"

export default function PhoneLoginScreen() {
	const router = useRouter()

	const [phoneNumber, setPhoneNumber] = useState("")
	const [otp, setOtp] = useState("")
	const [otpSent, setOtpSent] = useState(false)
	const [error, setError] = useState("")

	const handleSendOtp = () => {
		if (!phoneNumber.trim().match(/^\d{10}$/)) {
			setError("Please enter a valid 10-digit phone number")
			return
		}

		setError("")
		setOtpSent(true)
		console.log("OTP sent to:", phoneNumber)
	}

	const handleVerifyOtp = () => {
		if (!otp.trim() || otp.length < 4) {
			setError("Invalid OTP")
			return
		}

		setError("")
		console.log("Verifying OTP:", otp)
		router.replace("/coachhome")
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.container}>
				<Text style={styles.header}>Sign In with Mobile</Text>

				<View style={styles.card}>
					<Text style={styles.title}>Enter Your Phone Number</Text>
					<TextInput
						style={styles.input}
						placeholder="Phone Number (10 digits)"
						placeholderTextColor="#6B7280"
						keyboardType="number-pad"
						value={phoneNumber}
						maxLength={10}
						onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ""))}
					/>

					{otpSent && (
						<TextInput
							style={styles.input}
							placeholder="Enter OTP"
							placeholderTextColor="#6B7280"
							keyboardType="number-pad"
							value={otp}
							onChangeText={setOtp}
						/>
					)}

					<TouchableOpacity
						style={styles.button}
						onPress={otpSent ? handleVerifyOtp : handleSendOtp}
					>
						<Text style={styles.buttonText}>
							{otpSent ? "Verify OTP" : "Send OTP"}
						</Text>
					</TouchableOpacity>

					{error ? (
						<Text
							style={{ color: "red", textAlign: "center", marginBottom: 10 }}
						>
							{error}
						</Text>
					) : null}
				</View>

				<TouchableOpacity onPress={() => router.push("/signup")}>
					<Text style={styles.footer}>
						Don’t have an account?{" "}
						<Text style={styles.linkText}>Create Account</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableWithoutFeedback>
	)
}
