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
const CONTAINER_NAME = "videos"

// Extract storage account key from connection string
function extractAccountKey(connString) {
	const parts = connString.split(";")
	return parts.find((p) => p.startsWith("AccountKey="))?.split("=")[1]
}

const AZURE_STORAGE_ACCOUNT_KEY = extractAccountKey(
	AZURE_STORAGE_CONNECTION_STRING
)

// Generate SAS URL for a given blob
function generateSasUrl(blobName) {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		AZURE_STORAGE_ACCOUNT_NAME,
		AZURE_STORAGE_ACCOUNT_KEY
	)

	const sasToken = generateBlobSASQueryParameters(
		{
			containerName: CONTAINER_NAME,
			blobName,
			permissions: BlobSASPermissions.parse("r"), // Read-only
			startsOn: new Date(),
			expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
			protocol: SASProtocol.Https,
		},
		sharedKeyCredential
	).toString()

	return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?${sasToken}`
}

module.exports = async function (context, req) {
	const studentId = req.query.studentId
	const coachId = req.query.coachId

	if (!studentId || !coachId) {
		context.res = {
			status: 400,
			body: "Missing studentId or coachId in query parameters",
		}
		return
	}

	try {
		const client = new CosmosClient(COSMOS_CONNECTION_STRING)
		const database = client.database("becomebetter")
		const container = database.container("videos")

		const querySpec = {
			query: `
		SELECT * 
		FROM c 
		WHERE c.recordedFor = @studentId AND c.assignedCoachId = @coachId
	`,
			parameters: [
				{ name: "@studentId", value: studentId },
				{ name: "@coachId", value: coachId },
			],
		}

		const { resources: results } = await container.items
			.query(querySpec)
			.fetchAll()

		// Attach SAS URL to each video
		const resultsWithSas = results.map((video) => ({
			...video,
			sasUrl: generateSasUrl(video.id), // assumes `video.id` matches blob name
		}))

		context.res = {
			status: 200,
			headers: { "Content-Type": "application/json" },
			body: resultsWithSas,
		}
	} catch (err) {
		context.log.error("Cosmos query failed:", err)
		context.res = {
			status: 500,
			body: `Internal server error: ${err.message}`,
		}
	}
}
