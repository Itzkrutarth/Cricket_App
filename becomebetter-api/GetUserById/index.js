const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
	const endpoint = process.env.COSMOS_DB_ENDPOINT;
	const key = process.env.COSMOS_DB_KEY;
	const databaseId = "becomebetter";
	const containerId = "users";

	const userId = req.query.id;

	context.log("🧾 Incoming GetUserById request:", userId);
	context.log("✅ Connecting to CosmosDB:", endpoint);

	if (!userId) {
		context.res = {
			status: 400,
			body: { message: "Missing required 'id' query parameter." },
		};
		return;
	}

	try {
		const client = new CosmosClient({ endpoint, key });
		const container = client.database(databaseId).container(containerId);

		const query = {
			query: "SELECT * FROM c WHERE c.id = @id",
			parameters: [{ name: "@id", value: userId }],
		};

		context.log("🧠 Executing query:", JSON.stringify(query));

		const { resources: results } = await container.items.query(query).fetchAll();

		if (!results || results.length === 0) {
			context.res = {
				status: 404,
				body: { message: `No user found with id '${userId}'`},
			};
			return;
		}

		context.res = {
			status: 200,
			headers: { "Content-Type": "application/json" },
			body: results[0],
		};
	} catch (err) {
		context.log.error("❌ Error in GetUserById:", err.message);
		context.res = {
			status: 500,
			body: { message: "Internal Server Error", error: err.message },
		};
	}
};
