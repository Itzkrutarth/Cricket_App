const { BlobServiceClient } = require("@azure/storage-blob")
const { CosmosClient } = require("@azure/cosmos")

const COSMOS_DB_ENDPOINT = process.env.COSMOS_DB_ENDPOINT
const COSMOS_DB_KEY = process.env.COSMOS_DB_KEY
const COSMOS_DB_NAME = "becomebetter"
const CONTAINER_NAME = "videos"

const BLOB_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING
const BLOB_CONTAINER_NAME = "videos"

module.exports = async function (context, req) {
	const videoId = req.query.id || (req.body && req.body.id)
	if (!videoId) {
		context.res = {
			status: 400,
			body: "Missing video id",
		}
		return
	}

	try {
		// Cosmos DB: Find and delete document
		const cosmosClient = new CosmosClient({
			endpoint: COSMOS_DB_ENDPOINT,
			key: COSMOS_DB_KEY,
		})
		const container = cosmosClient
			.database(COSMOS_DB_NAME)
			.container(CONTAINER_NAME)

		// Find document to get partition key
		const query = {
			query: "SELECT * FROM c WHERE c.id = @id",
			parameters: [{ name: "@id", value: videoId }],
		}
		const { resources } = await container.items.query(query).fetchAll()
		if (resources.length === 0) {
			context.res = {
				status: 404,
				body: `Video with id ${videoId} not found`,
			}
			return
		}

		const item = resources[0]
		const partitionKey = item.ownerId
		await container.item(videoId, partitionKey).delete()

		// Blob Storage: Delete blob
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			BLOB_CONNECTION_STRING
		)
		const containerClient =
			blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME)
		const blobClient = containerClient.getBlobClient(videoId)
		await blobClient.deleteIfExists()

		context.res = {
			status: 200,
			body: `Video ${videoId} deleted successfully.`,
		}
	} catch (error) {
		console.error("Error deleting video:", error.message)
		context.res = {
			status: 500,
			body: "Internal Server Error",
		}
	}
}
