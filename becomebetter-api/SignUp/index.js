const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
	context.log("📥 Incoming request:", req.body)

	const {
		name,
		email,
		username,
		password,
		phoneNumber,
		gender,
		role,
		birthDate,
		profilePictureUrl,
	} = req.body || {}

	if (!email || !password || !name) {
		context.res = {
			status: 400,
			body: "Missing required fields.",
		}
		return
	}

	try {
		const endpoint = process.env.COSMOS_DB_ENDPOINT
		const key = process.env.COSMOS_DB_KEY
		const client = new CosmosClient({ endpoint, key })

		const database = client.database("becomebetter")
		const container = database.container("users")

		const user = {
			id: email,
			name,
			email,
			username,
			password,
			phoneNumber,
			gender,
			role,
			birthDate,
			profilePictureUrl,
			createdAt: new Date().toISOString(),
		}

		await container.items.create(user)

		context.res = {
			status: 201,
			body: "User signed up successfully with full details!",
		}
	} catch (err) {
		context.log.error("🔥 Error during signup:", err.message)
		context.res = {
			status: 500,
			body: "Signup failed: " + err.message,
		}
	}
}
