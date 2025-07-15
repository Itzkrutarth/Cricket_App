const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "becomebetter";
const containerId = "users";

module.exports = async function (context, req) {
	let body = req.body;

	// Fallback for rawBody if needed
	if (!body && req.rawBody) {
		try {
			body = JSON.parse(req.rawBody);
		} catch (e) {
			context.res = {
				status: 400,
				body: "Invalid JSON in request body.",
			};
			return;
		}
	}

	const { studentId, coachId } = body || {};

	if (!studentId || !coachId) {
		context.res = {
			status: 400,
			body: "Missing studentId or coachId in request.",
		};
		return;
	}

	const client = new CosmosClient({ endpoint, key });
	const container = client.database(databaseId).container(containerId);

	try {
		const { resource: studentDoc } = await container.item(studentId, studentId).read();

		if (!studentDoc) {
			context.res = {
				status: 404,
				body: "Student not found.",
			};
			return;
		}

		// Add coach to student.coaches if not already present
		studentDoc.coaches = Array.from(new Set([...(studentDoc.coaches || []), coachId]));

		await container.item(studentId, studentId).replace(studentDoc);

		context.res = {
			status: 200,
			body: {
				message: "Coach added to student successfully.",
				updatedStudent: studentDoc,
			},
		};
	} catch (err) {
		context.log("AddCoachToStudent error:", err.message);
		context.res = {
			status: 500,
			body: "Failed to update student document.",
		};
	}
};
