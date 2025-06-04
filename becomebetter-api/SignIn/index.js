const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
	context.log("📥 Incoming login request")

	const { email, password } = req.body

	if (!email || !password) {
		context.res = {
			status: 400,
			body: "Email and password are required.",
		}
		return
	}

	try {
		// Cosmos DB config
		const endpoint = process.env.COSMOS_DB_ENDPOINT
		const key = process.env.COSMOS_DB_KEY
		const databaseId = "becomebetter"
		const containerId = "users"

		const client = new CosmosClient({ endpoint, key })
		const database = client.database(databaseId)
		const container = database.container(containerId)

		// Query user by email
		const query = {
			query: "SELECT * FROM c WHERE c.email = @email",
			parameters: [{ name: "@email", value: email }],
		}

		const { resources: users } = await container.items.query(query).fetchAll()

		if (users.length === 0) {
			context.res = {
				status: 401,
				body: "User not found.",
			}
			return
		}

		const user = users[0]

		if (user.password !== password) {
			context.res = {
				status: 401,
				body: "Incorrect password.",
			}
			return
		}

		context.res = {
			status: 200,
			body: {
				message: "Login successful",
				user: {
					name: user.name,
					email: user.email,
					role: user.role,
					profilePictureUrl: user.profilePictureUrl || null,
				},
			},
		}
	} catch (err) {
		context.log("❌ Error during SignIn:", err.message)
		context.res = {
			status: 500,
			body: "Internal server error",
		}
	}
}
