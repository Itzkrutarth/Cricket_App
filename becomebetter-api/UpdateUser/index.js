const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
	const { id, ...updateFields } = req.body

	if (!id) {
		context.res = { status: 400, body: "Missing user ID in request." }
		return
	}

	const client = new CosmosClient({
		endpoint: process.env.COSMOS_DB_ENDPOINT,
		key: process.env.COSMOS_DB_KEY,
	})
	const container = client.database("becomebetter").container("users")

	try {
		// Fetch existing user
		const { resource: existingUser } = await container.item(id, id).read()
		if (!existingUser) {
			context.res = { status: 404, body: "User not found." }
			return
		}

		// Update only specified fields
		const updatedUser = { ...existingUser, ...updateFields }

		// Save updated document
		await container.item(id, id).replace(updatedUser)

		context.res = {
			status: 200,
			body: { message: "User updated successfully", updatedUser },
		}
	} catch (err) {
		context.log("UpdateUser Error:", err)
		context.res = {
			status: 500,
			body: "Error updating user: " + err.message,
		}
	}
}
