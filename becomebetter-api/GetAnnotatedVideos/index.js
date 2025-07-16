const { CosmosClient } = require("@azure/cosmos");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;

module.exports = async function (context, req) {
	const studentId = req.query.studentId;

	if (!studentId) {
		context.res = {
			status: 400,
			body: "Missing studentId",
		};
		return;
	}

	try {
		const client = new CosmosClient(COSMOS_CONNECTION_STRING);
		const db = client.database("becomebetter");
		const container = db.container("annotations");

		const query = {
			query: "SELECT * FROM c WHERE c.recordedFor = @studentId",
			parameters: [{ name: "@studentId", value: studentId }],
		};

		const { resources } = await container.items
			.query(query, { partitionKey: studentId })
			.fetchAll();

		context.res = {
			status: 200,
			body: resources,
		};
	} catch (err) {
		context.log("❌ Error fetching annotated videos:", err);
		context.res = {
			status: 500,
			body: "Failed to fetch videos",
		};
	}
};
