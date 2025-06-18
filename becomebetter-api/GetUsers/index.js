const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
	const endpoint = process.env.COSMOS_DB_ENDPOINT
	const key = process.env.COSMOS_DB_KEY
	const databaseId = "becomebetter"
	const containerId = "users"

	const role = req.query.role // optional

	context.log("🔍 Incoming role filter:", role)
	context.log("✅ Connecting to CosmosDB:", endpoint)

	try {
		const client = new CosmosClient({ endpoint, key })
		const container = client.database(databaseId).container(containerId)

		const query = role
			? {
					query: "SELECT * FROM c WHERE c.role = @role",
					parameters: [{ name: "@role", value: role }],
			  }
			: { query: "SELECT * FROM c" }

		context.log("🧠 Query to be executed:", JSON.stringify(query))

		const { resources: users } = await container.items.query(query).fetchAll()

		context.res = {
			status: 200,
			body: users,
		}
	} catch (err) {
		context.log.error("❌ Error in GetUsers function:", err.message)
		context.log.error("Stack Trace:", err.stack)
		context.res = {
			status: 500,
			body: { message: "Internal Server Error", error: err.message },
		}
	}
}
