const { CosmosClient } = require("@azure/cosmos");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;

module.exports = async function (context, req) {
	const studentId = req.query.studentId;

	if (!studentId) {
		context.res = {
			status: 400,
			body: "Missing studentId query parameter",
		};
		return;
	}

	try {
		const client = new CosmosClient(COSMOS_CONNECTION_STRING);

		// Containers
		const db = client.database("becomebetter");
		const usersContainer = db.container("users");
		const videosContainer = db.container("videos");

		// 1. Fetch student document
		const { resource: student } = await usersContainer.item(studentId, studentId).read();
		if (!student) {
			context.res = {
				status: 404,
				body: "Student not found",
			};
			return;
		}

		// 2. myCoach count from user's metadata
		const myCoach = (student.coaches || []).filter(email => email && email.trim() !== "").length;

		// 3. videos count from videos container
		const videoQuery = {
			query: "SELECT VALUE COUNT(1) FROM c WHERE c.recordedFor = @studentId",
			parameters: [{ name: "@studentId", value: studentId }],
		};
		const { resources: videoResult } = await videosContainer.items.query(videoQuery).fetchAll();
		const videos = videoResult[0] || 0;

		// 4. totalCoaches count (users with role === 'Coach')
		const coachQuery = {
			query: "SELECT VALUE COUNT(1) FROM c WHERE c.role = 'Coach'",
		};
		const { resources: coachResult } = await usersContainer.items.query(coachQuery).fetchAll();
		const totalCoaches = coachResult[0] || 0;

		// ✅ Respond with counts
		context.res = {
			status: 200,
			body: {
				myCoach,
				videos,
				totalCoaches,
			},
		};
	} catch (error) {
		context.log.error("❌ Error:", error);
		context.res = {
			status: 500,
			body: "Internal server error: " + error.message,
		};
	}
};
