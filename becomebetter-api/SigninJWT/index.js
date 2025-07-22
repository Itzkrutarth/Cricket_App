const { CosmosClient } = require("@azure/cosmos")
const jwt = require("jsonwebtoken")

console.log("🔍 EARLY LOG: COSMOS_DB_ENDPOINT:", process.env.COSMOS_DB_ENDPOINT)
console.log(
	"🔍 EARLY LOG: COSMOS_DB_KEY length:",
	process.env.COSMOS_DB_KEY?.length || "undefined"
)
console.log(
	"🔍 EARLY LOG: JWT_SECRET length:",
	process.env.JWT_SECRET?.length || "undefined"
)

module.exports = async function (context, req) {
	context.log("🔍 ENV VARS:")
	context.log("COSMOS_DB_ENDPOINT:", process.env.COSMOS_DB_ENDPOINT)
	context.log(
		"COSMOS_DB_KEY length:",
		process.env.COSMOS_DB_KEY?.length || "undefined"
	)
	context.log(
		"JWT_SECRET length:",
		process.env.JWT_SECRET?.length || "undefined"
	)
	const { email, password } = req.body
	if (!email || !password) {
		context.res = { status: 400, body: "Email and password required." }
		return
	}

	try {
		const client = new CosmosClient({
			endpoint: process.env.COSMOS_DB_ENDPOINT,
			key: process.env.COSMOS_DB_KEY,
		})
		const container = client.database("becomebetter").container("users")

		const query = {
			query: "SELECT * FROM c WHERE c.email = @email",
			parameters: [{ name: "@email", value: email }],
		}

		const { resources: users } = await container.items.query(query).fetchAll()
		if (users.length === 0 || users[0].password !== password) {
			context.res = { status: 401, body: "Invalid credentials" }
			return
		}

		const user = users[0]
		const token = jwt.sign(
			{
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				profilePic: user.profilePictureUrl || "",
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		)

		context.res = {
			status: 200,
			body: {
				token,
				name: user.name,
				id: user.id,
				role: user.role,
				profilePic: user.profilePictureUrl || "",
			},
		}
	} catch (err) {
		context.res = { status: 500, body: "Server error" }
	}
}
