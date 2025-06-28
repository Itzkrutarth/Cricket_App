const { CosmosClient } = require("@azure/cosmos")

const endpoint = process.env.COSMOS_DB_ENDPOINT
const key = process.env.COSMOS_DB_KEY
const databaseId = "becomebetter"
const containerId = "users"

module.exports = async function (context, req) {
	let body = req.body

	// Fallback if body is not parsed automatically
	if (!body && req.rawBody) {
		try {
			body = JSON.parse(req.rawBody)
		} catch (e) {
			context.res = {
				status: 400,
				body: "Invalid JSON in request body.",
			}
			return
		}
	}

	const { coachId, studentId } = body || {}

	if (!coachId || !studentId) {
		context.res = {
			status: 400,
			body: "Missing coachId or studentId in request.",
		}
		return
	}

	const client = new CosmosClient({ endpoint, key })
	const container = client.database(databaseId).container(containerId)

	try {
		const { resource: studentDoc } = await container
			.item(studentId, studentId)
			.read()

		if (!studentDoc) {
			context.res = {
				status: 404,
				body: "Student not found.",
			}
			return
		}

		studentDoc.coaches = (studentDoc.coaches || []).filter(
			(id) => id !== coachId
		)

		await container.item(studentId, studentId).replace(studentDoc)

		context.res = {
			status: 200,
			body: {
				message: "Coach removed from student successfully",
				updatedStudent: studentDoc,
			},
		}
	} catch (err) {
		context.log("RemoveCoachFromStudent error:", err.message)
		context.res = {
			status: 500,
			body: "Failed to update student document.",
		}
	}
}
