const { CosmosClient } = require("@azure/cosmos")

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING

module.exports = async function (context, req) {
	context.log("📥 SaveFeedback triggered")

	// Destructure expected values
	const {
		sessionTitle,
		videoThumbnail,
		videoUri,
		videoId,
		studentId,
		coachId,
		textNotes,
		drills,
		exercises,
		explainers,
		voiceNoteUri,
	} = req.body || {}

	// Log incoming data
	context.log("📝 Payload:", req.body)

	// Validate required fields
	if (!studentId || !coachId || !videoId) {
		context.log("❌ Missing required fields:", { studentId, coachId, videoId })
		context.res = {
			status: 400,
			body: "Missing required fields: studentId, coachId, or videoId",
		}
		return
	}

	// Prepare feedback object
	const feedbackData = {
		id: `${videoId}-${Date.now()}`,
		email: studentId, // Partition key
		sessionTitle: sessionTitle || "",
		videoThumbnail: videoThumbnail || "",
		videoUri: videoUri || "",
		videoId,
		studentId,
		coachId,
		textNotes: textNotes || "",
		drills: Array.isArray(drills) ? drills : [],
		exercises: Array.isArray(exercises) ? exercises : [],
		explainers: Array.isArray(explainers) ? explainers : [],
		voiceNoteUri: voiceNoteUri || "",
		createdAt: new Date().toISOString(),
	}

	try {
		// Initialize Cosmos DB client
		const client = new CosmosClient(COSMOS_CONNECTION_STRING)
		const db = client.database("becomebetter")
		const container = db.container("feedback")

		// Save feedback
		const { resource } = await container.items.create(feedbackData)

		context.log("✅ Feedback saved with ID:", feedbackData.id)

		context.res = {
			status: 200,
			body: { message: "Feedback saved", feedbackId: feedbackData.id },
		}
	} catch (err) {
		context.log("❌ Feedback save error:", err.message || err)
		context.res = {
			status: 500,
			body: "Failed to save feedback",
		}
	}
}
