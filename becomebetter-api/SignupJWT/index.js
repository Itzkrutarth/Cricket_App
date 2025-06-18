const { CosmosClient } = require("@azure/cosmos")
const jwt = require("jsonwebtoken")

module.exports = async function (context, req) {
	const userData = req.body

	context.log("📥 Received signup request with data:", JSON.stringify(userData))

	if (!userData?.email || !userData?.password || !userData?.name) {
		context.res = {
			status: 400,
			body: "Missing required fields.",
		}
		return
	}

	try {
		context.log("🔐 Creating Cosmos DB client...")
		const client = new CosmosClient({
			endpoint: process.env.COSMOS_DB_ENDPOINT,
			key: process.env.COSMOS_DB_KEY,
		})

		const container = client.database("becomebetter").container("users")

		const newUser = {
			...userData,
			id: userData.email,
			profilePictureUrl: userData.profilePictureUrl || "",
			createdAt: new Date().toISOString(),
			// ✅ Add role-specific relationship field
			...(userData.role === "Coach"
				? { students: [] }
				: userData.role === "Player"
				? { coaches: [] }
				: {}),
		}

		context.log("📝 Creating user in DB:", newUser.email)
		await container.items.create(newUser)

		context.log("🔏 Signing JWT...")
		const token = jwt.sign(
			{
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				profilePic: newUser.profilePictureUrl,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		)

		context.log("✅ Signup successful")

		context.res = {
			status: 201,
			body: {
				token,
				name: newUser.name,
				id: newUser.id,
				role: newUser.role,
				profilePic: newUser.profilePictureUrl,
			},
		}
	} catch (err) {
		context.log("❌ FULL ERROR LOG:", err) // 🔥 log the full error object
		context.res = {
			status: 500,
			body: "Signup failed: " + err.message,
		}
	}
}
