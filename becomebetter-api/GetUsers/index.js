const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
	const endpoint = process.env.COSMOS_DB_ENDPOINT
	const key = process.env.COSMOS_DB_KEY
	const databaseId = "becomebetter-db"
	const containerId = "users"

	const role = req.query.role // optional query param

	try {
		const client = new CosmosClient({ endpoint, key })
		const container = client.database(databaseId).container(containerId)

		const query = role
			? {
					query: "SELECT * FROM c WHERE c.role = @role",
					parameters: [{ name: "@role", value: role }],
			  }
			: { query: "SELECT * FROM c" }

		const { resources: users } = await container.items.query(query).fetchAll()

		context.res = {
			status: 200,
			body: users,
		}
	} catch (err) {
		context.log.error("❌ Error in GetUsers function:", err.message)
		context.res = {
			status: 500,
			body: { message: "Internal Server Error" },
		}
	}
}
