const { BlobServiceClient } = require("@azure/storage-blob")
const { CosmosClient } = require("@azure/cosmos")

const COSMOS_DB_ENDPOINT = process.env.COSMOS_DB_ENDPOINT
const COSMOS_DB_KEY = process.env.COSMOS_DB_KEY
const COSMOS_DB_NAME = "becomebetter"
const CONTAINER_NAME = "videos"

const BLOB_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING
const BLOB_CONTAINER_NAME = "videos"

module.exports = async function (context, req) {
	console.log("Function triggered")

	const videoId = req.query.id || (req.body && req.body.id)
	console.log("Received videoId:", videoId)

	if (!videoId) {
		context.res = {
			status: 400,
			body: "Missing video id",
		}
		return
	}

	try {
		// Initialize Cosmos DB client and container
		const cosmosClient = new CosmosClient({
			endpoint: COSMOS_DB_ENDPOINT,
			key: COSMOS_DB_KEY,
		})
		const container = cosmosClient
			.database(COSMOS_DB_NAME)
			.container(CONTAINER_NAME)

		// Query for the video document
		const querySpec = {
			query: "SELECT * FROM c WHERE c.id = @id",
			parameters: [{ name: "@id", value: videoId }],
		}
		const { resources } = await container.items.query(querySpec).fetchAll()

		if (resources.length === 0) {
			context.res = {
				status: 404,
				body: `Video with id ${videoId} not found in Cosmos DB`,
			}
			return
		}

		const videoDoc = resources[0]
		const partitionKey = videoDoc.uploadedBy

		// Delete the video document from Cosmos DB
		await container.item(videoId, partitionKey).delete()
		console.log(`Deleted video document from Cosmos DB: ${videoId}`)

		// Delete the blob from Azure Blob Storage
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			BLOB_CONNECTION_STRING
		)
		const containerClient =
			blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME)
		const blobClient = containerClient.getBlobClient(videoId) // Ensure videoId matches blob name exactly (with extension)

		const deleteResponse = await blobClient.deleteIfExists()
		console.log(
			`Deleted blob from Azure Storage: ${videoId}`,
			deleteResponse.succeeded ? "Success" : "Blob not found"
		)

		context.res = {
			status: 200,
			body: `Video ${videoId} deleted successfully from Cosmos DB and Blob Storage.`,
		}
	} catch (error) {
		console.error("Error deleting video:", error)
		context.res = {
			status: 500,
			body: "Internal Server Error",
		}
	}
}
