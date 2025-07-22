const { CosmosClient } = require("@azure/cosmos")
const {
	BlobServiceClient,
	StorageSharedKeyCredential,
	generateBlobSASQueryParameters,
	BlobSASPermissions,
	SASProtocol,
} = require("@azure/storage-blob")

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING
const AZURE_STORAGE_CONNECTION_STRING =
	process.env.AZURE_STORAGE_CONNECTION_STRING
const AZURE_STORAGE_ACCOUNT_NAME = "becomebetterstorage"
const FEEDBACK_CONTAINER_NAME = "feedback" // ✅ Upload voice note to this

function extractAccountKey(connString) {
	const parts = connString.split(";")
	return parts.find((p) => p.startsWith("AccountKey="))?.split("=")[1]
}

const AZURE_STORAGE_ACCOUNT_KEY = extractAccountKey(
	AZURE_STORAGE_CONNECTION_STRING
)

// Generate SAS URL
function generateSasUrl(blobName) {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		AZURE_STORAGE_ACCOUNT_NAME,
		AZURE_STORAGE_ACCOUNT_KEY
	)

	const blobEndpoint = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`
	const blobSas = generateBlobSASQueryParameters(
		{
			containerName: FEEDBACK_CONTAINER_NAME,
			blobName,
			permissions: BlobSASPermissions.parse("r"),
			startsOn: new Date(),
			expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
			protocol: SASProtocol.Https,
		},
		sharedKeyCredential
	)

	return `${blobEndpoint}/${FEEDBACK_CONTAINER_NAME}/${blobName}?${blobSas}`
}

module.exports = async function (context, req) {
	try {
		const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body

		const {
			studentId,
			coachId,
			videoId,
			videoUri,
			videoThumbnail,
			sessionTitle,
			textNotes,
			drills,
			exercises,
			explainers,
			voiceNoteBase64,
			voiceNoteFileName,
		} = body

		let voiceNoteUri = ""

		if (voiceNoteBase64 && voiceNoteFileName) {
			const buffer = Buffer.from(voiceNoteBase64, "base64")

			const blobServiceClient = BlobServiceClient.fromConnectionString(
				AZURE_STORAGE_CONNECTION_STRING
			)

			const containerClient = blobServiceClient.getContainerClient(
				FEEDBACK_CONTAINER_NAME
			)

			// Ensure container exists
			await containerClient.createIfNotExists()

			const blockBlobClient =
				containerClient.getBlockBlobClient(voiceNoteFileName)

			await blockBlobClient.uploadData(buffer, {
				blobHTTPHeaders: { blobContentType: "audio/m4a" },
			})

			voiceNoteUri = generateSasUrl(voiceNoteFileName)
		}

		const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING)
		const db = cosmosClient.database("becomebetter")
		const container = db.container("feedback")

		//testing for video status update,remove if dont work
		const videosContainer = db.container("videos")

		//testing for video status update,remove if dont work
		const item = {
			id: `${videoId}-${Date.now()}`,
			email: studentId,
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
			createdAt: new Date().toISOString(),
		}

		await container.items.create(item)
		//testing for video status update,remove if dont work
		// 🔍 Update feedbackStatus in video document

		const videoQuery = {
			query: "SELECT * FROM c WHERE c.id = @videoId",
			parameters: [{ name: "@videoId", value: videoId }],
		}
		context.log("🔍 Querying videos container for videoId:", videoId)
		const { resources: videoDocs } = await videosContainer.items
			.query(videoQuery)
			.fetchAll()

		if (videoDocs.length > 0) {
			const videoDoc = videoDocs[0]
			const uploadedBy = videoDoc.uploadedBy

			context.log("✅ Found video. uploadedBy:", uploadedBy)

			videoDoc.feedbackStatus = "Reviewed"

			await videosContainer.item(videoId, uploadedBy).replace(videoDoc)
			context.log("✅ feedbackStatus updated to 'Reviewed'")
		} else {
			context.log("❌ No video document found for videoId:", videoId)
		}

		//testing for video status update,remove if dont work

		context.res = {
			status: 200,
			body: {
				message: "Feedback saved successfully.",
				voiceNoteUri,
			},
		}
	} catch (err) {
		console.error("❌ Error saving feedback:", err.message)
		context.res = {
			status: 500,
			body: { message: "Failed to save feedback.", error: err.message },
		}
	}
}
