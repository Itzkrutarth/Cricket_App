import { router } from "expo-router"
import React from "react"
import { Button, Text, View } from "react-native"

export default function PlayerHomeScreen() {
	const handleLogout = async () => {
		router.replace("/")
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Welcome Player!</Text>
			<Text>Player dashboard coming soon 🎯</Text>
			<Button title="Logout" onPress={handleLogout} />
		</View>
	)
}
