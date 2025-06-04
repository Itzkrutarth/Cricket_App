const { BlobServiceClient } = require("@azure/storage-blob")
const { CosmosClient } = require("@azure/cosmos")

const AZURE_STORAGE_CONNECTION_STRING =
	process.env.AZURE_STORAGE_CONNECTION_STRING
const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING

module.exports = async function (context, req) {
	const { videoData, filename, uploadedBy } = req.body

	if (!videoData || !filename || !uploadedBy) {
		context.res = { status: 400, body: "Missing required fields" }
		return
	}

	try {
		const buffer = Buffer.from(videoData, "base64")

		// Upload to Azure Blob
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		)
		const containerClient = blobServiceClient.getContainerClient("videos")
		const blockBlobClient = containerClient.getBlockBlobClient(filename)

		await blockBlobClient.uploadData(buffer, {
			blobHTTPHeaders: { blobContentType: "video/mp4" },
		})

		const videoUrl = blockBlobClient.url

		// Save metadata to Cosmos DB
		const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING)
		const db = cosmosClient.database("becomebetter")
		const container = db.container("videos")

		await container.items.create({
			id: filename,
			uploadedBy,
			videoUrl,
			uploadedAt: new Date().toISOString(),
		})

		context.res = {
			status: 200,
			body: { message: "Video uploaded successfully", videoUrl },
		}
	} catch (error) {
		context.log.error(error)
		context.res = {
			status: 500,
			body: "Upload failed: " + error.message,
		}
	}
}
