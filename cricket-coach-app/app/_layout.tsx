import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native"
import { Stack, useRouter, usePathname, Slot } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"

import { useColorScheme } from "@/hooks/useColorScheme"
import { LogBox } from "react-native"
import React, { useEffect, useState } from "react"

import { Provider, useSelector } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor, RootState } from "../store/store"

LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"])

// Inner layout that safely uses Redux
function AppLayout() {
	const colorScheme = useColorScheme()
	const router = useRouter()
	const pathname = usePathname()
	const user = useSelector((state: RootState) => state.user)
	const [authChecked, setAuthChecked] = useState(false)

	useEffect(() => {
		if (!user.token) {
			if (pathname !== "/signin") {
				router.replace("/signin")
			}
		} else {
			if (
				(user.role === "Coach" && pathname !== "/coachhome") ||
				(user.role === "Player" && pathname !== "/studenthome")
			) {
				router.replace(user.role === "Coach" ? "/coachhome" : "/studenthome")
			}
		}
		setAuthChecked(true)
	}, [user])

	if (!authChecked) return null

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShown: false }} />
			<StatusBar style="auto" />
			<Slot />
		</ThemeProvider>
	)
}

export default function RootLayout() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Stack screenOptions={{ headerShown: false }} />
			</PersistGate>
		</Provider>
	)
}
