const { CosmosClient } = require("@azure/cosmos")
const fetch = require("node-fetch")

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING

module.exports = async function (context, req) {
	const { coachId, videoId, studentName } = req.body

	if (!coachId || !videoId) {
		context.res = {
			status: 400,
			body: "Missing required fields (coachId, videoId)",
		}
		return
	}

	try {
		const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING)
		const db = cosmosClient.database("becomebetter")
		const userContainer = db.container("users")

		const { resource: coachUser } = await userContainer
			.item(coachId, coachId)
			.read()

		// 🔄 Support both "pushToken" and "pushTokens"
		const tokens =
			coachUser.pushTokens || (coachUser.pushToken ? [coachUser.pushToken] : [])

		context.log("🎯 Coach Push Tokens:", tokens)

		if (!tokens.length) {
			context.res = {
				status: 204,
				body: "Coach has no registered push tokens.",
			}
			return
		}

		const pushNotifications = tokens.map((token) => ({
			to: token,
			sound: "default",
			title: "📹 New Video Uploaded",
			body: "A student uploaded a video for you.",
			data: { type: "video", videoId },
		}))

		const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(pushNotifications),
		})

		const expoResult = await expoResponse.json()
		context.log("📨 Expo push result:", expoResult)

		context.res = {
			status: 200,
			body: {
				message: "Notification sent.",
				expoResult,
			},
		}
	} catch (error) {
		context.log.error("❌ Notification error:", error)
		context.res = {
			status: 500,
			body: {
				message: "Notification failed",
				error: error.message,
			},
		}
	}
}
