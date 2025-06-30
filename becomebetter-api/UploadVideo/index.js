const { BlobServiceClient } = require("@azure/storage-blob")
const { CosmosClient } = require("@azure/cosmos")

const AZURE_STORAGE_CONNECTION_STRING =
	process.env.AZURE_STORAGE_CONNECTION_STRING
const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING

module.exports = async function (context, req) {
	const {
		videoData,
		filename,
		uploadedBy, // person uploading (coach or student)
		assignedCoachId, // always a coach
		recordedFor, // NEW: student for whom video was recorded
		durationSeconds,
	} = req.body

	if (
		!videoData ||
		!filename ||
		!uploadedBy ||
		!assignedCoachId ||
		!recordedFor ||
		!durationSeconds
	) {
		context.res = {
			status: 400,
			body: "Missing required fields (videoData, filename, uploadedBy, assignedCoachId, recordedFor, durationSeconds)",
		}
		return
	}

	try {
		const buffer = Buffer.from(videoData, "base64")

		// Upload to Azure Blob Storage
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		)
		const containerClient = blobServiceClient.getContainerClient("videos")
		const blockBlobClient = containerClient.getBlockBlobClient(filename)
		const videoId = filename

		await blockBlobClient.uploadData(buffer, {
			blobHTTPHeaders: { blobContentType: "video/mp4" },
		})

		const videoUrl = blockBlobClient.url

		// Save metadata to Cosmos DB
		const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING)
		const db = cosmosClient.database("becomebetter")
		const container = db.container("videos")

		const newItem = {
			id: filename,
			videoUrl,
			uploadedBy, // partition key
			recordedFor, // always the student
			assignedCoachId,
			visibleTo: [assignedCoachId],
			type: "original",
			linkedVideoId: null,
			isPrivate: true,
			durationSeconds,
			feedbackStatus: "pending",
			uploadedAt: new Date().toISOString(),
		}

		await container.items.create(newItem, { partitionKey: uploadedBy })

		context.res = {
			status: 200,
			body: {
				message: "Video uploaded and saved successfully",
				videoUrl,
				videoId: videoId, // Add this line
			},
		}
	} catch (error) {
		context.log.error(error)
		context.res = {
			status: 500,
			body: "Upload failed: " + error.message,
		}
	}
}
