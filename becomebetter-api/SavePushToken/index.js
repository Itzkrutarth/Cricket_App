const { CosmosClient } = require("@azure/cosmos")

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY
const databaseId = "becomebetter"
const containerId = "users"

const client = new CosmosClient({ endpoint, key })

module.exports = async function (context, req) {
	context.log("📩 SavePushToken function triggered.")

	const { email, pushToken } = req.body

	if (!email || !pushToken) {
		context.res = {
			status: 400,
			body: "Missing email or pushToken.",
		}
		return
	}

	try {
		const database = client.database(databaseId)
		const container = database.container(containerId)

		const { resource: existingUser } = await container.item(email, email).read()

		if (existingUser) {
			const existingTokens = existingUser.pushTokens || []
			const tokenSet = new Set(existingTokens)
			tokenSet.add(pushToken)

			existingUser.pushTokens = Array.from(tokenSet)

			await container.item(email, email).replace(existingUser)

			context.res = {
				status: 200,
				body: "✅ Push token updated.",
			}
		} else {
			const newUser = {
				id: email,
				email,
				pushTokens: [pushToken],
			}

			await container.items.create(newUser)

			context.res = {
				status: 201,
				body: "✅ New user and push token saved.",
			}
		}
	} catch (err) {
		context.log.error("❌ Error saving token:", err.message || err)
		context.res = {
			status: 500,
			body: "Internal Server Error while saving token.",
		}
	}
}
