import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

// Configure how notifications behave when received in foreground (especially for iOS)
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
})

export async function registerForPushNotificationsAsync(): Promise<
	string | null
> {
	try {
		if (!Device.isDevice) {
			console.warn("Push notifications only work on a physical device.")
			return null
		}

		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync()
			finalStatus = status
		}

		if (finalStatus !== "granted") {
			console.warn("Push notification permission not granted.")
			return null
		}

		const { data: token } = await Notifications.getExpoPushTokenAsync()
		console.log("📲 Expo push token:", token)

		return token
	} catch (err) {
		console.error("❌ Failed to register for push notifications:", err)
		return null
	}
}
