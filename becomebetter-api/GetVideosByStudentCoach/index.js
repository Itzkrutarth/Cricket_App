const { CosmosClient } = require("@azure/cosmos")

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING

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
        SELECT c.videoUrl, c.uploadedAt, c.durationSeconds 
        FROM c 
        WHERE c.ownerId = @studentId AND c.assignedCoachId = @coachId
      `,
			parameters: [
				{ name: "@studentId", value: studentId },
				{ name: "@coachId", value: coachId },
			],
		}

		const { resources: results } = await container.items
			.query(querySpec)
			.fetchAll()

		context.res = {
			status: 200,
			headers: { "Content-Type": "application/json" },
			body: results,
		}
	} catch (err) {
		context.log.error("Cosmos query failed:", err)
		context.res = {
			status: 500,
			body: `Internal server error: ${err.message}`,
		}
	}
}
